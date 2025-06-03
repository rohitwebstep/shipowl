import prisma from "@/lib/prisma";
import { logMessage } from "@/utils/commonUtils";

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
export const getAdminPermissionById = async (id: number) => {
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
export const getAllAdminStaffPermissions = async () => {
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

export const getAdminStaffPermissionsByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
    try {
        let whereCondition: Record<string, unknown> = {
            panel: "admin",
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

export const updateAdminPermissions = async (
    adminId: number,
    adminRole: string,
    payload: {
        permissions: { permissionId: number; status: boolean }[];
        updatedAt?: Date;
        updatedBy?: number;
        updatedByRole?: string | null;
    }
) => {
    try {
        const updates = payload.permissions.map(({ permissionId, status }) =>
            prisma.permission.update({
                where: { id: permissionId },
                data: {
                    status,
                    updatedAt: payload.updatedAt,
                    updatedBy: payload.updatedBy,
                    updatedByRole: payload.updatedByRole,
                },
            })
        );

        const result = await Promise.all(updates);

        return { status: true, updatedPermissions: serializeBigInt(result) };
    } catch (error) {
        logMessage("error", "Failed to update permissions", error);
        return { status: false, message: "Internal Server Error" };
    }
};
