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
    updatedBy?: number;
    deletedBy?: number;
    createdByRole: string | null;
    updatedByRole?: string | null;
    deletedByRole?: string | null;
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

// 🟡 UPDATE
export const updateWarehouse = async (
    adminId: number,
    adminRole: string,
    warehouseId: number,
    data: Warehouse
) => {
    try {
        data.updatedBy = adminId;
        data.updatedAt = new Date();
        data.updatedByRole = adminRole;

        const warehouse = await prisma.warehouse.update({
            where: { id: warehouseId }, // Assuming 'id' is the correct primary key field
            data: data,
        });

        // Convert BigInt to string for serialization
        const warehouseWithStringBigInts = {
            ...warehouse,
            cityId: warehouse.cityId.toString(),
            stateId: warehouse.stateId.toString(),
        };

        return { status: true, warehouse: warehouseWithStringBigInts };
    } catch (error) {
        console.error("❌ updateWarehouse Error:", error);
        return { status: false, message: "Error updating warehouse" };
    }
};

// 🔵 GET BY ID
export const getWarehouseById = async (id: number) => {
    try {
        const warehouse = await prisma.warehouse.findUnique({
            where: { id },
        });

        if (!warehouse) return { status: false, message: "Warehouse not found" };

        // Convert BigInt to string for serialization
        const warehouseWithStringBigInts = {
            ...warehouse,
            cityId: warehouse.cityId.toString(),
            stateId: warehouse.stateId.toString(),
        };
        return { status: true, warehouse: warehouseWithStringBigInts };
    } catch (error) {
        console.error("❌ getWarehouseById Error:", error);
        return { status: false, message: "Error fetching warehouse" };
    }
};

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

// 🔴 Soft DELETE (marks as deleted by setting deletedAt field)
export const softDeleteWarehouse = async (adminId: number, adminRole: string, id: number) => {
    try {
        const updatedWarehouse = await prisma.warehouse.update({
            where: { id },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });
        return { status: true, message: "Warehouse soft deleted successfully", updatedWarehouse };
    } catch (error) {
        console.error("❌ softDeleteWarehouse Error:", error);
        return { status: false, message: "Error soft deleting warehouse" };
    }
};

// 🟢 RESTORE (Restores a soft-deleted warehouse by setting deletedAt to null)
export const restoreWarehouse = async (adminId: number, adminRole: string, id: number) => {
    try {
        const restoredWarehouse = await prisma.warehouse.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the warehouse
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        // Convert BigInt to string for serialization
        const warehouseWithStringBigInts = {
            ...restoredWarehouse,
            cityId: restoredWarehouse.cityId.toString(),
            stateId: restoredWarehouse.stateId.toString(),
        };

        return { status: true, message: "Warehouse restored successfully", warehouse: warehouseWithStringBigInts };
    } catch (error) {
        console.error("❌ restoreWarehouse Error:", error);
        return { status: false, message: "Error restoring warehouse" };
    }
};

// 🔴 DELETE
export const deleteWarehouse = async (id: number) => {
    try {
        await prisma.warehouse.delete({ where: { id } });
        return { status: true, message: "Warehouse deleted successfully" };
    } catch (error) {
        console.error("❌ deleteWarehouse Error:", error);
        return { status: false, message: "Error deleting warehouse" };
    }
};