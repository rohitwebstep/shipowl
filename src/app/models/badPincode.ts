import prisma from "@/lib/prisma";

interface BadPincode {
    id?: bigint;
    pincode: string;
    status: boolean;
    createdBy?: number;
    createdAt?: Date;
    createdByRole?: string;
    updatedBy?: number;
    updatedAt?: Date;
    updatedByRole?: string;
    deletedBy?: number | null;
    deletedAt?: Date;
    deletedByRole?: string | null;
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

export async function createBadPincode(adminId: number, adminRole: string, badPincode: BadPincode) {

    try {
        const {
            pincode,
            status,
            createdBy,
            createdByRole,
        } = badPincode;

        const newBadPincode = await prisma.badPincode.create({
            data: {
                pincode,
                status,
                createdAt: new Date(),
                createdBy: createdBy,
                createdByRole: createdByRole,
            },
        });

        return { status: true, badPincode: serializeBigInt(newBadPincode) };
    } catch (error) {
        console.error(`Error creating badPincode:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

// 🟡 UPDATE
export const updateBadPincode = async (
    adminId: number,
    adminRole: string,
    badPincodeId: number,
    data: BadPincode
) => {
    try {
        const {
            pincode,
            status,
            updatedBy,
            updatedByRole,
        } = data;

        const badPincode = await prisma.badPincode.update({
            where: { id: badPincodeId }, // Assuming 'id' is the correct primary key field
            data: {
                pincode,
                status,
                updatedAt: new Date(),
                updatedBy: updatedBy,
                updatedByRole: updatedByRole,
            },
        });

        return { status: true, badPincode: serializeBigInt(badPincode) };
    } catch (error) {
        console.error("❌ updateBadPincode Error:", error);
        return { status: false, message: "Error updating badPincode" };
    }
};

// 🔵 GET BY ID
export const getBadPincodeById = async (id: number) => {
    try {
        const badPincode = await prisma.badPincode.findUnique({
            where: { id },
        });

        if (!badPincode) return { status: false, message: "BadPincode not found" };
        return { status: true, badPincode: serializeBigInt(badPincode) };
    } catch (error) {
        console.error("❌ getBadPincodeById Error:", error);
        return { status: false, message: "Error fetching badPincode" };
    }
};

export const getBadPincodeByPincode = async (pincode: string) => {
    try {
        const badPincode = await prisma.badPincode.findFirst({
            where: { pincode },
        });

        if (badPincode) {
            return {
                status: false,
                message: `Pincode "${pincode}" is already in use.`,
            };
        }

        return {
            status: true,
            message: `Pincode "${pincode}" is available.`,
        };
    } catch (error) {
        console.error("❌ getBadPincodeByPincode Error:", error);
        return { status: false, message: "Error fetching badPincode" };
    }
};

export const getBadPincodeByPincodeForUpdate = async (pincode: string, badPincodeId: number) => {
    try {
        const badPincode = await prisma.badPincode.findFirst({
            where: {
                pincode,
                NOT: {
                    id: badPincodeId,  // Exclude the current product being updated
                }
            },
        });

        if (badPincode) {
            return {
                status: false,
                message: `Pincode "${pincode}" is already linked to badPincodeId ${badPincodeId}.`,
            };
        }

        return {
            status: true,
            message: `Pincode "${pincode}" is available for updating to badPincodeId ${badPincodeId}.`,
        };
    } catch (error) {
        console.error("❌ getBadPincodeByPincode Error:", error);
        return { status: false, message: "Error fetching badPincode" };
    }
};

// 🟣 GET ALL
export const getAllBadPincodes = async () => {
    try {
        const badPincodes = await prisma.badPincode.findMany({
            orderBy: { id: 'desc' },
        });
        return { status: true, badPincodes: serializeBigInt(badPincodes) };
    } catch (error) {
        console.error("❌ getAllBadPincodes Error:", error);
        return { status: false, message: "Error fetching badPincodes" };
    }
};

export const getBadPincodesByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
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

        const badPincodes = await prisma.badPincode.findMany({
            where: whereCondition,
            orderBy: { id: "desc" },
        });

        return { status: true, badPincodes: serializeBigInt(badPincodes) };
    } catch (error) {
        console.error(`Error fetching badPincodes by status (${status}):`, error);
        return { status: false, message: "Error fetching badPincodes" };
    }
};

// 🔴 Soft DELETE (marks as deleted by setting deletedAt field)
export const softDeleteBadPincode = async (adminId: number, adminRole: string, id: number) => {
    try {
        const updatedBadPincode = await prisma.badPincode.update({
            where: { id },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });
        return { status: true, message: "BadPincode soft deleted successfully", updatedBadPincode: serializeBigInt(updatedBadPincode) };
    } catch (error) {
        console.error("❌ softDeleteBadPincode Error:", error);
        return { status: false, message: "Error soft deleting badPincode" };
    }
};

// 🟢 RESTORE (Restores a soft-deleted badPincode by setting deletedAt to null)
export const restoreBadPincode = async (adminId: number, adminRole: string, id: number) => {
    try {
        const restoredBadPincode = await prisma.badPincode.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the badPincode
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        return { status: true, message: "BadPincode restored successfully", restoredBadPincode: serializeBigInt(restoredBadPincode) };
    } catch (error) {
        console.error("❌ restoreBadPincode Error:", error);
        return { status: false, message: "Error restoring badPincode" };
    }
};

// 🔴 DELETE
export const deleteBadPincode = async (id: number) => {
    try {
        await prisma.badPincode.delete({ where: { id } });
        return { status: true, message: "BadPincode deleted successfully" };
    } catch (error) {
        console.error("❌ deleteBadPincode Error:", error);
        return { status: false, message: "Error deleting badPincode" };
    }
};