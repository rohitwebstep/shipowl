import prisma from "@/lib/prisma";

interface Warehouse {
    id?: number;
    slug?: string;
    name: string;
    gst_number: string;
    contact_name: string;
    contact_number: string;
    address_line_1: string;
    address_line_2: string;
    cityId: bigint;
    stateId: bigint;
    postal_code: string;
    status: boolean;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    createdBy: number;
    createdByRole: string | null;
}

export async function generateWarehouseSlug(name: string) {
    let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let isSlugTaken = true;
    let suffix = 0;

    // Keep checking until an unused slug is found
    while (isSlugTaken) {
        const existingWarehouse = await prisma.warehouse.findUnique({
            where: { slug },
        });

        if (existingWarehouse) {
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

export async function createWarehouse(adminId: number, adminRole: string, warehouse: Warehouse) {

    try {
        const { name, gst_number, contact_name, contact_number, address_line_1, address_line_2, cityId, stateId, postal_code, status } = warehouse;

        // Convert cityId and stateId to numbers
        const numCityId = BigInt(cityId);
        const numStateId = BigInt(stateId);

        // Generate a unique slug for the warehouse
        const slug = await generateWarehouseSlug(name);

        const newWarehouse = await prisma.warehouse.create({
            data: {
                name,
                slug,
                gst_number,
                contact_name,
                contact_number,
                address_line_1,
                address_line_2,
                cityId: numCityId,
                stateId: numStateId,
                postal_code,
                status,
                createdAt: new Date(),
                createdBy: adminId,
                createdByRole: adminRole,
            },
        });

        // Convert BigInt to string for serialization
        const warehouseWithStringBigInts = {
            ...newWarehouse,
            cityId: newWarehouse.cityId.toString(),
            stateId: newWarehouse.stateId.toString(),
        };

        return { status: true, warehouse: warehouseWithStringBigInts };
    } catch (error) {
        console.error(`Error creating warehouse:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

// 🟣 GET ALL
export const getAllWarehouses = async () => {
    try {
        const warehouses = await prisma.warehouse.findMany({
            orderBy: { id: 'desc' },
        });

        // Convert BigInt to string for serialization
        const warehousesWithStringBigInts = warehouses.map(warehouse => ({
            ...warehouse,
            cityId: warehouse.cityId.toString(),
            stateId: warehouse.stateId.toString(),
        }));

        return { status: true, warehouses: warehousesWithStringBigInts };
    } catch (error) {
        console.error("❌ getAllWarehouses Error:", error);
        return { status: false, message: "Error fetching warehouses" };
    }
};

export const getWarehousesByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
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

        const warehouses = await prisma.warehouse.findMany({
            where: whereCondition,
            orderBy: { id: "desc" },
        });

        // Convert BigInt to string for serialization
        const warehousesWithStringBigInts = warehouses.map(warehouse => ({
            ...warehouse,
            cityId: warehouse.cityId.toString(),
            stateId: warehouse.stateId.toString(),
        }));

        return { status: true, warehouses: warehousesWithStringBigInts };
    } catch (error) {
        console.error(`Error fetching warehouses by status (${status}):`, error);
        return { status: false, message: "Error fetching warehouses" };
    }
};