import prisma from "@/lib/prisma";
import { logMessage } from "@/utils/commonUtils";

const serializeBigInt = <T>(obj: T): T => {
    if (typeof obj === "bigint") {
        return obj.toString() as unknown as T;
    }

    if (obj instanceof Date) {
        // Return Date object unchanged, no conversion
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt) as unknown as T;
    }

    if (obj && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        ) as T;
    }

    return obj;
};

export const getOrderById = async (id: number) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!order) return { status: false, message: "Order not found" };
        return { status: true, order: serializeBigInt(order) };
    } catch (error) {
        console.error("❌ getOrderById Error:", error);
        return { status: false, message: "Error fetching order" };
    }
};

export const getOrderByOrderNumber = async (orderNumber: string) => {
    try {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: { items: true }
        });

        if (!order) return { status: false, message: "Order not found" };
        return { status: true, order: serializeBigInt(order) };
    } catch (error) {
        console.error("❌ getOrderByOrderNumber Error:", error);
        return { status: false, message: "Error fetching order" };
    }
};

export const createWarehouseCollected = async (
    orderNumber: string
) => {
    try {
        const result = await getOrderByOrderNumber(orderNumber);

        if (!result.status || !result.order?.id) {
            return {
                status: false,
                message: result.message || "Order not found or missing ID"
            };
        }

        const updatedOrder = await prisma.order.update({
            where: { id: result.order.id },
            data: {
                collectedAtWarehouse: new Date()
            },
        });

        return {
            status: true,
            order: serializeBigInt(updatedOrder)
        };

    } catch (error) {
        console.error("❌ createWarehouseCollected Error:", error);
        return {
            status: false,
            message: "An error occurred while updating the order"
        };
    }
};
