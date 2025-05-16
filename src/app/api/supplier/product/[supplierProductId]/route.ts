import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { checkSupplierProductForSupplier, updateSupplierProduct, softDeleteSupplierProduct, restoreSupplierProduct } from '@/app/models/supplier/product';


export async function GET(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const supplierProductId = Number(req.nextUrl.pathname.split('/').pop());

    const supplierId = Number(req.headers.get('x-supplier-id'));
    const supplierRole = req.headers.get('x-supplier-role');

    logMessage('info', 'Supplier details received', { supplierId, supplierRole });

    if (!supplierId || isNaN(supplierId)) {
      return NextResponse.json(
        { status: false, error: 'Invalid or missing supplier ID' },
        { status: 400 }
      );
    }

    const userExistence = await isUserExist(supplierId, String(supplierRole));
    if (!userExistence.status) {
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    const productResult = await checkSupplierProductForSupplier(supplierId, supplierProductId);
    if (!productResult?.status || productResult.existsInSupplierProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    logMessage('info', 'Product found:', productResult.supplierProduct);
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

    // Extract productId directly from the URL path
    const supplierProductId = Number(req.nextUrl.pathname.split('/').pop());

    const supplierIdHeader = req.headers.get('x-supplier-id');
    const supplierRole = req.headers.get('x-supplier-role');
    const supplierId = Number(supplierIdHeader);

    if (!supplierIdHeader || isNaN(supplierId)) {
      logMessage('warn', `Invalid supplierIdHeader: ${supplierIdHeader}`);
      return NextResponse.json({ error: 'User ID is missing or invalid in request' }, { status: 400 });
    }

    const userCheck = await isUserExist(supplierId, String(supplierRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`);
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const productResult = await checkSupplierProductForSupplier(supplierId, supplierProductId);
    if (!productResult?.status || !productResult.existsInSupplierProduct) {
      logMessage(`debug`, `productResult - `, productResult);
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
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
      productId: extractNumber('productId') || 0,
      supplierId: supplierId,
      stock: extractNumber('stock') || 0,
      price: extractNumber('price') || 0,
      status,
      updatedBy: supplierId,
      updatedByRole: supplierRole,
    };

    logMessage('info', 'Product payload updated:', productPayload);

    const productCreateResult = await updateSupplierProduct(supplierId, String(supplierRole), supplierProductId, productPayload);

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
    const supplierProductId = Number(req.nextUrl.pathname.split('/').pop());
    const supplierId = Number(req.headers.get('x-supplier-id'));
    const supplierRole = req.headers.get('x-supplier-role');

    logMessage('info', 'Supplier details received', { supplierId, supplierRole });

    if (!supplierId || isNaN(supplierId)) {
      return NextResponse.json(
        { status: false, error: 'Invalid or missing supplier ID' },
        { status: 400 }
      );
    }

    const userExistence = await isUserExist(supplierId, String(supplierRole));
    if (!userExistence.status) {
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    const productResult = await checkSupplierProductForSupplier(supplierId, supplierProductId);
    if (!productResult?.status || productResult.existsInSupplierProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    // Restore the product (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreSupplierProduct(supplierId, String(supplierRole), supplierProductId);

    if (restoreResult?.status) {
      logMessage('info', 'Product restored successfully:', restoreResult.restoredSupplierProduct);
      return NextResponse.json({ status: true, product: restoreResult.restoredSupplierProduct }, { status: 200 });
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
    const supplierProductId = Number(req.nextUrl.pathname.split('/').pop());
    const supplierId = Number(req.headers.get('x-supplier-id'));
    const supplierRole = req.headers.get('x-supplier-role');

    logMessage('info', 'Supplier details received', { supplierId, supplierRole });

    if (!supplierId || isNaN(supplierId)) {
      return NextResponse.json(
        { status: false, error: 'Invalid or missing supplier ID' },
        { status: 400 }
      );
    }

    const userExistence = await isUserExist(supplierId, String(supplierRole));
    if (!userExistence.status) {
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    const productResult = await checkSupplierProductForSupplier(supplierId, supplierProductId);
    if (!productResult?.status || !productResult.existsInSupplierProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    const result = await softDeleteSupplierProduct(Number(supplierId), String(supplierRole), supplierProductId);  // Assuming softDeleteProduct marks the product as deleted
    logMessage('info', `Soft delete request for product: ${supplierProductId}`, { supplierId });

    if (result?.status) {
      logMessage('info', `Product soft deleted successfully: ${supplierProductId}`, { supplierId });
      return NextResponse.json({ status: true, message: `Product soft deleted successfully` }, { status: 200 });
    }

    logMessage('info', `Product not found or could not be deleted: ${supplierProductId}`, { supplierId });
    return NextResponse.json({ status: false, message: 'Product not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during product deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

