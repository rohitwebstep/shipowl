import prisma from "@/lib/prisma";

export const getPermissions = async () => {
    try {
        const permissions = await prisma.supplierOrderPermission.findMany({
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
    data: {
        permissions: { permissionIndex: string; status: boolean }[];
        updatedBy?: number;
        updatedAt?: Date;
    }
) => {
    try {
        // Build an object with all columns to update dynamically
        const updateData: Record<string, any> = {
        };

        for (const perm of data.permissions) {
            updateData[perm.permissionIndex] = perm.status;
        }
        
        // Update the single row with id = 1 (change if needed)
        const updatedPermissions = await prisma.supplierOrderPermission.update({
            where: { id: 1 },
            data: updateData,
        });

        return { status: true, updatedPermissions };
    } catch (error) {
        console.error("❌ updatePermission Error:", error);
        return { status: false, message: "Error updating permissions" };
    }
};
