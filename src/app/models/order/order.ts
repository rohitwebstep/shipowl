import prisma from "@/lib/prisma";

interface Order {
    id?: string;
    orderNumber: string;
    status: string;
    orderNote?: string;
    subtotal: number;
    tax: number;
    discount: number;
    totalAmount: number;
    currency: string;
    shippingName: string;
    shippingPhone: string;
    shippingEmail: string;
    shippingAddress: string;
    shippingZip: string;
    shippingCountry: {
        connect: { id: number }; // or whatever your relation is
    };
    shippingState: {
        connect: { id: number }; // or whatever your relation is
    };
    shippingCity: {
        connect: { id: number }; // or whatever your relation is
    };
    billingName: string;
    billingPhone: string;
    billingEmail: string;
    billingAddress: string;
    billingZip: string;
    billingCountry: {
        connect: { id: number }; // or whatever your relation is
    };
    billingState: {
        connect: { id: number }; // or whatever your relation is
    };
    billingCity: {
        connect: { id: number }; // or whatever your relation is
    };
    payment: {
        connect: { id: number }; // or whatever your relation is
    };
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

export async function checkPaymentIdAvailability(paymentId: number) {
    try {
        // Check if the payment exists
        const existingPayment = await prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!existingPayment) {
            return {
                status: false,
                message: `Payment ID "${paymentId}" does not exist.`,
            };
        }

        // Check if the payment ID is already linked to an order
        const usedInOrder = await prisma.order.findFirst({
            where: { paymentId: paymentId },
        });

        if (usedInOrder) {
            return {
                status: false,
                message: `Payment ID "${paymentId}" is already assigned to an order.`,
            };
        }

        return {
            status: true,
            message: `Payment ID "${paymentId}" is available.`,
        };
    } catch (error) {
        console.error("Error checking Payment ID:", error);
        return {
            status: false,
            message: "Error while checking Payment ID availability.",
        };
    }
}


export async function createOrder(order: Order) {

    try {
        const {
            orderNumber,
            status,
            orderNote,
            subtotal,
            tax,
            discount,
            totalAmount,
            currency,
            shippingName,
            shippingPhone,
            shippingEmail,
            shippingAddress,
            shippingZip,
            shippingCountry,
            shippingState,
            shippingCity,
            billingName,
            billingPhone,
            billingEmail,
            billingAddress,
            billingZip,
            billingCountry,
            billingState,
            billingCity,
            payment,
        } = order;

        const newOrder = await prisma.order.create({
            data: {
                orderNumber,
                status,
                orderNote,
                subtotal,
                tax,
                discount,
                totalAmount,
                currency,
                shippingName,
                shippingPhone,
                shippingEmail,
                shippingAddress,
                shippingZip,
                shippingCountry,
                shippingState,
                shippingCity,
                billingName,
                billingPhone,
                billingEmail,
                billingAddress,
                billingZip,
                billingCountry,
                billingState,
                billingCity,
                payment,
                createdAt: new Date(),
            },
        });

        return { status: true, order: serializeBigInt(newOrder) };
    } catch (error) {
        console.error(`Error creating order:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

// 🟡 UPDATE
export const updateOrder = async (
    adminId: number,
    adminRole: string,
    orderId: number,
    data: Order
) => {
    try {
        const {
            orderNumber,
            status,
            orderNote,
            subtotal,
            tax,
            discount,
            totalAmount,
            currency,
            shippingName,
            shippingPhone,
            shippingEmail,
            shippingAddress,
            shippingZip,
            shippingCountry,
            shippingState,
            shippingCity,
            billingName,
            billingPhone,
            billingEmail,
            billingAddress,
            billingZip,
            billingCountry,
            billingState,
            billingCity,
            payment,
            updatedBy,
            updatedByRole,
        } = data;

        const order = await prisma.order.update({
            where: { id: orderId }, // Assuming 'id' is the correct primary key field
            data: {
                orderNumber,
                status,
                orderNote,
                subtotal,
                tax,
                discount,
                totalAmount,
                currency,
                shippingName,
                shippingPhone,
                shippingEmail,
                shippingAddress,
                shippingZip,
                shippingCountry,
                shippingState,
                shippingCity,
                billingName,
                billingPhone,
                billingEmail,
                billingAddress,
                billingZip,
                billingCountry,
                billingState,
                billingCity,
                payment,
                updatedAt: new Date(),
                updatedBy: updatedBy,
                updatedByRole: updatedByRole,
            },
        });

        return { status: true, order: serializeBigInt(order) };
    } catch (error) {
        console.error("❌ updateOrder Error:", error);
        return { status: false, message: "Error updating order" };
    }
};

// 🔵 GET BY ID
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

// 🟣 GET ALL
export const getAllOrders = async () => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { id: 'desc' },
        });
        return { status: true, orders: serializeBigInt(orders) };
    } catch (error) {
        console.error("❌ getAllOrders Error:", error);
        return { status: false, message: "Error fetching orders" };
    }
};

export const getOrdersByStatus = async (status: "active" | "inactive" | "deleted" | "notDeleted") => {
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

        const orders = await prisma.order.findMany({
            where: whereCondition,
            orderBy: { id: "desc" },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shippingCountry: true,
                shippingState: true,
                shippingCity: true,
                billingCountry: true,
                billingState: true,
                billingCity: true,
                payment: true,
            },
        });

        return { status: true, orders: serializeBigInt(orders) };
    } catch (error) {
        console.error(`Error fetching orders by status (${status}):`, error);
        return { status: false, message: "Error fetching orders" };
    }
};

// 🔴 Soft DELETE (marks as deleted by setting deletedAt field)
export const softDeleteOrder = async (adminId: number, adminRole: string, id: number) => {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });
        return { status: true, message: "Order soft deleted successfully", updatedOrder: serializeBigInt(updatedOrder) };
    } catch (error) {
        console.error("❌ softDeleteOrder Error:", error);
        return { status: false, message: "Error soft deleting order" };
    }
};

// 🟢 RESTORE (Restores a soft-deleted order by setting deletedAt to null)
export const restoreOrder = async (adminId: number, adminRole: string, id: number) => {
    try {
        const restoredOrder = await prisma.order.update({
            where: { id },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the order
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        return { status: true, message: "Order restored successfully", restoredOrder: serializeBigInt(restoredOrder) };
    } catch (error) {
        console.error("❌ restoreOrder Error:", error);
        return { status: false, message: "Error restoring order" };
    }
};

// 🔴 DELETE
export const deleteOrder = async (id: number) => {
    try {
        await prisma.order.delete({ where: { id } });
        return { status: true, message: "Order deleted successfully" };
    } catch (error) {
        console.error("❌ deleteOrder Error:", error);
        return { status: false, message: "Error deleting order" };
    }
};