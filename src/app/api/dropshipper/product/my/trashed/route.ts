import { NextRequest, NextResponse } from 'next/server';
import { logMessage } from '@/utils/commonUtils';
import { isUserExist } from '@/utils/auth/authUtils';
import { getProductsByStatus } from '@/app/models/dropshipper/product';

export async function GET(req: NextRequest) {
  try {
    const dropshipperIdHeader = req.headers.get('x-dropshipper-id');
    const dropshipperRole = req.headers.get('x-dropshipper-role');

    const dropshipperId = Number(dropshipperIdHeader);

    logMessage('info', 'Dropshipper details received', { dropshipperId, dropshipperRole });

    // Validate dropshipperId
    if (!dropshipperIdHeader || isNaN(dropshipperId)) {
      return NextResponse.json(
        { status: false, message: 'Invalid or missing dropshipper ID' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExistence = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!userExistence.status) {
      return NextResponse.json(
        { status: false, message: `User not found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    // Fetch deleted products for this dropshipper
    const productsResult = await getProductsByStatus('my', dropshipperId, 'deleted');

    if (productsResult?.status) {
      return NextResponse.json(
        { status: true, message: 'Products fetched successfully', products: productsResult.products },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: false, message: 'No products found' },
      { status: 404 }
    );

  } catch (error) {
    logMessage('error', 'Error while fetching products', { error });
    return NextResponse.json(
      { status: false, message: 'Internal server error while fetching products' },
      { status: 500 }
    );
  }
}
