import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from '@/utils/commonUtils';
import { isUserExist } from '@/utils/auth/authUtils';
import { getOrdersByStatusForSupplierReporting } from '@/app/models/order/order';
import { getAppConfig } from '@/app/models/app/appConfig';
import { getSupplierById } from '@/app/models/supplier/supplier';

export async function GET(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const supplierIdRaw = parts[parts.length - 2];
    const supplierId = Number(supplierIdRaw);

    logMessage('debug', 'Supplier ID extracted from path', { supplierId });

    const adminIdHeader = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    logMessage('info', 'Admin headers received', { adminIdHeader, adminRole });

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', 'Invalid admin ID', { adminIdHeader });
      return NextResponse.json({ status: false, error: 'Invalid or missing admin ID' }, { status: 400 });
    }

    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', 'User not found', { adminId, adminRole });
      return NextResponse.json({ status: false, error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    if (isNaN(supplierId)) {
      logMessage('warn', 'Invalid supplier ID format', { supplierIdRaw });
      return NextResponse.json({ status: false, error: 'Supplier ID is invalid' }, { status: 400 });
    }

    const supplier = await getSupplierById(supplierId);
    if (!supplier?.status) {
      logMessage('warn', 'Supplier not found', { supplierId });
      return NextResponse.json({ status: false, error: 'Supplier not found' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const fromRaw = searchParams.get('from');
    const toRaw = searchParams.get('to');

    const parseDate = (value: string | null, outputFormat: string): string | null => {
      if (!value) return null;

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

    const shippingCost = Number(appConfig.shippingCost) || 0;

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
