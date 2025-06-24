import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from '@/utils/commonUtils';
import { isUserExist } from '@/utils/auth/authUtils';
import { saveFilesFromFormData } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { getOrderById } from '@/app/models/order/order';
import { orderDisputeLevelTwo } from '@/app/models/order/item';

interface UploadedFile {
    url: string;
}

export async function POST(req: NextRequest) {
    try {
        // Extract and validate supplier ID and role headers
        const supplierIdHeader = req.headers.get('x-supplier-id');
        const supplierRole = req.headers.get('x-supplier-role');
        const supplierId = Number(supplierIdHeader);

        if (!supplierIdHeader || isNaN(supplierId)) {
            logMessage('warn', `Invalid or missing supplier ID: ${supplierIdHeader}`);
            return NextResponse.json(
                { error: 'Supplier ID is missing or invalid. Please provide a valid supplier ID.' },
                { status: 400 }
            );
        }

        // Verify user existence
        const userCheck = await isUserExist(supplierId, String(supplierRole));
        if (!userCheck.status) {
            logMessage('warn', `User verification failed: ${userCheck.message}`);
            return NextResponse.json(
                { error: `User not found or unauthorized: ${userCheck.message}` },
                { status: 404 }
            );
        }

        // TODO: Replace hardcoded IDs with dynamic values as needed
        const parts = req.nextUrl.pathname.split('/');
        const orderId = Number(parts[parts.length - 2]);

        // Fetch order and order itemW
        const orderResult = await getOrderById(orderId);

        if (!orderResult.status || !orderResult.order) {
            logMessage('warn', `Order not found or inaccessible. Order ID: ${orderId}`);
            return NextResponse.json(
                { status: false, message: 'Order not found or you do not have permission to access it.' },
                { status: 404 }
            );
        }

        /*
            const order = orderResult.order;
            const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            if (order.rtoDelivered && order.rtoDeliveredDate) {
                const rtoDeliveredTime = new Date(order.rtoDeliveredDate).getTime();
                const now = Date.now();

                if (now - rtoDeliveredTime > ONE_DAY_MS) {
                    logMessage('warn', `Dispute period expired for order item ID: ${orderId}`);
                    return NextResponse.json(
                        { status: false, message: 'Dispute period of 24 hours has expired; you cannot dispute now.' },
                        { status: 400 }
                    );
                }
            }
        */

        // Validate input
        const formData = await req.formData();
        const validation = validateFormData(formData, {
            requiredFields: ['status'],
            patternValidations: {
                status: 'string',
            },
        });

        if (!validation.isValid) {
            logMessage('warn', 'Form validation failed', validation.error);
            return NextResponse.json(
                { status: false, error: validation.error, message: validation.message },
                { status: 400 }
            );
        }

        const status = formData.get('status') as string;

        const allowedStatuses = ['received', 'not received', 'wrong item received'];

        if (!status || !allowedStatuses.includes(status.toLowerCase())) {
            logMessage('warn', `Invalid status received: ${status}`);
            return NextResponse.json(
                {
                    error: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}.`,
                },
                { status: 400 }
            );
        }

        // Handle media uploads if status is "wrong item received"
        let uploadedMedia: Record<string, string> = {};

        if (status.toLowerCase() === 'wrong item received') {

            const packingFiles = await saveFilesFromFormData(formData, 'packingGallery', {
                dir: path.join(process.cwd(), 'tmp', 'uploads', 'returns'),
                pattern: 'slug-unique',
                multiple: true,
            });

            const unboxingFiles = await saveFilesFromFormData(formData, 'unboxingGallery', {
                dir: path.join(process.cwd(), 'tmp', 'uploads', 'returns'),
                pattern: 'slug-unique',
                multiple: true,
            });

            if (
                !Array.isArray(packingFiles) ||
                !Array.isArray(unboxingFiles) ||
                (Array.isArray(packingFiles) && packingFiles.length === 0) ||
                (Array.isArray(unboxingFiles) && unboxingFiles.length === 0)
            ) {
                return NextResponse.json(
                    {
                        error: 'Media upload required.',
                        message:
                            'Please upload files for both packingGallery and unboxingGallery when status is "wrong item received".',
                    },
                    { status: 400 }
                );
            }

            uploadedMedia = {
                packingGallery: packingFiles.map((file: UploadedFile) => file.url).join(','),
                unboxingGallery: unboxingFiles.map((file: UploadedFile) => file.url).join(','),
            };

            logMessage('info', 'Packing and unboxing media URLs recorded successfully.');
        }

        // Prepare payload for update
        const orderItemRTOPayload = {
            orderId,
            status,
            uploadedMedia,
        };

        const result = await orderDisputeLevelTwo(orderItemRTOPayload);

        if (!result.status) {
            logMessage('error', `Failed to update order item status: ${result.message}`);
            return NextResponse.json(
                { error: `Failed to update order item status: ${result.message}` },
                { status: 400 }
            );
        }

        logMessage('info', `Order status updated successfully for orderId: ${orderId}`);

        return NextResponse.json(
            {
                status: true,
                message: 'Order item status updated successfully.',
            },
            { status: 200 }
        );
    } catch (error) {
        logMessage('error', `Error updating order item status: ${error}`);
        return NextResponse.json(
            { status: false, message : error || 'An unexpected error occurred while processing your request. Please try again later.' },
            { status: 500 }
        );
    }
}
