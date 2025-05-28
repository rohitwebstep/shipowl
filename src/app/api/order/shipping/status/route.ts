import { NextRequest, NextResponse } from 'next/server';
import { logMessage } from "@/utils/commonUtils";
import { getOrderShippingStatus } from '@/utils/order/getOrderShippingStatus';
import { refreshPendingOrdersShippingStatus, refreshShippingApiResultOfOrder, updateAWBNuberOfOrder, updateRTIDeliveredStatusOfOrder } from '@/app/models/order/order';

export async function GET(req: NextRequest) {
    try {
        logMessage('debug', 'Order shipping status request received');

        const refreshResult = await refreshPendingOrdersShippingStatus();
        const orders = refreshResult?.orders;

        if (!orders || orders.length === 0) {
            logMessage('warn', 'No orders found to refresh shipping status');
            return NextResponse.json({
                status: false,
                message: 'No orders found to refresh shipping status',
                results: []
            }, { status: 404 });
        }

        const results = [];

        for (const order of orders) {
            const orderId = order.id;

            if (isNaN(orderId)) {
                logMessage('warn', 'Invalid order ID', { orderId });
                results.push({
                    orderId,
                    status: false,
                    message: 'Invalid order ID'
                });
                continue;
            }

            try {
                const shippingResponse = await getOrderShippingStatus(orderId);
                const shippingResult = await shippingResponse.json();
                logMessage(`debug`, `shippingResult:`, shippingResult);

                if (!shippingResult?.status) {
                    logMessage('warn', 'Order shipping status not found', { orderId });
                    results.push({
                        orderId,
                        status: false,
                        message: 'Order shipping status not found'
                    });
                } else {

                    const shippingData = shippingResult.trackingData.data;

                    const refreshShippingApiResultOfOrderResult = await refreshShippingApiResultOfOrder(orderId, shippingResult);

                    if (!refreshShippingApiResultOfOrderResult || !refreshShippingApiResultOfOrderResult.status || !refreshShippingApiResultOfOrderResult.order) {
                        logMessage('warn', 'Order shipping status not found', { orderId });
                        results.push({
                            orderId,
                            status: false,
                            message: 'Failed to update order shipping API result'
                        });
                    }

                    // Check if any status_title contains "rto" or "delivered" (case-insensitive)
                    const isDeliveredOrRTO = shippingData.some((item: { status_title: string }) => {
                        const title = item.status_title.toLowerCase();
                        return title.includes('rto') || title.includes('delivered');
                    });

                    const updateRTIDeliveredStatusOfOrderResult = await updateRTIDeliveredStatusOfOrder(orderId, isDeliveredOrRTO);

                    if (!updateRTIDeliveredStatusOfOrderResult || !updateRTIDeliveredStatusOfOrderResult.status) {
                        logMessage('warn', 'Failed to update RTO/Delivered status for order', { orderId });
                        results.push({
                            orderId,
                            status: false,
                            message: 'Failed to update RTO/Delivered status for order',
                        });
                    }

                    const updateAWBNuberOfOrderResult = await updateAWBNuberOfOrder(orderId, shippingResult.awb_number);

                    if (!updateAWBNuberOfOrderResult || !updateAWBNuberOfOrderResult.status) {
                        logMessage('warn', 'Failed to update AWB Number for order', { orderId });
                        results.push({
                            orderId,
                            status: false,
                            message: 'Failed to update AWB Number for order',
                        });
                    }

                    logMessage('info', 'Order shipping status retrieved successfully', { orderId, shippingResult });
                    results.push({
                        orderId,
                        status: true,
                        message: 'Order shipping status found',
                        data: shippingResult
                    });
                }
            } catch (error) {
                logMessage('error', 'Error fetching shipping status for order', { orderId, error });
                results.push({
                    orderId,
                    status: false,
                    message: 'Error fetching shipping status',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        }

        return NextResponse.json({
            status: true,
            message: 'Processed all orders',
            results
        }, { status: 200 });

    } catch (error) {
        logMessage('error', 'Error in order shipping status handler', { error });
        return NextResponse.json({
            status: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
