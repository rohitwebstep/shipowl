import prisma from "@/lib/prisma";
import path from "path";
import { deleteFile } from '@/utils/saveFiles';
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

type ImageType =
    | 'package_weight_image'
    | 'package_length_image'
    | 'package_width_image'
    | 'package_height_image';

const serializeBigInt = <T>(obj: T): T => {
    // If it's an array, recursively apply serializeBigInt to each element
    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt) as T;
    }
    // If it's an object, recursively apply serializeBigInt to each key-value pair
    else if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        ) as T;
    }
    // If it's a BigInt, convert it to a string
    else if (typeof obj === 'bigint') {
        return obj.toString() as T;
    }

    // Return the value unchanged if it's not an array, object, or BigInt
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
                product_link: variant.product_link,
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
export const removeProductImageByIndex = async (
    productId: number,
    type: ImageType, // 👈 restrict to known keys
    imageIndex: number
) => {
    try {
        const { status, product, message } = await getProductById(productId);

        if (!status || !product) {
            return { status: false, message: message || "Product not found." };
        }

        logMessage(`debug`, `product (${type}):`, product);

        const allowedImages = {
            package_weight_image: product.package_weight_image,
            package_length_image: product.package_length_image,
            package_width_image: product.package_width_image,
            package_height_image: product.package_height_image,
        };

        const images = allowedImages[type]; // ✅ No TS error now

        console.log(`Images of type '${type}':`, images);

        if (!images) {
            return { status: false, message: "No images available to delete." };
        }

        const imagesArr = images.split(",");

        if (imageIndex < 0 || imageIndex >= imagesArr.length) {
            return { status: false, message: "Invalid image index provided." };
        }

        const removedImage = imagesArr.splice(imageIndex, 1)[0]; // Remove image at given index
        const updatedImages = imagesArr.join(",");

        // Update product in DB
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { [type]: updatedImages },
        });

        // 🔥 Attempt to delete the image file from storage
        const imageFileName = path.basename(removedImage.trim());
        const filePath = path.join(process.cwd(), "public", "uploads", "product", imageFileName);

        const fileDeleted = await deleteFile(filePath);

        return {
            status: true,
            message: fileDeleted
                ? "Image removed and file deleted successfully."
                : "Image removed, but file deletion failed.",
            product: updatedProduct,
        };
    } catch (error) {
        console.error("❌ Error removing product image:", error);
        return {
            status: false,
            message: "An unexpected error occurred while removing the image.",
        };
    }
};

// 🔵 GET BY ID
export const getProductById = async (id: number) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { variants: true },
        });

        if (!product) return { status: false, message: "Product not found" };

        const sanitizedProduct = serializeBigInt(product);
        logMessage('debug', 'fetched products :', sanitizedProduct);

        return { status: true, product: sanitizedProduct };
    } catch (error) {
        console.error("❌ getProductById Error:", error);
        return { status: false, message: "Error fetching product" };
    }
};

export const getProductVariantById = async (id: number) => {
    try {
        const productVariant = await prisma.productVariant.findUnique({
            where: { id }
        });

        if (!productVariant) return { status: false, message: "productVariant Variant not found" };

        const sanitizedProductVariant = serializeBigInt(productVariant);
        logMessage('debug', 'fetched product variants :', sanitizedProductVariant);

        return { status: true, variant: sanitizedProductVariant };
    } catch (error) {
        console.error("❌ getProductVariantById Error:", error);
        return { status: false, message: "Error fetching product variant" };
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
            training_guidance_video,
            status,
            package_weight_image,
            package_length_image,
            package_width_image,
            package_height_image,
            video_url,
        } = product;

        // Image fields to process
        const imageFields: Array<'package_weight_image' | 'package_length_image' | 'package_width_image' | 'package_height_image'> = [
            'package_weight_image',
            'package_length_image',
            'package_width_image',
            'package_height_image',
        ];

        // Fetch existing product once
        const productResponse = await getProductById(productId);
        if (!productResponse.status || !productResponse.product) {
            return {
                status: false,
                message: productResponse.message || "Product not found.",
            };
        }

        const existingProduct = productResponse.product;

        for (const field of imageFields) {
            const newValue = product[field];

            if (typeof newValue === 'string' && newValue.trim()) {
                const newImages = newValue.split(',').map(img => img.trim()).filter(Boolean);

                const existingValue = existingProduct[field];
                const existingImages = typeof existingValue === 'string'
                    ? existingValue.split(',').map(img => img.trim()).filter(Boolean)
                    : [];

                const mergedImages = Array.from(new Set([...existingImages, ...newImages]));

                // ✅ Type-safe update
                product[field] = mergedImages.join(',');
            }
        }

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
                training_guidance_video,
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

                // Get existing variant if ID exists
                let existingVariantImages: string[] = [];

                if (variant.id) {
                    // Fetch existing product once
                    const productVariantResponse = await getProductVariantById(variant.id);
                    if (!productVariantResponse.status || !productVariantResponse.variant) {
                        return {
                            status: false,
                            message: productVariantResponse.message || "Product Variant not found.",
                        };
                    }

                    const existingProductVariant = productVariantResponse.variant;

                    if (existingProductVariant?.image && typeof existingProductVariant.image === 'string') {
                        existingVariantImages = existingProductVariant.image
                            .split(',')
                            .map(img => img.trim())
                            .filter(Boolean);
                    }
                }

                const newVariantImages = typeof variant.images === 'string'
                    ? variant.images.split(',').map(img => img.trim()).filter(Boolean)
                    : [];

                const mergedVariantImages = Array.from(new Set([...existingVariantImages, ...newVariantImages])).join(',');

                const variantData = {
                    color: variant.color,
                    sku: variant.sku,
                    qty: variant.qty,
                    currency: variant.currency,
                    article_id: variant.article_id,
                    suggested_price: variant.suggested_price,
                    shipowl_price: variant.shipowl_price,
                    rto_suggested_price: variant.rto_suggested_price,
                    rto_price: variant.rto_price,
                    product_link: variant.product_link,
                    image: mergedVariantImages,
                };

                if (variant.id) {
                    await prisma.productVariant.update({
                        where: { id: Number(variant.id) },
                        data: variantData,
                    });
                } else {
                    await prisma.productVariant.create({
                        data: {
                            ...variantData,
                            productId: productId,
                        },
                    });
                }
            }
        }

        const sanitizedProducts = serializeBigInt(updatedProduct);
        logMessage('debug', 'fetched products :', sanitizedProducts);

        return { status: true, product: sanitizedProducts };
    } catch (error) {
        console.error("❌ updateProduct Error:", error);
        return { status: false, message: "Error updating product" };
    }
};


// 🔴 Soft DELETE (marks as deleted by setting deletedAt field for product and variants)
export const softDeleteProduct = async (adminId: number, adminRole: string, id: number) => {
    try {
        // Soft delete the product
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });

        // Soft delete the variants of this product
        const updatedVariants = await prisma.productVariant.updateMany({
            where: { productId: id },  // assuming `productId` is the foreign key in the variant table
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });

        return {
            status: true,
            message: "Product and variants soft deleted successfully",
            updatedProduct,
            updatedVariants
        };
    } catch (error) {
        console.error("❌ softDeleteProduct Error:", error);
        return { status: false, message: "Error soft deleting product and variants" };
    }
};


// 🟢 RESTORE (Restores a soft-deleted product and its variants by setting deletedAt to null)
export const restoreProduct = async (adminId: number, adminRole: string, id: number) => {
    try {
        // Restore the product
        const restoredProduct = await prisma.product.update({
            where: { id },
            include: { variants: true },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the product
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        // Restore the variants of this product
        await prisma.productVariant.updateMany({
            where: { productId: id },  // assuming `productId` is the foreign key in the variant table
            data: {
                deletedBy: null,      // Reset the deletedBy field for variants
                deletedAt: null,      // Set deletedAt to null for variants
                deletedByRole: null,  // Reset the deletedByRole field for variants
                updatedBy: adminId,   // Record the user restoring the variant
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field for variants
            },
        });

        const sanitizedProduct = serializeBigInt(restoredProduct);
        logMessage('debug', 'fetched products :', sanitizedProduct);

        return {
            status: true,
            message: "Product and variants restored successfully",
            restoredProduct: sanitizedProduct
        };
    } catch (error) {
        console.error("❌ restoreProduct Error:", error);
        return { status: false, message: "Error restoring product and variants" };
    }
};

// 🔴 DELETE
export const deleteProduct = async (id: number) => {
    try {
        console.log(`id - `, id);
        await prisma.product.delete({ where: { id } });
        return { status: true, message: "Product deleted successfully" };
    } catch (error) {
        console.error("❌ deleteProduct Error:", error);
        return { status: false, message: "Error deleting product" };
    }
};