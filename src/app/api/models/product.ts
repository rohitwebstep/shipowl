import prisma from "@/lib/prisma";

interface Product {
    name: string;
    description: string;
    price: number;
    quantity: number;
    status: boolean;
    image?: string;
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

export async function createProduct(adminId: Number, product: Product) {
    try {
        const { name, description, price, quantity, status, image } = product;

        // Generate a unique slug for the product
        const slug = await generateProductSlug(name);

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                quantity,
                status,
                slug,
                image,
                createdAt: new Date(),
                createdBy: adminId,
            },
        });

        return { status: true, product: newProduct };
    } catch (error) {
        console.error(`Error creating product:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}
