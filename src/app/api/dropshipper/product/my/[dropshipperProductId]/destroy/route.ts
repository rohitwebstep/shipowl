import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { checkDropshipperProductForDropshipper, deleteDropshipperProduct } from '@/app/models/dropshipper/product';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const dropshipperProductId = Number(parts[parts.length - 2]);
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

    // Permanent delete operation
    const result = await deleteDropshipperProduct(dropshipperProductId);  // Assuming deleteProduct is for permanent deletion
    logMessage('info', `Permanent delete request for product: ${dropshipperProductId}`, { dropshipperId });


    if (result?.status) {
      logMessage('info', `Product permanently deleted successfully: ${dropshipperProductId}`, { dropshipperId });
      return NextResponse.json({ status: true, message: `Product permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `Product not found or could not be deleted: ${dropshipperProductId}`, { dropshipperId });
    return NextResponse.json({ status: false, message: 'Product not found or deletion failed' }, { status: 404 });

  } catch (error) {
    logMessage('error', '❌ Product restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
