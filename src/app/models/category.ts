import prisma from "@/lib/prisma";

interface Category {
    name: string;
    description: string;
    status: boolean;
    image?: string;
}

export async function generateCategorySlug(name: string) {
    let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let isSlugTaken = true;
    let suffix = 0;

    // Keep checking until an unused slug is found
    while (isSlugTaken) {
        const existingCategory = await prisma.category.findUnique({
            where: { slug },
        });

        if (existingCategory) {
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

export async function createCategory(adminId: number, adminRole: string, category: Category) {

    try {
        const { name, description, status, image } = category;

        // Generate a unique slug for the category
        const slug = await generateCategorySlug(name);

        const newCategory = await prisma.category.create({
            data: {
                name,
                description,
                status,
                slug,
                image,
                createdAt: new Date(),
                createdBy: adminId,
                createdByRole: adminRole,
            },
        });

        return { status: true, category: newCategory };
    } catch (error) {
        console.error(`Error creating category:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}
