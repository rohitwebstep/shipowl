import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from '@/utils/commonUtils';
import { isUserExist } from '@/utils/auth/authUtils';
import { getOrdersByStatusForSupplierReporting } from '@/app/models/order/order';
import { getAppConfig } from '@/app/models/app/appConfig';

export async function GET(req: NextRequest) {
    try {
        const supplierIdHeader = req.headers.get('x-supplier-id');
        const supplierRole = req.headers.get('x-supplier-role');

        logMessage('info', 'Supplier headers received', { supplierIdHeader, supplierRole });

        const supplierId = Number(supplierIdHeader);
        if (!supplierIdHeader || isNaN(supplierId)) {
            logMessage('warn', 'Invalid supplier ID', { supplierIdHeader });
            return NextResponse.json({ status: false, error: 'Invalid or missing supplier ID' }, { status: 400 });
        }

        const userCheck = await isUserExist(supplierId, String(supplierRole));
        if (!userCheck.status) {
            logMessage('warn', 'User not found', { supplierId, supplierRole });
            return NextResponse.json({ status: false, error: `User Not Found: ${userCheck.message}` }, { status: 404 });
        }

        const searchParams = req.nextUrl.searchParams;
        const fromRaw = searchParams.get('from');
        const toRaw = searchParams.get('to');

        const parseDate = (value: string | null, outputFormat: string): string | null => {
            if (!value) return null;

            console.log(`outputFormat - `, outputFormat);

            const patterns = [
                { regex: /^(\d{2})-(\d{2})-(\d{4})$/, order: ['year', 'month', 'day'] },  // DD-MM-YYYY
                { regex: /^(\d{4})-(\d{2})-(\d{2})$/, order: ['year', 'month', 'day'] },  // YYYY-MM-DD
                { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, order: ['year', 'month', 'day'] }, // DD/MM/YYYY
                { regex: /^(\d{4})\/(\d{2})\/(\d{2})$/, order: ['year', 'month', 'day'] }, // YYYY/MM/DD
            ];

            for (const { regex } of patterns) {
                const match = value.match(regex);
                if (match) {
                    const [, a, b, c] = match;
                    const [year, month, day] = regex === patterns[0].regex || regex === patterns[2].regex
                        ? [c, b, a] : [a, b, c];
                    const parsed = new Date(`${year}-${month}-${day}`);
                    if (!isNaN(parsed.getTime())) {
                        return parsed.toISOString().split('T')[0]; // YYYY-MM-DD
                    }
                }
            }

            logMessage('warn', 'Failed to parse date', { value });
            return null;
        };

        const fromDate = parseDate(fromRaw, 'YYYY-MM-DD') || '';
        const toDate = parseDate(toRaw, 'YYYY-MM-DD') || '';

        const ordersResult = await getOrdersByStatusForSupplierReporting('completedOrRto', supplierId, fromDate, toDate);
        const orders = ordersResult.orders;

        if (!ordersResult?.status || !orders?.length) {
            return NextResponse.json({ status: false, error: 'No orders found' }, { status: 404 });
        }

        const configResult = await getAppConfig();
        const appConfig = configResult.appConfig;

        if (!configResult.status || !appConfig) {
            return NextResponse.json({ status: false, error: 'No app config found' }, { status: 404 });
        }

        const reportAnalytics = {
            shipowl: {
                orderCount: 0,
                totalProductCost: 0,
                deliveredOrder: 0,
                rtoOrder: 0
            },
            selfship: {
                prepaid: {
                    orderCount: 0,
                    totalProductCost: 0,
                    deliveredOrder: 0,
                    rtoOrder: 0
                },
                postpaid: {
                    orderCount: 0,
                    totalProductCost: 0,
                    deliveredOrder: 0,
                    rtoOrder: 0
                },
            },
        };

        for (const order of orders) {
            const orderItems = order.items || [];
            const isPostpaid = order.isPostpaid;
            const orderType: 'prepaid' | 'postpaid' = isPostpaid ? 'postpaid' : 'prepaid';

            let shipOwlInOrder = false;

            for (const item of orderItems) {
                const quantity = Number(item.quantity) || 0;
                const variant = item.variant?.supplierProductVariant;

                if (!variant) continue;

                const modal = variant.variant?.modal?.toLowerCase() || '';

                if (modal === 'shipowl') {
                    shipOwlInOrder = true;
                    if (order.complete) {
                        reportAnalytics.shipowl.deliveredOrder++;
                        reportAnalytics.shipowl.totalProductCost += quantity * (variant.price || 0);
                    } else if (order.rtoDelivered) {
                        reportAnalytics.shipowl.rtoOrder++;
                    }
                } else if (modal === 'selfship') {
                    const section = reportAnalytics.selfship[orderType];
                    section.deliveredOrder++;
                    section.totalProductCost += quantity * (variant.price || 0);
                }
            }

            if (shipOwlInOrder) {
                reportAnalytics.shipowl.orderCount++;
            }
        }

        return NextResponse.json({ status: true, reportAnalytics }, { status: 200 });

    } catch (error) {
        logMessage('error', 'Internal error occurred', { error });
        return NextResponse.json({ status: false, error: 'Failed to fetch orders due to an internal error' }, { status: 500 });
    }
}
