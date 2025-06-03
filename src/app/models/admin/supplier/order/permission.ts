import prisma from "@/lib/prisma";

interface Permission {
    permissions: {
        permissionId: number;
        status: boolean;
    }[];
    updatedBy?: number;
    updatedAt?: Date;
}

export const getPermissions = async () => {
    try {
        const permissions = await prisma.permission.findMany({
            orderBy: {
                id: 'asc',
            }
        });

        return { status: true, permissions };
    } catch (error) {
        console.error("❌ getPermissions Error:", error);
        return { status: false, message: "Error fetching permissions" };
    }
};

export const updatePermission = async (
    adminId: number,
    adminRole: string,
    data: Permission
) => {
    try {
        // Optionally update 'updatedBy' and 'updatedAt' if you want to track it
        const updatedPermissions = await Promise.all(
            data.permissions.map(async (perm) => {
                return await prisma.permission.update({
                    where: { id: perm.permissionId },
                    data: {
                        status: perm.status,
                        updatedBy: data.updatedBy ?? adminId,
                        updatedAt: data.updatedAt ?? new Date(),
                    },
                });
            })
        );

        return { status: true, updatedPermissions };
    } catch (error) {
        console.error("❌ updatePermission Error:", error);
        return { status: false, message: "Error updating permission" };
    }
};
