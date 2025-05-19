import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getSupplierProductById } from '@/app/models/dropshipper/product';

export async function GET(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const supplierProductId = Number(req.nextUrl.pathname.split('/').pop());

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

    const productResult = await getSupplierProductById(supplierProductId, true);
    if (productResult?.status || productResult.supplierProduct) {
      return NextResponse.json({ status: true, message: productResult.message, supplierProduct: productResult.supplierProduct, otherSuppliers: productResult.otherSuppliers }, { status: 200 });
    }

    return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error while fetching products', { error });
    return NextResponse.json(
      { status: false, error: 'Failed to fetch products due to an internal error' },
      { status: 500 }
    );
  }
}