import prisma from "@/lib/prisma";

interface Variant {
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
