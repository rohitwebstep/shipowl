import prisma from "@/lib/prisma";

interface Brand {
    name: string;
    description: string;
    status: boolean;
    image?: string;
    updatedBy?: number;
    updatedAt?: Date;
    updatedByRole?: string;
}

export async function generateBrandSlug(name: string) {
    let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let isSlugTaken = true;
    let suffix = 0;

    // Keep checking until an unused slug is found
    while (isSlugTaken) {
        const existingBrand = await prisma.brand.findUnique({
            where: { slug },
        });

        if (existingBrand) {
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

export async function createBrand(adminId: number, adminRole: string, brand: Brand) {

    try {
        const { name, description, status, image } = brand;

        // Generate a unique slug for the brand
        const slug = await generateBrandSlug(name);

        const newBrand = await prisma.brand.create({
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

        return { status: true, brand: newBrand };
    } catch (error) {
        console.error(`Error creating brand:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

// 🟡 UPDATE
export const updateBrand = async (
    adminId: number,
    adminRole: string,
    brandId: number,
    data: Brand
) => {
    try {
        data.updatedBy = adminId;
        data.updatedAt = new Date();
        data.updatedByRole = adminRole;

        const brand = await prisma.brand.update({
            where: { id: brandId }, // Assuming 'id' is the correct primary key field
            data: data,
        });

        return { status: true, brand };
    } catch (error) {
        console.error("❌ updateBrand Error:", error);
        return { status: false, message: "Error updating brand" };
    }
};

// 🔵 GET BY ID
export const getBrandById = async (id: number) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id },
        });

        if (!brand) return { status: false, message: "Brand not found" };
        return { status: true, brand };
    } catch (error) {
        console.error("❌ getBrandById Error:", error);
        return { status: false, message: "Error fetching brand" };
    }
};

// 🟣 GET ALL
export const getAllCategories = async () => {
    try {
        const categories = await prisma.brand.findMany({
            orderBy: { id: 'desc' },
        });
        return { status: true, categories };
    } catch (error) {
        console.error("❌ getAllCategories Error:", error);
        return { status: false, message: "Error fetching categories" };
    }
};

// 🔴 DELETE
export const deleteBrand = async (id: number) => {
    try {
        await prisma.brand.delete({ where: { id } });
        return { status: true, message: "Brand deleted successfully" };
    } catch (error) {
        console.error("❌ deleteBrand Error:", error);
        return { status: false, message: "Error deleting brand" };
    }
};