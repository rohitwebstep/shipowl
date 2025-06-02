import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getProductsByFiltersAndStatus, getProductsByStatus } from '@/app/models/dropshipper/product';
import { getShopifyStoresByDropshipperId } from '@/app/models/dropshipper/shopify';

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

      const shopifyAppsResult = await getShopifyStoresByDropshipperId(dropshipperId);
      if (!shopifyAppsResult.status) {
        return NextResponse.json(
          { status: false, message: 'Unable to retrieve Shopify stores for the dropshipper.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { status: true, products: productsResult.products, shopifyStores: shopifyAppsResult.shopifyStores, type },
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