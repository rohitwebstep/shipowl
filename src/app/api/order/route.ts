import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { isLocationHierarchyCorrect } from '@/app/models/location/city';
import { checkPaymentIdAvailability, createOrder, getOrdersByStatus } from '@/app/models/order/order';
import { createOrderItem } from '@/app/models/order/item';
import { getProductById, getProductVariantById } from '@/app/models/product/product';
// import { placeOrderShipping } from '@/utils/order/placeOrderShipping';

interface Item {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  total: number;
  orderId: number;
}

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for order creation');

    const requiredFields = [
      'status',
      'subtotal',
      'tax',
      'discount',
      'totalAmount',
      'currency',
      'shippingName',
      'shippingPhone',
      'shippingEmail',
      'shippingAddress',
      'shippingZip',
      'shippingCountry',
      'shippingState',
      'shippingCity',
      'billingName',
      'billingPhone',
      'billingEmail',
      'billingAddress',
      'billingZip',
      'billingCountry',
      'billingState',
      'billingCity',
      'payment'
    ];
    const formData = await req.formData();
    const validation = validateFormData(formData, {
      requiredFields: requiredFields,
      patternValidations: {
        status: 'string',
        subtotal: 'number',
        tax: 'number',
        discount: 'number',
        totalAmount: 'number',
        currency: 'string',
        shippingName: 'string',
        shippingPhone: 'string',
        shippingEmail: 'string',
        shippingAddress: 'string',
        shippingZip: 'string',
        shippingCountry: 'number',
        shippingState: 'number',
        shippingCity: 'number',
        billingName: 'string',
        billingPhone: 'string',
        billingEmail: 'string',
        billingAddress: 'string',
        billingZip: 'string',
        billingCountry: 'number',
        billingState: 'number',
        billingCity: 'number',
        payment: 'number',
      },
    });

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json({ status: false, error: validation.error, message: validation.message }, { status: 400 });
    }

    const extractNumber = (key: string) => Number(formData.get(key)) || null;
    const extractString = (key: string) => (formData.get(key) as string) || null;
    const extractJSON = (key: string): Record<string, unknown> | null => {

      const value = extractString(key);
      const cleanedValue = typeof value === 'string' ? value.replace(/[\/\\]/g, '') : value;

      let parsedData;
      if (typeof cleanedValue === 'string') {
        try {
          parsedData = JSON.parse(cleanedValue);
          logMessage('info', "✅ Parsed value: 1", parsedData);
          return parsedData;
        } catch (error) {
          logMessage('warn', 'Failed to parse JSON value:', error);
        }

        try {
          parsedData = JSON.parse(cleanedValue);
          logMessage('info', "✅ Parsed value: 2", parsedData);
          return parsedData;
        } catch (error) {
          logMessage('warn', 'Failed to parse JSON value:', error);
          return null;
        }
      }

      if (typeof cleanedValue === 'object' && cleanedValue !== null) {
        logMessage('info', "✅ Parsed value: 3", cleanedValue);
        return cleanedValue;
      }

      return null;
    };

    const paymentIdNum = Number(extractNumber('payment'));
    if (isNaN(paymentIdNum)) {
      logMessage('warn', 'Invalid Payment ID', { paymentIdNum });
      return NextResponse.json({ error: 'Invalid Payment ID' }, { status: 400 });
    }

    const PaymentResult = await checkPaymentIdAvailability(paymentIdNum);
    if (!PaymentResult?.status) {
      logMessage('warn', 'Payment not found', { paymentIdNum });
      return NextResponse.json({ status: false, message: PaymentResult.message || 'Payment not found' }, { status: 404 });
    }

    const shippingCountryId = extractNumber('shippingCountry') || 0;
    const shippingStateId = extractNumber('shippingState') || 0;
    const shippingCityId = extractNumber('shippingCity') || 0;

    const isShippingLocationHierarchyCorrectResult = await isLocationHierarchyCorrect(shippingCityId, shippingStateId, shippingCountryId);
    logMessage('debug', 'Location hierarchy check result:', isShippingLocationHierarchyCorrectResult);
    if (!isShippingLocationHierarchyCorrectResult.status) {
      logMessage('warn', `Location hierarchy is incorrect: ${isShippingLocationHierarchyCorrectResult.message}`);
      return NextResponse.json(
        { status: false, message: isShippingLocationHierarchyCorrectResult.message || 'Location hierarchy is incorrect' },
        { status: 400 }
      );
    }

    const billingCountryId = extractNumber('billingCountry') || 0;
    const billingStateId = extractNumber('billingState') || 0;
    const billingCityId = extractNumber('billingCity') || 0;

    const isbillingLocationHierarchyCorrectResult = await isLocationHierarchyCorrect(billingCityId, billingStateId, billingCountryId);
    logMessage('debug', 'Location hierarchy check result:', isbillingLocationHierarchyCorrectResult);
    if (!isbillingLocationHierarchyCorrectResult.status) {
      logMessage('warn', `Location hierarchy is incorrect: ${isbillingLocationHierarchyCorrectResult.message}`);
      return NextResponse.json(
        { status: false, message: isbillingLocationHierarchyCorrectResult.message || 'Location hierarchy is incorrect' },
        { status: 400 }
      );
    }

    const rawItems = extractJSON('items');

    console.log(`rawItems`, rawItems);
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      logMessage('warn', 'Variants are not valid or empty');
      return NextResponse.json({ status: false, error: 'Variants are not valid or empty' }, { status: 400 });
    }
    const items: Item[] = Array.isArray(rawItems) ? rawItems as Item[] : [];

    console.log(`items - `, items);

    const orderPayload = {
      status: extractString('status') || '',
      orderNote: extractString('orderNote') || '',
      subtotal: extractNumber('subtotal') || 0,
      tax: extractNumber('tax') || 0,
      discount: extractNumber('discount') || 0,
      totalAmount: extractNumber('totalAmount') || 0,
      currency: extractString('currency') || 'INR',
      shippingName: extractString('shippingName') || '',
      shippingPhone: extractString('shippingPhone') || '',
      shippingEmail: extractString('shippingEmail') || '',
      shippingAddress: extractString('shippingAddress') || '',
      shippingZip: extractString('shippingZip') || '',
      shippingCountry: {
        connect: {
          id: shippingCountryId,
        },
      },
      shippingState: {
        connect: {
          id: shippingStateId,
        },
      },
      shippingCity: {
        connect: {
          id: shippingCityId,
        },
      },
      billingName: extractString('billingName') || '',
      billingPhone: extractString('billingPhone') || '',
      billingEmail: extractString('billingEmail') || '',
      billingAddress: extractString('billingAddress') || '',
      billingZip: extractString('billingZip') || '',
      billingCountry: {
        connect: {
          id: billingCountryId,
        },
      },
      billingState: {
        connect: {
          id: billingStateId,
        },
      },
      billingCity: {
        connect: {
          id: billingCityId,
        },
      },
      payment: {
        connect: {
          id: paymentIdNum,
        },
      }
    };

    logMessage('info', 'Order payload created:', orderPayload);

    const orderCreateResult = await createOrder(orderPayload);

    if (!orderCreateResult || !orderCreateResult.status || !orderCreateResult.order) {
      logMessage('error', 'Order creation failed:', orderCreateResult?.message || 'Unknown error');
      return NextResponse.json({ status: false, error: orderCreateResult?.message || 'Order creation failed' }, { status: 500 });
    }

    const orderItemPayload: Item[] = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const variantId = Number(item.variantId);

      const [productExists, variantExists] = await Promise.all([
        await getProductById(productId),
        await getProductVariantById(variantId),
      ]);

      if (!productExists.status || !variantExists.status) {
        console.warn(`Skipping item with invalid product or variant:`, item);
        continue;
      }

      orderItemPayload.push({
        productId,
        variantId,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.total),
        orderId: orderCreateResult.order.id,
      });
    }

    logMessage('info', 'Order payload created:', orderItemPayload);

    const orderItemCreateResult = await createOrderItem(orderItemPayload);

    if (!orderItemCreateResult || !orderItemCreateResult.status || !orderItemCreateResult.orderItems) {
      logMessage('error', 'Order creation failed:', orderItemCreateResult?.message || 'Unknown error');
      return NextResponse.json({ status: false, error: orderItemCreateResult?.message || 'Order creation failed' }, { status: 500 });
    }

    /*
    const placeOrderShippingResult = await placeOrderShipping(orderCreateResult.order.id);
    logMessage('info', 'Order shipping created:', placeOrderShippingResult);

    if (!placeOrderShippingResult || !placeOrderShippingResult.status) {
      logMessage('error', 'Order shipping creation failed:', placeOrderShippingResult?.message || 'Unknown error');
      return NextResponse.json({ status: false, error: placeOrderShippingResult?.message || 'Order shipping creation failed' }, { status: 500 });
    }
    logMessage('info', 'Order created successfully:', orderCreateResult.order);

    return NextResponse.json(
      { status: true, error: placeOrderShippingResult?.message || 'Order created Successfuly' },
      { status: 200 }
    );
    */

    return NextResponse.json(
      { status: true, error: orderItemCreateResult?.message || 'Order created Successfuly' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Order Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {

    // Retrieve admin details from request headers
    const adminIdHeader = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    // Log admin info
    logMessage('info', 'Admin details received', { adminIdHeader, adminRole });

    // Validate adminId
    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', 'Invalid admin ID received', { adminIdHeader });
      return NextResponse.json(
        { status: false, error: 'Invalid or missing admin ID' },
        { status: 400 }
      );
    }

    // Check if the admin exists
    const userExistence = await isUserExist(adminId, String(adminRole));
    if (!userExistence.status) {
      logMessage('warn', 'Admin user not found', { adminId, adminRole });
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    // Fetch orders based on filters
    const ordersResult = await getOrdersByStatus('notDeleted');

    // Handle response based on orders result
    if (ordersResult?.status) {
      return NextResponse.json(
        { status: true, orders: ordersResult.orders },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: false, error: 'No orders found' },
      { status: 404 }
    );
  } catch (error) {
    // Log and handle any unexpected errors
    logMessage('error', 'Error while fetching orders', { error });
    return NextResponse.json(
      { status: false, error: 'Failed to fetch orders due to an internal error' },
      { status: 500 }
    );
  }
}
