import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { createDropshipperProduct, checkProductForDropshipper } from '@/app/models/dropshipper/product';
import { getProductsByFiltersAndStatus, getProductsByStatus } from '@/app/models/dropshipper/product';

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

    const filters: Record<string, number> = {};
    if (categoryId) filters.categoryId = Number(categoryId);
    if (brandId) filters.brandId = Number(brandId);

    const productsResult = (categoryId || brandId)
      ? await getProductsByFiltersAndStatus(type, filters, dropshipperId, status)
      : await getProductsByStatus(type, dropshipperId, status);

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

    const requiredFields = ['supplierProductId'];
    const formData = await req.formData();
    const validation = validateFormData(formData, {
      requiredFields,
      patternValidations: {
        supplierProductId: 'number',
      },
    });

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json({ status: false, error: validation.error, message: validation.message }, { status: 400 });
    }

    const extractNumber = (key: string) => Number(formData.get(key)) || 0;
    const supplierProductId = extractNumber('supplierProductId');

    const productResult = await checkProductForDropshipper(dropshipperId, supplierProductId);
    if (!productResult?.status || productResult.existsInDropshipperProduct) {
      return NextResponse.json({ status: true, message: productResult.message }, { status: 200 });
    }

    const rawVariants = formData.get('variants') as string | null;
    let parsedVariants: any[] = [];

    if (rawVariants) {
      try {
        parsedVariants = JSON.parse(rawVariants);

        if (!Array.isArray(parsedVariants)) {
          throw new Error('Variants must be an array');
        }

        // Validate and sanitize each variant
        parsedVariants = parsedVariants.map((variant, index) => {
          const errors = [];

          if (typeof variant.variantId !== 'number') errors.push('variantId must be a number');
          if (typeof variant.stock !== 'number') errors.push('stock must be a number');
          if (typeof variant.price !== 'number') errors.push('price must be a number');

          return {
            variantId: variant.variantId,
            stock: variant.stock,
            price: variant.price,
            status: typeof variant.status === 'boolean' ? variant.status : true,
            errors,
            index
          };
        });

        const variantErrors = parsedVariants.filter(v => v.errors.length > 0);
        if (variantErrors.length > 0) {
          const errorDetails = variantErrors.map(v => `Variant at index ${v.index}: ${v.errors.join(', ')}`).join('; ');
          return NextResponse.json({ status: false, message: 'Variant validation failed', error: errorDetails }, { status: 400 });
        }

      } catch (err: any) {
        return NextResponse.json({ status: false, message: 'Invalid variants JSON', error: err.message }, { status: 400 });
      }
    }

    const productPayload = {
      supplierProductId,
      dropshipperId,
      variants: parsedVariants,
      createdBy: dropshipperId,
      createdByRole: dropshipperRole,
    };

    logMessage('info', 'Product payload created:', productPayload);

    const productCreateResult = await createDropshipperProduct(dropshipperId, String(dropshipperRole), productPayload);

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
