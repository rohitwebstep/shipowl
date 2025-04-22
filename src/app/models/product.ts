import prisma from "@/lib/prisma";
import { logMessage } from "@/utils/commonUtils";

interface Variant {
    id?: number; // Assuming you have an ID for the variant
    color: string;
    sku: string;
    qty: number;
    currency: string;
    article_id: string;
    suggested_price: number;
    shipowl_price: number;
    rto_suggested_price: number;
    rto_price: number;
    images: string;
}

interface VariantSKUInput {
    sku: string;
    id?: number | null;
}

interface Product {
    name: string;
    categoryId: number;
    main_sku: string;
    ean: string | null;
    hsnCode: string | null;
    taxRate: number | null;
    upc: string | null;
    rtoAddress: string | null;
    pickupAddress: string | null;
    description: string | null;
    tags: string;
    brandId: number;
    originCountryId: number;
    shippingCountryId: number;
    list_as: string | null;
    shipping_time: string | null;
    weight: number | null;
    package_length: number | null;
    package_width: number | null;
    package_height: number | null;
    chargeable_weight: number | null;
    variants: Variant[];
    product_detail_video?: string | null;
    status: boolean;
    package_weight_image?: string | null;
    package_length_image?: string | null;
    package_width_image?: string | null;
    package_height_image?: string | null;
    video_url?: string | null;
    training_guidance_video?: string | null;
    createdBy?: number | null;
    createdByRole?: string | null;
    updatedBy?: number | null;
    updatedAt?: Date;
    updatedByRole?: string | null;
    deletedBy?: number | null;
    deletedAt?: Date;
    deletedByRole?: string | null;
}

const serializeBigInt = <T>(obj: T): T => {
    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt) as T;
    } else if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        ) as T;
    } else if (typeof obj === 'bigint') {
        return obj.toString() as T;
    }
    return obj;
};

export async function checkMainSKUAvailability(main_sku: string) {
    try {
        const existing = await prisma.product.findUnique({
            where: { main_sku },
        });

        if (existing) {
            return {
                status: false,
                message: `SKU "${main_sku}" is already in use.`,
            };
        }

        return {
            status: true,
            message: `SKU "${main_sku}" is available.`,
        };
    } catch (error) {
        console.error("Error checking SKU:", error);
        return {
            status: false,
            message: "Error while checking SKU availability.",
        };
    }
}

export async function checkMainSKUAvailabilityForUpdate(main_sku: string, productId: number) {
    try {
        const existing = await prisma.product.findUnique({
            where: {
                main_sku,
                NOT: {
                    id: productId,  // Exclude the current product being updated
                },
            },

        });

        if (existing) {
            return {
                status: false,
                message: `SKU "${main_sku}" is already in use.`,
            };
        }

        return {
            status: true,
            message: `SKU "${main_sku}" is available.`,
        };
    } catch (error) {
        console.error("Error checking SKU:", error);
        return {
            status: false,
            message: "Error while checking SKU availability.",
        };
    }
}

export async function checkVariantSKUsAvailability(skus: string[]) {
    try {
        // Get existing SKUs from the database
        const existingVariants = await prisma.productVariant.findMany({
            where: {
                sku: {
                    in: skus
                }
            },
            select: {
                sku: true
            }
        });

        if (existingVariants.length > 0) {
            const usedSkus = existingVariants.map(v => v.sku);
            return {
                status: false,
                message: `The following SKUs are already in use: ${usedSkus.join(', ')}`,
                usedSkus
            };
        }

        return {
            status: true,
            message: `All SKUs are available.`,
        };
    } catch (error) {
        console.error("Error checking variant SKUs:", error);
        return {
            status: false,
            message: "Error while checking variant SKU availability.",
        };
    }
}

export async function checkVariantSKUsAvailabilityForUpdate(variants: VariantSKUInput[], productId: number) {
    try {
        const skus = variants.map(v => v.sku);

        // Fetch existing variants with matching SKUs, excluding current productId
        const existingVariants = await prisma.productVariant.findMany({
            where: {
                sku: {
                    in: skus,
                },
                NOT: {
                    productId,
                },
            },
            select: {
                sku: true,
                id: true,
            },
        });

        // Filter out variants that match the same id (i.e., currently being updated)
        const conflictingSkus = existingVariants.filter(ev => {
            const incomingVariant = variants.find(v => v.sku === ev.sku);
            return !incomingVariant?.id || incomingVariant.id !== ev.id;
        });

        if (conflictingSkus.length > 0) {
            const usedSkus = conflictingSkus.map(v => v.sku);
            return {
                status: false,
                message: `The following SKUs are already in use: ${usedSkus.join(', ')}`,
                usedSkus,
            };
        }

        return {
            status: true,
            message: 'All SKUs are available.',
        };
    } catch (error) {
        console.error('Error checking variant SKUs:', error);
        return {
            status: false,
            message: 'Error while checking variant SKU availability.',
        };
    }
}

export async function generateProductSlug(name: string) {
    let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let isSlugTaken = true;
    let suffix = 0;

    // Keep checking until an unused slug is found
    while (isSlugTaken) {
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });

        if (existingProduct) {
            // If the slug already exists, add a suffix (-1, -2, etc.)
            suffix++;
            slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${suffix}`;
        } else {
            // If the slug is not taken, set isSlugTaken to false to exit the loop
            isSlugTaken = false;
        }
    }

    return slug;
}

export async function createProduct(adminId: number, adminRole: string, product: Product) {
    try {
        const {
            name,
            categoryId,
            main_sku,
            ean,
            hsnCode,
            taxRate,
            upc,
            rtoAddress,
            pickupAddress,
            description,
            tags,
            brandId,
            originCountryId,
            shippingCountryId,
            list_as,
            shipping_time,
            weight,
            package_length,
            package_width,
            package_height,
            chargeable_weight,
            variants,
            product_detail_video,
            training_guidance_video,
            status,
            package_weight_image,
            package_length_image,
            package_width_image,
            package_height_image,
            video_url,
            createdBy,
            createdByRole
        } = product;

        // Generate a unique slug for the product
        const slug = await generateProductSlug(name);

        // Create the product in the database
        const newProduct = await prisma.product.create({
            data: {
                name,
                categoryId,  // Use categoryId here
                main_sku,
                ean,
                hsnCode,
                taxRate,
                upc,
                rtoAddress,
                pickupAddress,
                description,
                tags,
                brandId,  // Use brandId here
                originCountryId,  // Use originCountryId here
                shippingCountryId,  // Use shippingCountryId here
                list_as,
                shipping_time,
                weight,
                package_length,
                package_width,
                package_height,
                chargeable_weight,
                product_detail_video,
                training_guidance_video,
                status,
                package_weight_image,
                package_length_image,
                package_width_image,
                package_height_image,
                video_url,
                createdBy,
                createdByRole,
                slug,
                createdAt: new Date(),
            },
        });

        // Convert BigInt to string for serialization
        const productWithStringBigInts = {
            ...newProduct,
            originCountryId: newProduct.originCountryId.toString(),
            shippingCountryId: newProduct.shippingCountryId.toString()
        };


        // If there are variants, create them separately in the related productVariant model
        if (variants && variants.length > 0) {
            const productVariants = variants.map(variant => ({
                color: variant.color,
                sku: variant.sku,
                qty: variant.qty,
                currency: variant.currency,
                article_id: variant.article_id,
                suggested_price: variant.suggested_price,
                shipowl_price: variant.shipowl_price,
                rto_suggested_price: variant.rto_suggested_price,
                rto_price: variant.rto_price,
                image: variant.images,
                productId: productWithStringBigInts.id // This associates the variant with the product
            }));

            // Create variants in the database
            await prisma.productVariant.createMany({
                data: productVariants,
            });
        }

        return { status: true, product: productWithStringBigInts };
    } catch (error) {
        console.error(`Error creating product:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

export const getProductsByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
    try {
        let whereCondition = {};

        switch (status) {
            case "active":
                whereCondition = { status: true, deletedAt: null };
                break;
            case "inactive":
                whereCondition = { status: false, deletedAt: null };
                break;
            case "deleted":
                whereCondition = { deletedAt: { not: null } };
                break;
            case "notDeleted":
                whereCondition = { deletedAt: null };
                break;
            default:
                throw new Error("Invalid status");
        }

        const products = await prisma.product.findMany({
            where: whereCondition,
            orderBy: { id: "desc" },
            include: { variants: true },
        });

        const sanitizedProducts = serializeBigInt(products);
        logMessage('debug', 'fetched products :', sanitizedProducts);
        return { status: true, products: sanitizedProducts };
    } catch (error) {
        console.error(`Error fetching products by status (${status}):`, error);
        return { status: false, message: "Error fetching products" };
    }
};

// 🔵 GET BY ID
export const getProductById = async (id: number) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) return { status: false, message: "Product not found" };
        return { status: true, product };
    } catch (error) {
        console.error("❌ getProductById Error:", error);
        return { status: false, message: "Error fetching product" };
    }
};

// 🟡 UPDATE
export const updateProduct = async (
    adminId: number,
    adminRole: string,
    productId: number,
    product: Product
) => {
    try {
        const {
            name,
            categoryId,
            main_sku,
            ean,
            hsnCode,
            taxRate,
            upc,
            rtoAddress,
            pickupAddress,
            description,
            tags,
            brandId,
            originCountryId,
            shippingCountryId,
            list_as,
            shipping_time,
            weight,
            package_length,
            package_width,
            package_height,
            chargeable_weight,
            variants,
            product_detail_video,
            status,
            package_weight_image,
            package_length_image,
            package_width_image,
            package_height_image,
            video_url,
        } = product;

        // Update the product details
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                categoryId,
                main_sku,
                ean,
                hsnCode,
                taxRate,
                upc,
                rtoAddress,
                pickupAddress,
                description,
                tags,
                brandId,
                originCountryId,
                shippingCountryId,
                list_as,
                shipping_time,
                weight,
                package_length,
                package_width,
                package_height,
                chargeable_weight,
                product_detail_video,
                status,
                package_weight_image,
                package_length_image,
                package_width_image,
                package_height_image,
                video_url,
                updatedBy: adminId,
                updatedByRole: adminRole,
                updatedAt: new Date(),
            },
        });

        // Handle variants: update if id exists, else create new
        if (variants && variants.length > 0) {
            for (const variant of variants) {
                if (variant.id) {
                    // Update existing variant
                    await prisma.productVariant.update({
                        where: { id: variant.id },
                        data: {
                            color: variant.color,
                            sku: variant.sku,
                            qty: variant.qty,
                            currency: variant.currency,
                            article_id: variant.article_id,
                            suggested_price: variant.suggested_price,
                            shipowl_price: variant.shipowl_price,
                            rto_suggested_price: variant.rto_suggested_price,
                            rto_price: variant.rto_price,
                            image: variant.images,
                        },
                    });
                } else {
                    // Create new variant
                    await prisma.productVariant.create({
                        data: {
                            color: variant.color,
                            sku: variant.sku,
                            qty: variant.qty,
                            currency: variant.currency,
                            article_id: variant.article_id,
                            suggested_price: variant.suggested_price,
                            shipowl_price: variant.shipowl_price,
                            rto_suggested_price: variant.rto_suggested_price,
                            rto_price: variant.rto_price,
                            image: variant.images,
                            productId: productId,
                        },
                    });
                }
            }
        }

        return { status: true, product: updatedProduct };
    } catch (error) {
        console.error("❌ updateProduct Error:", error);
        return { status: false, message: "Error updating product" };
    }
};


// 🔴 Soft DELETE (marks as deleted by setting deletedAt field)
export const softDeleteProduct = async (adminId: number, adminRole: string, id: number) => {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });
        return { status: true, message: "Product soft deleted successfully", updatedProduct };
    } catch (error) {
        console.error("❌ softDeleteProduct Error:", error);
        return { status: false, message: "Error soft deleting product" };
    }
};

// 🟢 RESTORE (Restores a soft-deleted product by setting deletedAt to null)
export const restoreProduct = async (adminId: number, adminRole: string, id: number) => {
    try {
        const restoredProduct = await prisma.product.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the product
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        return { status: true, message: "Product restored successfully", restoredProduct };
    } catch (error) {
        console.error("❌ restoreProduct Error:", error);
        return { status: false, message: "Error restoring product" };
    }
};

// 🔴 DELETE
export const deleteProduct = async (id: number) => {
    try {
        await prisma.product.delete({ where: { id } });
        return { status: true, message: "Product deleted successfully" };
    } catch (error) {
        console.error("❌ deleteProduct Error:", error);
        return { status: false, message: "Error deleting product" };
    }
};