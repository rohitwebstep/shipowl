import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from '@/utils/commonUtils';
import { isUserExist } from '@/utils/authUtils';
import { getProductById, removeProductImageByIndex } from '@/app/models/product';

type ImageType =
  | 'package_weight_image'
  | 'package_length_image'
  | 'package_width_image'
  | 'package_height_image';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const productId = Number(parts[parts.length - 3]);
    const imageIndex = Number(parts[parts.length - 1]);

    logMessage('debug', `Attempting to delete image (${imageIndex}) from product (${productId})`);

    // Validate admin headers
    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    if (!adminId || isNaN(Number(adminId))) {
      logMessage('warn', 'Missing or invalid admin ID header', { adminId });
      return NextResponse.json({ error: 'Admin ID is missing or invalid' }, { status: 400 });
    }

    const type = req.nextUrl.searchParams.get('type');

    logMessage('debug', `Attempting to delete image at index ${imageIndex} from product ${productId}, type: ${type}`);

    if (!type) {
      logMessage('warn', 'Missing or invalid type parameter in request', { adminId, adminRole });
      return NextResponse.json({ error: 'Type parameter is missing or invalid' }, { status: 400 });
    }

    // Authenticate admin user
    const userCheck = await isUserExist(Number(adminId), String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', 'Admin authentication failed', { adminId, adminRole });
      return NextResponse.json({ error: `Admin not found: ${userCheck.message}` }, { status: 404 });
    }

    // Validate product existence
    const productResult = await getProductById(productId);
    if (!productResult?.status) {
      logMessage('warn', 'Product not found', { productId });
      return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
    }

    const allowedTypes: ImageType[] = [
      'package_weight_image',
      'package_length_image',
      'package_width_image',
      'package_height_image',
    ];

    // Validate the type before calling
    if (!allowedTypes.includes(type as ImageType)) {
      return Response.json({ status: false, message: 'Invalid image type provided.' }, { status: 400 });
    }

    // Perform image removal
    const result = await removeProductImageByIndex(productId, type as ImageType, imageIndex);

    if (result.status) {
      logMessage('info', `Image index ${imageIndex} removed from product ${productId} by admin ${adminId}`);
      return NextResponse.json({
        status: true,
        message: 'Image removed successfully',
        data: result.product,
      }, { status: 200 });
    }

    logMessage('warn', `Image removal failed: ${result.message}`, { productId, imageIndex });
    return NextResponse.json({
      status: false,
      message: result.message || 'Image removal failed',
    }, { status: 400 });

  } catch (error) {
    logMessage('error', 'Unexpected error during image deletion', { error });
    return NextResponse.json({
      status: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
