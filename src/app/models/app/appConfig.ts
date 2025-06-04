import prisma from "@/lib/prisma";

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
export const getAppConfig = async () => {
    try {
        const appConfig = await prisma.appConfig.findFirst({
            where: { status: true },
            orderBy: { id: "desc" },
        });

        if (!appConfig) {
            return { status: false, message: "AppConfig not found" };
        }

        return { status: true, appConfig: serializeBigInt(appConfig) };
    } catch (error) {
        console.error("❌ getAppConfig Error:", error);
        return { status: false, message: "Error fetching AppConfig" };
    }
};