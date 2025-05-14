import prisma from "@/lib/prisma";
import { logMessage } from "@/utils/commonUtils";

interface SupplierHasPermission {
    id?: number;
    admin?: {
        connect: { id: number }; // or whatever your relation is
    };
    permission?: {
        connect: { id: number }; // or whatever your relation is
    };
    supplierStaffId?: number;
    permissionId?: number;
}

interface SupplierPermissionsPayload {
    admin?: { connect: { id: number } };
    supplierStaffId?: number;
    permissions: SupplierHasPermission[];
    createdAt?: Date; // Timestamp of when the supplier was created
    updatedAt?: Date; // Timestamp of when the supplier was last updated
    deletedAt?: Date | null; // Timestamp of when the supplier was deleted, or null if not deleted
    createdBy?: number; // ID of the supplier who created the supplier
    updatedBy?: number; // ID of the supplier who last updated the supplier
    deletedBy?: number; // ID of the supplier who deleted the supplier
    createdByRole?: string | null; // Role of the supplier who created the supplier
    updatedByRole?: string | null; // Role of the supplier who last updated the supplier
    deletedByRole?: string | null; // Role of the supplier who deleted the supplier
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
export const getSupplierPermissionById = async (id: number) => {
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


export async function assignSupplierStaffPermission(
    supplierStaffId: number,
    supplierRole: string,
    payload: SupplierPermissionsPayload
) {
    try {
        const permissionOperations = payload.permissions.map(async (permission) => {
            const targetSupplierId = Number(payload.supplierStaffId);
            const targetPermissionId = Number(permission.permissionId);

            const { status: found, permission: currentPermission, message } = await getSupplierPermissionById(targetPermissionId);
            if (!found || !currentPermission) {
                return { status: false, message: message || "Permission record not found." };
            }

            // Check if the permission is already assigned to this supplier
            const existingPermission = await prisma.adminStaffHasPermission.findFirst({
                where: {
                    adminStaffId: targetSupplierId,
                    permissionId: targetPermissionId,
                }
            });

            if (existingPermission) {
                return {
                    status: false,
                    message: `Permission (ID: ${targetPermissionId}) is already assigned to Supplier (ID: ${targetSupplierId}).`,
                };
            }

            // Create new permission entry
            const newPermission = await prisma.adminStaffHasPermission.create({
                data: {
                    adminStaffId: targetSupplierId,
                    permissionId: targetPermissionId,
                    updatedAt: payload.updatedAt,
                    updatedBy: payload.updatedBy,
                    updatedByRole: payload.updatedByRole,
                }
            });

            return { status: true, permission: newPermission };
        });

        const results = await Promise.all(permissionOperations);

        return { status: true, permissions: results };
    } catch (error) {
        logMessage("error", "Error while updating/creating supplier permissions", error);
        return { status: false, message: "Internal Server Error" };
    }
}

// 🟣 GET ALL
export const getAllSupplierStaffPermissions = async () => {
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

export const getSupplierStaffPermissionsByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
    try {
        let whereCondition: Record<string, unknown> = {
            panel: "supplier",
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

export const getPermissionsOfSupplierStaff = async (supplierStaffId: number) => {
    try {
        if (!supplierStaffId || isNaN(supplierStaffId)) {
            return { status: false, message: "Invalid Supplier ID" };
        }

        const permissions = await prisma.adminStaffHasPermission.findMany({
            where: { adminStaffId: supplierStaffId },
            include: {
                permission: true // Include full permission details
            },
            orderBy: {
                permissionId: "asc"
            }
        });

        return { status: true, permissions: serializeBigInt(permissions) };
    } catch (error) {
        logMessage("error", `Failed to get permissions for supplierStaffId ${supplierStaffId}`, error);
        return { status: false, message: "Failed to fetch supplier permissions" };
    }
};