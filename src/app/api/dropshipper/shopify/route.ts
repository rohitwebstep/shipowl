import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { createDropshipperProduct, checkProductForDropshipper } from '@/app/models/dropshipper/product';
import { getProductsByFiltersAndStatus, getProductsByStatus } from '@/app/models/dropshipper/product';
import { getShopifyStoreByIdForDropshipper, getShopifyStoresByDropshipperId } from '@/app/models/dropshipper/shopify';
import { getSupplierProductVariantById } from '@/app/models/supplier/product';

type Variant = {
    variantId: number;
    stock: number;
    price: number;
    status?: boolean;
    errors: string[];
    index: number;
};

export async function GET(req: NextRequest) {
    try {
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

        const shopifyAppsResult = await getShopifyStoresByDropshipperId(dropshipperId);
        if (!shopifyAppsResult.status) {
            return NextResponse.json(
                { status: false, message: 'Unable to retrieve Shopify stores for the dropshipper.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { status: true, shopifyStores: shopifyAppsResult.shopifyStores },
            { status: 200 }
        );
    } catch (error) {
        logMessage('error', 'Error while fetching products', { error });
        return NextResponse.json(
            { status: false, error: 'Failed to fetch products due to an internal error' },
            { status: 500 }
        );
    }
}
