import prisma from "@/lib/prisma";

interface Variant {
    id?: number; // Assuming you have an ID for the variant
    color: string;
    sku: string;
    qty: number;
    currency: string;
    article_id: string;
    images: string;
}

interface Product {
    name: string;
    categoryId: number;
    main_sku: string;
    ean: string | null;
    hsnCode: string | null;
    taxRate: number | null;
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
    createdBy: number | null;
    createdByRole: string | null;
    updatedBy?: number | null;
    updatedAt?: Date;
    updatedByRole?: string | null;
    deletedBy?: number | null;
    deletedAt?: Date;
    deletedByRole?: string | null;
}

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

export async function checkVariantSKUsAvailabilityForUpdate(skus: string[], productId: number) {
    try {
        // Get existing SKUs from the database
        const existingVariants = await prisma.productVariant.findMany({
            where: {
                sku: {
                    in: skus
                },
                NOT: {
                    productId: productId, // Exclude variants belonging to the product being updated
                },
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
        });

        return { status: true, products };
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
            video_url
        } = product;

        // Build the data object for updating the product
        const productUpdateData: any = {
            name,
            categoryId,
            main_sku,
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
            updatedBy: adminId,
            updatedAt: new Date(),
            updatedByRole: adminRole,
        };

        // Conditionally include images and video only if they are not empty or null
        if (package_weight_image) productUpdateData.package_weight_image = package_weight_image;
        if (package_length_image) productUpdateData.package_length_image = package_length_image;
        if (package_width_image) productUpdateData.package_width_image = package_width_image;
        if (package_height_image) productUpdateData.package_height_image = package_height_image;
        if (product_detail_video) productUpdateData.product_detail_video = product_detail_video;
        if (video_url) productUpdateData.video_url = video_url;

        // Update the product in the database
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: productUpdateData,
        });

        // Convert BigInt to string for serialization
        const productWithStringBigInts = {
            ...updatedProduct,
            originCountryId: updatedProduct.originCountryId.toString(),
            shippingCountryId: updatedProduct.shippingCountryId.toString()
        };

        // If there are variants, update them in the related productVariant model
        if (variants && variants.length > 0) {
            for (let variant of variants) {
                const variantUpdateData: any = {
                    color: variant.color,
                    sku: variant.sku,
                    qty: variant.qty,
                    currency: variant.currency,
                    article_id: variant.article_id,
                    productId: productWithStringBigInts.id // This associates the variant with the product
                };

                // Conditionally include variant image if it's not empty or null
                if (variant.images) variantUpdateData.image = variant.images;

                // Update the existing variant in the database
                await prisma.productVariant.update({
                    where: { id: variant.id }, // Assuming `variant.id` is the identifier for the existing variant
                    data: variantUpdateData,
                });
            }
        }

        return { status: true, product: productWithStringBigInts };
    } catch (error) {
        console.error(`Error updating product:`, error);
        return { status: false, message: "Internal Server Error" };
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