import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { createSupplierProduct, getProductsByFiltersAndStatus, getProductsByStatus, checkProductForSupplier } from '@/app/models/supplier/product';

export async function GET(req: NextRequest) {
  try {
    const urlParams = req.nextUrl.searchParams;
    const categoryId = urlParams.get('category');
    const brandId = urlParams.get('brand');

    const rawStatus = (urlParams.get('status') ?? '').trim().toLowerCase();
    const rawType = (urlParams.get('type') ?? '').trim().toLowerCase();

    // Inline enum definitions
    type ProductStatus = 'active' | 'inactive' | 'deleted' | 'notDeleted';
    type ProductType = 'all' | 'my' | 'notmy';

    const statusMap: Record<string, ProductStatus> = {
      active: 'active',
      inactive: 'inactive',
      deleted: 'deleted',
      notdeleted: 'notDeleted'
    };

    const validTypes: ProductType[] = ['all', 'my', 'notmy'];

    const status: ProductStatus = statusMap[rawStatus] ?? 'notDeleted';
    const type: ProductType = validTypes.includes(rawType as ProductType) ? (rawType as ProductType) : 'all';

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

    const filters: Record<string, number> = {};
    if (categoryId) filters.categoryId = Number(categoryId);
    if (brandId) filters.brandId = Number(brandId);

    const productsResult = (categoryId || brandId)
      ? await getProductsByFiltersAndStatus(type, filters, supplierId, status)
      : await getProductsByStatus(type, supplierId, status);

    if (productsResult?.status) {
      return NextResponse.json(
        { status: true, products: productsResult.products },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: false, error: 'No products found' },
      { status: 404 }
    );

  } catch (error) {
    logMessage('error', 'Error while fetching products', { error });
    return NextResponse.json(
      { status: false, error: 'Failed to fetch products due to an internal error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for product creation');

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

    const requiredFields = ['productId', 'price', 'stock', 'status'];
    const formData = await req.formData();
    const validation = validateFormData(formData, {
      requiredFields: requiredFields,
      patternValidations: {
        productId: 'number',
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

    const productId = extractNumber('productId') || 0;
    const productResult = await checkProductForSupplier(supplierId, productId);
    if (!productResult?.status || !productResult.existsInSupplierProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

    const productPayload = {
      productId: extractNumber('productId') || 0,
      supplierId: supplierId,
      stock: extractNumber('stock') || 0,
      price: extractNumber('price') || 0,
      status,
      createdBy: supplierId,
      createdByRole: supplierRole,
    };

    logMessage('info', 'Product payload created:', productPayload);

    const productCreateResult = await createSupplierProduct(supplierId, String(supplierRole), productPayload);

    if (productCreateResult?.status) {
      return NextResponse.json({ status: true, product: productCreateResult.product }, { status: 200 });
    }

    logMessage('error', 'Product creation failed:', productCreateResult?.message || 'Unknown error');
    return NextResponse.json(
      { status: false, error: productCreateResult?.message || 'Product creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Product Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}