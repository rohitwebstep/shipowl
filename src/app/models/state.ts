import prisma from "@/lib/prisma";

export interface State {
    id: number;
    name: string;
    fipsCode?: string | null;
    iso2?: string | null;
    type?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    flag: number;
    wikiDataId?: string | null;
    createdAt: string;
    updatedAt: string;
}

// 🔵 GET BY ID
export const getStateById = async (id: number) => {
    try {
        const state = await prisma.state.findUnique({
            where: { id },
        });

        if (!state) return { status: false, message: "State not found" };
        return { status: true, state };
    } catch (error) {
        console.error("❌ getStateById Error:", error);
        return { status: false, message: "Error fetching state" };
    }
};

// 🟣 GET ALL
export const getAllStates = async () => {
    try {
        const states = await prisma.state.findMany({
            orderBy: { name: 'asc' },
        });

        // Convert BigInt to string for serialization
        const statesWithStringBigInts = states.map(state => ({
            ...state,
            id: state.id.toString()
        }));
        return { status: true, states: statesWithStringBigInts };
    } catch (error) {
        console.error("❌ getAllStates Error:", error);
        return { status: false, message: "Error fetching states" };
    }
};