import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { checkDropshipperProductForDropshipper, updateDropshipperProduct, softDeleteDropshipperProduct, restoreDropshipperProduct } from '@/app/models/dropshipper/product';


export async function GET(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const dropshipperProductId = Number(req.nextUrl.pathname.split('/').pop());

    const dropshipperId = Number(req.headers.get('x-dropshipper-id'));
    const dropshipperRole = req.headers.get('x-dropshipper-role');

    logMessage('info', 'Dropshipper details received', { dropshipperId, dropshipperRole });

    if (!dropshipperId || isNaN(dropshipperId)) {
      return NextResponse.json(
        { status: false, error: 'Invalid or missing dropshipper ID' },
        { status: 400 }
      );
    }

    const userExistence = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!userExistence.status) {
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    const productResult = await checkDropshipperProductForDropshipper(dropshipperId, dropshipperProductId);
    if (!productResult?.status || productResult.existsInDropshipperProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    logMessage('info', 'Product found:', productResult.dropshipperProduct);
    return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error while fetching products', { error });
    return NextResponse.json(
      { status: false, error: 'Failed to fetch products due to an internal error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for product updation');

    // Extract dropshipperProductId directly from the URL path
    const dropshipperProductId = Number(req.nextUrl.pathname.split('/').pop());

    const dropshipperIdHeader = req.headers.get('x-dropshipper-id');
    const dropshipperRole = req.headers.get('x-dropshipper-role');
    const dropshipperId = Number(dropshipperIdHeader);

    if (!dropshipperIdHeader || isNaN(dropshipperId)) {
      logMessage('warn', `Invalid dropshipperIdHeader: ${dropshipperIdHeader}`);
      return NextResponse.json({ error: 'User ID is missing or invalid in request' }, { status: 400 });
    }

    const userCheck = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`);
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const productResult = await checkDropshipperProductForDropshipper(dropshipperId, dropshipperProductId);

    if (!productResult?.status || !productResult.existsInDropshipperProduct) {
      logMessage('debug', 'productResult - ', productResult);
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    const dropshipperProduct = productResult.dropshipperProduct;

    // ✅ Validate required fields before continuing
    if (
      typeof dropshipperProduct?.productId !== 'number' ||
      typeof dropshipperProduct?.supplierProductId !== 'number'
    ) {
      logMessage('error', 'Invalid dropshipperProduct: Missing productId or supplierProductId', dropshipperProduct);
      return NextResponse.json({ status: false, message: 'Invalid product or supplier mapping.' }, { status: 400 });
    }

    const requiredFields = ['price', 'stock', 'status'];
    const formData = await req.formData();
    const validation = validateFormData(formData, {
      requiredFields: requiredFields,
      patternValidations: {
        price: 'number',
        stock: 'number',
        status: 'boolean',
      },
    });

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json({ status: false, error: validation.error, message: validation.message }, { status: 400 });
    }

    const extractNumber = (key: string) => Number(formData.get(key)) || null;

    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

    const productPayload = {
      productId: dropshipperProduct?.productId,
      supplierProductId: dropshipperProduct?.supplierProductId,
      dropshipperId: dropshipperId,
      stock: extractNumber('stock') || 0,
      price: extractNumber('price') || 0,
      status,
      updatedBy: dropshipperId,
      updatedByRole: dropshipperRole,
    };

    logMessage('info', 'Product payload updated:', productPayload);

    const productCreateResult = await updateDropshipperProduct(dropshipperId, String(dropshipperRole), dropshipperProductId, productPayload);

    if (productCreateResult?.status) {
      return NextResponse.json({ status: true, product: productCreateResult.product }, { status: 200 });
    }

    logMessage('error', 'Product updation failed:', productCreateResult?.message || 'Unknown error');
    return NextResponse.json(
      { status: false, error: productCreateResult?.message || 'Product updation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Product Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const dropshipperProductId = Number(req.nextUrl.pathname.split('/').pop());
    const dropshipperId = Number(req.headers.get('x-dropshipper-id'));
    const dropshipperRole = req.headers.get('x-dropshipper-role');

    logMessage('info', 'Dropshipper details received', { dropshipperId, dropshipperRole });

    if (!dropshipperId || isNaN(dropshipperId)) {
      return NextResponse.json(
        { status: false, error: 'Invalid or missing dropshipper ID' },
        { status: 400 }
      );
    }

    const userExistence = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!userExistence.status) {
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    const productResult = await checkDropshipperProductForDropshipper(dropshipperId, dropshipperProductId);
    if (!productResult?.status || productResult.existsInDropshipperProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    // Restore the product (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreDropshipperProduct(dropshipperId, String(dropshipperRole), dropshipperProductId);

    if (restoreResult?.status) {
      logMessage('info', 'Product restored successfully:', restoreResult.restoredDropshipperProduct);
      return NextResponse.json({ status: true, product: restoreResult.restoredDropshipperProduct }, { status: 200 });
    }

    logMessage('error', 'Product restore failed');
    return NextResponse.json({ status: false, error: 'Product restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ Product restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const dropshipperProductId = Number(req.nextUrl.pathname.split('/').pop());
    const dropshipperId = Number(req.headers.get('x-dropshipper-id'));
    const dropshipperRole = req.headers.get('x-dropshipper-role');

    logMessage('info', 'Dropshipper details received', { dropshipperId, dropshipperRole });

    if (!dropshipperId || isNaN(dropshipperId)) {
      return NextResponse.json(
        { status: false, error: 'Invalid or missing dropshipper ID' },
        { status: 400 }
      );
    }

    const userExistence = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!userExistence.status) {
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    const productResult = await checkDropshipperProductForDropshipper(dropshipperId, dropshipperProductId);
    if (!productResult?.status || !productResult.existsInDropshipperProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    const result = await softDeleteDropshipperProduct(Number(dropshipperId), String(dropshipperRole), dropshipperProductId);  // Assuming softDeleteProduct marks the product as deleted
    logMessage('info', `Soft delete request for product: ${dropshipperProductId}`, { dropshipperId });

    if (result?.status) {
      logMessage('info', `Product soft deleted successfully: ${dropshipperProductId}`, { dropshipperId });
      return NextResponse.json({ status: true, message: `Product soft deleted successfully` }, { status: 200 });
    }

    logMessage('info', `Product not found or could not be deleted: ${dropshipperProductId}`, { dropshipperId });
    return NextResponse.json({ status: false, message: 'Product not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during product deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

