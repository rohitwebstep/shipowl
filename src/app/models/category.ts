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

// 🟡 UPDATE
export const updateCategory = async (
    adminId: number,
    adminRole: string,
    categoryId: number,
    data: Category
) => {
    try {
        data.updatedBy = adminId;
        data.updatedAt = new Date();
        data.updatedByRole = adminRole;

        const category = await prisma.category.update({
            where: { id: categoryId }, // Assuming 'id' is the correct primary key field
            data: data,
        });

        return { status: true, category };
    } catch (error) {
        console.error("❌ updateCategory Error:", error);
        return { status: false, message: "Error updating category" };
    }
};

// 🔵 GET BY ID
export const getCategoryById = async (id: number) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) return { status: false, message: "Category not found" };
        return { status: true, category };
    } catch (error) {
        console.error("❌ getCategoryById Error:", error);
        return { status: false, message: "Error fetching category" };
    }
};

// 🟣 GET ALL
export const getAllCategories = async () => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { id: 'desc' },
        });
        return { status: true, categories };
    } catch (error) {
        console.error("❌ getAllCategories Error:", error);
        return { status: false, message: "Error fetching categories" };
    }
};

// 🔴 DELETE
export const deleteCategory = async (id: number) => {
    try {
        await prisma.category.delete({ where: { id } });
        return { status: true, message: "Category deleted successfully" };
    } catch (error) {
        console.error("❌ deleteCategory Error:", error);
        return { status: false, message: "Error deleting category" };
    }
};