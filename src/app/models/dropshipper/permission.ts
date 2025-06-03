import prisma from "@/lib/prisma";
import { logMessage } from "@/utils/commonUtils";

interface DropshipperHasPermission {
    id?: number;
    admin?: {
        connect: { id: number }; // or whatever your relation is
    };
    permission?: {
        connect: { id: number }; // or whatever your relation is
    };
    dropshipperStaffId?: number;
    permissionId?: number;
}

interface DropshipperPermissionsPayload {
    dropshipper?: { connect: { id: number } };
    dropshipperStaffId?: number;
    permissions: DropshipperHasPermission[];
    createdAt?: Date; // Timestamp of when the dropshipper was created
    updatedAt?: Date; // Timestamp of when the dropshipper was last updated
    deletedAt?: Date | null; // Timestamp of when the dropshipper was deleted, or null if not deleted
    createdBy?: number; // ID of the dropshipper who created the dropshipper
    updatedBy?: number; // ID of the dropshipper who last updated the dropshipper
    deletedBy?: number; // ID of the dropshipper who deleted the dropshipper
    createdByRole?: string | null; // Role of the dropshipper who created the dropshipper
    updatedByRole?: string | null; // Role of the dropshipper who last updated the dropshipper
    deletedByRole?: string | null; // Role of the dropshipper who deleted the dropshipper
}

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

// 🔵 GET BY ID
export const getDropshipperPermissionById = async (id: number) => {
    try {
        const permission = await prisma.permission.findUnique({
            where: { id },
        });

        if (!permission) return { status: false, message: "Permission not found" };
        return { status: true, permission: serializeBigInt(permission) };
    } catch (error) {
        console.error("❌ getPermissionById Error:", error);
        return { status: false, message: "Error fetching permission" };
    }
};


// 🟣 GET ALL
export const getAllDropshipperStaffPermissions = async () => {
    try {
        const permissions = await prisma.permission.findMany({
            orderBy: { id: 'desc' },
        });
        return { status: true, permissions: serializeBigInt(permissions) };
    } catch (error) {
        console.error("❌ getAllPermissions Error:", error);
        return { status: false, message: "Error fetching permissions" };
    }
};

export const getDropshipperStaffPermissionsByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
    try {
        let whereCondition: Record<string, unknown> = {
            panel: "dropshipper",
        };

        switch (status) {
            case "active":
                whereCondition = { ...whereCondition, status: true, deletedAt: null };
                break;
            case "inactive":
                whereCondition = { ...whereCondition, status: false, deletedAt: null };
                break;
            case "deleted":
                whereCondition = { ...whereCondition, deletedAt: { not: null } };
                break;
            case "notDeleted":
                whereCondition = { ...whereCondition, deletedAt: null };
                break;
            default:
                throw new Error("Invalid status");
        }

        const permissions = await prisma.permission.findMany({
            where: whereCondition,
            orderBy: { id: "desc" },
        });

        return { status: true, permissions: serializeBigInt(permissions) };
    } catch (error) {
        console.error(`Error fetching permissions by status (${status}):`, error);
        return { status: false, message: "Error fetching permissions" };
    }
};