import prisma from "@/lib/prisma";

const serializeBigInt = <T>(obj: T): T => {
    if (typeof obj === "bigint") return obj.toString() as unknown as T;
    if (obj instanceof Date) return obj;
    if (Array.isArray(obj)) return obj.map(serializeBigInt) as unknown as T;
    if (obj && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        ) as T;
    }
    return obj;
};

interface StaffPermissionFilter {
    panel?: string;
    module?: string;
    action?: string;
}

// 🔍 Professional: Filter by panel, module, action (any or all)
export const getStaffPermissions = async (filter: StaffPermissionFilter = {}) => {
    try {
        const staffPermissions = await prisma.adminStaffPermission.findMany({
            where: {
                ...(filter.panel && { panel: filter.panel }),
                ...(filter.module && { module: filter.module }),
                ...(filter.action && { action: filter.action }),
            },
            orderBy: { id: "desc" },
        });

        return {
            status: true,
            staffPermissions: serializeBigInt(staffPermissions),
        };
    } catch (error) {
        console.error("❌ getStaffPermissions Error:", error);
        return {
            status: false,
            message: "Error fetching staff permissions",
        };
    }
};

export const checkStaffPermissionStatus = async (filter: StaffPermissionFilter = {}, staffId: number) => {
    try {

        if (!staffId || isNaN(staffId)) {
            return {
                status: false,
                message: "Invalid staff ID",
            };
        }

        // Fetch staff permissions based on the provided filter and staff ID
        if (!filter.panel || !filter.module || !filter.action) {
            return {
                status: false,
                message: "all of filter must be provided",
            };
        }

        const isValidPanel = ["admin", "supplier", "customer"].includes(filter.panel);
        if (!isValidPanel) {
            return {
                status: false,
                message: "Invalid panel provided",
            };
        }

        const staffPermissionsExist = await prisma.adminStaffPermission.findFirst({
            where: {
                panel: filter.panel,
                module: filter.module,
                action: filter.action
            },
        });

        if (!staffPermissionsExist) {
            return {
                status: false,
                message: "No permissions found for the given filter",
            };
        }

        const staffPermissions = await prisma.adminStaffHasPermission.findFirst({
            where: {
                adminStaffPermissionId: staffPermissionsExist.id,
                adminStaffId: staffId
            },
            orderBy: { id: "desc" },
        });

        if (!staffPermissions) {
            return {
                status: false,
                message: "Action Unauthorized",
            };
        }
        return {
            status: true,
            message: "Action Authorized",
        };
    } catch (error) {
        console.error("❌ getStaffPermissions Error:", error);
        return {
            status: false,
            message: "Error fetching staff permissions",
        };
    }
};
