import prisma from "@/lib/prisma";

interface GoodPincode {
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

export async function createGoodPincode(adminId: number, adminRole: string, goodPincode: GoodPincode) {

    try {
        const {
            pincode,
            status,
            createdBy,
            createdByRole,
        } = goodPincode;

        const newGoodPincode = await prisma.goodPincode.create({
            data: {
                pincode,
                status,
                createdAt: new Date(),
                createdBy: createdBy,
                createdByRole: createdByRole,
            },
        });

        return { status: true, goodPincode: serializeBigInt(newGoodPincode) };
    } catch (error) {
        console.error(`Error creating goodPincode:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

// 🟡 UPDATE
export const updateGoodPincode = async (
    adminId: number,
    adminRole: string,
    goodPincodeId: number,
    data: GoodPincode
) => {
    try {
        const {
            pincode,
            status,
            updatedBy,
            updatedByRole,
        } = data;

        const goodPincode = await prisma.goodPincode.update({
            where: { id: goodPincodeId }, // Assuming 'id' is the correct primary key field
            data: {
                pincode,
                status,
                updatedAt: new Date(),
                updatedBy: updatedBy,
                updatedByRole: updatedByRole,
            },
        });

        return { status: true, goodPincode: serializeBigInt(goodPincode) };
    } catch (error) {
        console.error("❌ updateGoodPincode Error:", error);
        return { status: false, message: "Error updating goodPincode" };
    }
};

// 🔵 GET BY ID
export const getGoodPincodeById = async (id: number) => {
    try {
        const goodPincode = await prisma.goodPincode.findUnique({
            where: { id },
        });

        if (!goodPincode) return { status: false, message: "GoodPincode not found" };
        return { status: true, goodPincode: serializeBigInt(goodPincode) };
    } catch (error) {
        console.error("❌ getGoodPincodeById Error:", error);
        return { status: false, message: "Error fetching goodPincode" };
    }
};

export const getGoodPincodeByPincode = async (pincode: string) => {
    try {
        const goodPincode = await prisma.goodPincode.findFirst({
            where: { pincode },
        });

        if (goodPincode) {
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
        console.error("❌ getGoodPincodeByPincode Error:", error);
        return { status: false, message: "Error fetching goodPincode" };
    }
};

export const getGoodPincodeByPincodeForUpdate = async (pincode: string, goodPincodeId: number) => {
    try {
        const goodPincode = await prisma.goodPincode.findFirst({
            where: {
                pincode,
                NOT: {
                    id: goodPincodeId,  // Exclude the current product being updated
                }
            },
        });

        if (goodPincode) {
            return {
                status: false,
                message: `Pincode "${pincode}" is already linked to goodPincodeId ${goodPincodeId}.`,
            };
        }

        return {
            status: true,
            message: `Pincode "${pincode}" is available for updating to goodPincodeId ${goodPincodeId}.`,
        };
    } catch (error) {
        console.error("❌ getGoodPincodeByPincode Error:", error);
        return { status: false, message: "Error fetching goodPincode" };
    }
};

// 🟣 GET ALL
export const getAllGoodPincodes = async () => {
    try {
        const goodPincodes = await prisma.goodPincode.findMany({
            orderBy: { id: 'desc' },
        });
        return { status: true, goodPincodes: serializeBigInt(goodPincodes) };
    } catch (error) {
        console.error("❌ getAllGoodPincodes Error:", error);
        return { status: false, message: "Error fetching goodPincodes" };
    }
};

export const getGoodPincodesByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
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

        const goodPincodes = await prisma.goodPincode.findMany({
            where: whereCondition,
            orderBy: { id: "desc" },
        });

        return { status: true, goodPincodes: serializeBigInt(goodPincodes) };
    } catch (error) {
        console.error(`Error fetching goodPincodes by status (${status}):`, error);
        return { status: false, message: "Error fetching goodPincodes" };
    }
};

// 🔴 Soft DELETE (marks as deleted by setting deletedAt field)
export const softDeleteGoodPincode = async (adminId: number, adminRole: string, id: number) => {
    try {
        const updatedGoodPincode = await prisma.goodPincode.update({
            where: { id },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });
        return { status: true, message: "GoodPincode soft deleted successfully", updatedGoodPincode: serializeBigInt(updatedGoodPincode) };
    } catch (error) {
        console.error("❌ softDeleteGoodPincode Error:", error);
        return { status: false, message: "Error soft deleting goodPincode" };
    }
};

// 🟢 RESTORE (Restores a soft-deleted goodPincode by setting deletedAt to null)
export const restoreGoodPincode = async (adminId: number, adminRole: string, id: number) => {
    try {
        const restoredGoodPincode = await prisma.goodPincode.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the goodPincode
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        return { status: true, message: "GoodPincode restored successfully", restoredGoodPincode: serializeBigInt(restoredGoodPincode) };
    } catch (error) {
        console.error("❌ restoreGoodPincode Error:", error);
        return { status: false, message: "Error restoring goodPincode" };
    }
};

// 🔴 DELETE
export const deleteGoodPincode = async (id: number) => {
    try {
        await prisma.goodPincode.delete({ where: { id } });
        return { status: true, message: "GoodPincode deleted successfully" };
    } catch (error) {
        console.error("❌ deleteGoodPincode Error:", error);
        return { status: false, message: "Error deleting goodPincode" };
    }
};