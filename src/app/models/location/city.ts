import prisma from "@/lib/prisma";

interface City {
    id?: bigint;
    name: string;
    state: {
        connect: { id: number }; // or whatever your relation is
    };
    country: {
        connect: { id: number }; // or whatever your relation is
    };
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdByRole?: string | null;
    updatedByRole?: string | null;
    deletedByRole?: string | null;
}

export async function createCity(adminId: number, adminRole: string, city: City) {

    try {
        const { name, state, country } = city;

        const newCity = await prisma.city.create({
            data: {
                name,
                state,
                country,
                createdAt: new Date(),
                createdBy: adminId,
                createdByRole: adminRole,
            },
        });

        // Convert BigInt to string for serialization
        const cityWithStringBigInts = {
            ...newCity,
            id: newCity.id.toString(),
            stateId: newCity.stateId.toString(),
            countryId: newCity.countryId.toString(),
        };

        return { status: true, city: cityWithStringBigInts };
    } catch (error) {
        console.error(`Error creating city:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

// 🟡 UPDATE
export const updateCity = async (
    adminId: number,
    adminRole: string,
    cityId: number,
    data: City
) => {
    try {
        const { name, state, country } = data;

        // Construct the payload safely
        const updateData = {
            name,
            state,
            country,
            updatedBy: adminId,
            updatedAt: new Date(),
            updatedByRole: adminRole,
        };

        const city = await prisma.city.update({
            where: { id: cityId }, // Assuming 'id' is the correct primary key field
            data: updateData,
        });

        // Convert BigInt to string for serialization
        const cityWithStringBigInts = {
            ...city,
            id: city.id.toString(),
            stateId: city.stateId.toString(),
            countryId: city.countryId.toString(),
        };

        return { status: true, city: cityWithStringBigInts };
    } catch (error) {
        console.error("❌ updateCity Error:", error);
        return { status: false, message: "Error updating city" };
    }
};

// 🔵 GET BY ID
export const getCityById = async (id: number) => {
    try {
        const city = await prisma.city.findUnique({
            where: { id },
        });

        if (!city) return { status: false, message: "City not found" };

        // Convert BigInt to string for serialization
        const cityWithStringBigInts = {
            ...city,
            id: city.id.toString(),
            stateId: city.stateId.toString(),
            countryId: city.countryId.toString(),
        };
        return { status: true, city: cityWithStringBigInts };
    } catch (error) {
        console.error("❌ getCityById Error:", error);
        return { status: false, message: "Error fetching city" };
    }
};

// 🟣 GET ALL
export const getAllCities = async () => {
    try {
        const cities = await prisma.city.findMany({
            orderBy: { name: 'asc' },
        });

        // Convert BigInt to string for serialization
        const citiesWithStringBigInts = cities.map(city => ({
            ...city,
            id: city.id.toString(),
            stateId: city.stateId.toString(),
            countryId: city.countryId.toString(),
        }));

        return { status: true, cities: citiesWithStringBigInts };
    } catch (error) {
        console.error("❌ getAllCities Error:", error);
        return { status: false, message: "Error fetching cities" };
    }
};

export const getCitiesByStatus = async (status: "deleted" | "notDeleted" = "notDeleted") => {
    try {
        let whereCondition = {};

        switch (status) {
            case "notDeleted":
                whereCondition = { deletedAt: null };
                break;
            case "deleted":
                whereCondition = { deletedAt: { not: null } };
                break;
            default:
                throw new Error("Invalid status");
        }

        const cities = await prisma.city.findMany({
            where: whereCondition,
            orderBy: { name: "asc" },
        });

        // Convert BigInt to string for serialization
        const citiesWithStringBigInts = cities.map(city => ({
            ...city,
            id: city.id.toString(),
            stateId: city.stateId.toString(),
            countryId: city.countryId.toString(),
        }));

        return { status: true, cities: citiesWithStringBigInts };
    } catch (error) {
        console.error(`Error fetching cities by status (${status}):`, error);
        return { status: false, message: "Error fetching cities" };
    }
};

export const getCitiesByState = async (
    state: number,
    status: "deleted" | "notDeleted" = "notDeleted"
) => {
    try {
        const whereCondition: { stateId: number; deletedAt?: null | { not: null } } = {
            stateId: state,
            deletedAt: status === "notDeleted" ? null : { not: null },
        };

        const cities = await prisma.city.findMany({
            where: whereCondition,
            orderBy: { name: "asc" },
        });

        // Convert BigInt to string for serialization
        const citiesWithStringBigInts = cities.map(({ id, stateId, countryId, ...city }) => ({
            ...city,
            id: id.toString(),
            stateId: stateId.toString(),
            countryId: countryId.toString(),
        }));

        return { status: true, cities: citiesWithStringBigInts };
    } catch (error) {
        console.error(`Error fetching cities by status (${status}):`, error);
        return { status: false, message: "Error fetching cities" };
    }
};

// 🔴 Soft DELETE (marks as deleted by setting deletedAt field)
export const softDeleteCity = async (adminId: number, adminRole: string, id: number) => {
    try {
        const updatedCity = await prisma.city.update({
            where: { id },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });
        return { status: true, message: "City soft deleted successfully", updatedCity };
    } catch (error) {
        console.error("❌ softDeleteCity Error:", error);
        return { status: false, message: "Error soft deleting city" };
    }
};

// 🟢 RESTORE (Restores a soft-deleted city by setting deletedAt to null)
export const restoreCity = async (adminId: number, adminRole: string, id: number) => {
    try {
        const restoredCity = await prisma.city.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the city
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        // Convert BigInt to string for serialization
        const cityWithStringBigInts = {
            ...restoredCity,
            id: restoredCity.id.toString(),
            stateId: restoredCity.stateId.toString(),
            countryId: restoredCity.countryId.toString(),
        };

        return { status: true, message: "City restored successfully", city: cityWithStringBigInts };
    } catch (error) {
        console.error("❌ restoreCity Error:", error);
        return { status: false, message: "Error restoring city" };
    }
};

// 🔴 DELETE
export const deleteCity = async (id: number) => {
    try {
        await prisma.city.delete({ where: { id } });
        return { status: true, message: "City deleted successfully" };
    } catch (error) {
        console.error("❌ deleteCity Error:", error);
        return { status: false, message: "Error deleting city" };
    }
};