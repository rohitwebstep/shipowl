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

export const getRTOInventories = async (dropshipperId: number) => {
    try {
        const inventories = await prisma.rtoInventory.findMany({
            where: { dropshipperId },
            orderBy: { id: "desc" },
            include: {
                dropshipperProductVariant: {
                    include: {
                        supplierProductVariant: {
                            include: {
                                variant: true
                            }
                        }
                    }
                }
            }
        });

        logMessage('info', 'RTO inventories fetched successfully', { dropshipperId });

        return {
            status: true,
            message: "RTO inventories fetched successfully",
            inventories: serializeBigInt(inventories),
        };

    } catch (error) {
        logMessage('error', 'Error fetching RTO inventories', { error, dropshipperId });

        return {
            status: false,
            message: "Failed to fetch RTO inventories",
            inventories: [],
        };
    }
};
