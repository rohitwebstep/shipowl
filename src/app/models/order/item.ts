import prisma from "@/lib/prisma";

interface Item {
  dropshipperProductId: number;
  dropshipperProductVariantId: number;
  quantity: number;
  price: number;
  total: number;
  orderId: number;
}

interface UpdateRTOInfoInput {
  orderId: number;
  orderItemId: number;
  status: string;
  uploadedMedia?: {
    packingGallery?: string[];
    unboxingGallery?: string[];
  };
}

interface UpdateData {
  supplierRTOResponse: string;
  packingGallery: string | null;
  unboxingGallery: string | null;
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

export async function getOrderItem(orderId: number, orderItemId: number) {
  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    if (!orderItem) {
      return { status: false, message: "Order item not found" };
    }

    if (orderItem.orderId !== orderId) {
      return { status: false, message: "Order ID does not match with the order item" };
    }

    return { status: true, message: "Order item found", orderItem };
  } catch (error) {
    console.error("Error fetching order item:", error);
    return { status: false, message: "Internal Server Error" };
  }
}

export async function updateOrderItemRTOInfo({
  orderId,
  orderItemId,
  status,
  uploadedMedia = {},
}: UpdateRTOInfoInput) {
  const allowedStatuses = ['received', 'not received', 'wrong item received'];

  try {
    // Validate status
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return { status: false, message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` };
    }

    // Fetch order item
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    if (!orderItem) {
      return { status: false, message: "Order item not found." };
    }

    if (orderItem.orderId !== orderId) {
      return { status: false, message: "Order ID does not match the order item." };
    }

    // If status is 'wrong item received', validate uploadedMedia
    if (status.toLowerCase() === 'wrong item received') {
      const { packingGallery, unboxingGallery } = uploadedMedia;
      if (!packingGallery || !unboxingGallery) {
        return {
          status: false,
          message: 'Both packingGallery and unboxingGallery files must be provided when status is "wrong item received".',
        };
      }
    }

    // Prepare update data
    const updateData: UpdateData = {
      supplierRTOResponse: status,
      packingGallery: null,
      unboxingGallery: null,
    };

    if (status.toLowerCase() === 'wrong item received') {
      updateData.packingGallery = JSON.stringify(uploadedMedia.packingGallery);
      updateData.unboxingGallery = JSON.stringify(uploadedMedia.unboxingGallery);
    } else {
      updateData.packingGallery = null;
      updateData.unboxingGallery = null;
    }

    // Update orderItem record
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: updateData,
    });

    return { status: true, message: "Order item RTO info updated successfully.", orderItem: updatedOrderItem };
  } catch (error) {
    console.error("Error updating order item RTO info:", error);
    return { status: false, message: "Internal Server Error" };
  }
}