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
