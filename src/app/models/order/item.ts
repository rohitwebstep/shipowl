import prisma from "@/lib/prisma";

interface Item {
    dropshipperProductId: number;
    dropshipperProductVariantId: number;
    quantity: number;
    price: number;
    total: number;
    orderId: number;
}

export async function createOrderItem(items: Item[]) {
    try {
        const newOrderItems = await prisma.orderItem.createMany({
            data: items,
            skipDuplicates: true,
        });

        return { status: true, orderItems: newOrderItems };
    } catch (error) {
        console.error(`Error creating order items:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}