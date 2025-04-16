import prisma from "@/lib/prisma";

// ✅ TypeScript interface for City
export interface City {
    id: string; // Serialized from bigint
    name: string;
    stateId: string;
    stateCode: string;
    latitude: number;
    longitude: number;
    flag: number;
    wikiDataId?: string | null;
    createdAt: string;
    updatedAt: string;
}

// 🔄 Helper: Serialize city BigInts to strings
const serializeCity = (city: any): City => ({
    ...city,
    id: city.id.toString(),
    stateId: city.stateId.toString(),
    createdAt: city.createdAt.toISOString(),
    updatedAt: city.updatedAt.toISOString(),
});

// 🔵 GET CITY BY ID
export const getCityById = async (id: number | bigint) => {
    try {
        const city = await prisma.city.findUnique({
            where: { id: BigInt(id) },
        });

        if (!city) return { status: false, message: "City not found" };
        return { status: true, city: serializeCity(city) };
    } catch (error) {
        console.error("❌ getCityById Error:", error);
        return { status: false, message: "Error fetching city" };
    }
};

// 🟢 GET CITIES BY STATE ID
export const getCitiesByStateId = async (stateId: string | number | bigint) => {
    try {
        // Ensure stateId is converted to BigInt if it's a string or number
        const normalizedStateId = typeof stateId === 'string' ? BigInt(stateId) : stateId;

        const cities = await prisma.city.findMany({
            where: { stateId: normalizedStateId },
            orderBy: { id: 'desc' }, // Optional: Sort by ID in descending order
        });

        return {
            status: true,
            cities: cities.map(serializeCity),  // Assuming serializeCity handles serialization
        };
    } catch (error) {
        console.error("❌ getCitiesByStateId Error:", error);
        return { status: false, message: "Error fetching cities for the given state" };
    }
};

// 🟣 GET ALL CITIES
export const getAllCities = async () => {
    try {
        const cities = await prisma.city.findMany({
            orderBy: { id: 'desc' },
        });

        return {
            status: true,
            cities: cities.map(serializeCity),
        };
    } catch (error) {
        console.error("❌ getAllCities Error:", error);
        return { status: false, message: "Error fetching cities" };
    }
};
