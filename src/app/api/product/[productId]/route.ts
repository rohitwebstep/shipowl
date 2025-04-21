import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { saveFilesFromFormData, deleteFile } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { getProductById, updateProduct, softDeleteProduct, restoreProduct } from '@/app/models/product';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

export async function GET(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const productId = req.nextUrl.pathname.split('/').pop();

    logMessage('debug', 'Requested Product ID:', productId);

    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    if (!adminId || isNaN(Number(adminId))) {
      logMessage('warn', 'Invalid or missing admin ID', { adminId });
      return NextResponse.json({ error: 'Invalid or missing admin ID' }, { status: 400 });
    }

    const userCheck = await isUserExist(Number(adminId), String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`, { adminId, adminRole });
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const productIdNum = Number(productId);
    if (isNaN(productIdNum)) {
      logMessage('warn', 'Invalid product ID', { productId });
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const productResult = await getProductById(productIdNum);
    if (productResult?.status) {
      logMessage('info', 'Product found:', productResult.product);
      return NextResponse.json({ status: true, product: productResult.product }, { status: 200 });
    }

    logMessage('info', 'Product found:', productResult.product);
    return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
  } catch (error) {
    logMessage('error', '❌ Error fetching single product:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const productId = req.nextUrl.pathname.split('/').pop();
    logMessage('debug', 'Requested Product ID:', productId);

    // Get headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', 'Invalid or missing admin ID header', { adminIdHeader, adminRole });
      return NextResponse.json(
        { error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`, { adminId, adminRole });
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const productIdNum = Number(productId);
    if (isNaN(productIdNum)) {
      logMessage('warn', 'Invalid product ID', { productId });
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const productResult = await getProductById(productIdNum);
    logMessage('debug', 'Product fetch result:', productResult);
    if (!productResult?.status) {
      logMessage('warn', 'Product not found', { productIdNum });
      return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
    }

    const isMultipleImages = true; // Set true to allow multiple image uploads

    const formData = await req.formData();

    // Validate input
    const validation = validateFormData(formData, {
      requiredFields: ['name'],
      patternValidations: {
        status: 'boolean',
      },
    });

    logMessage('debug', 'Form data received:', formData);

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json(
        { status: false, error: validation.error, message: validation.message },
        { status: 400 }
      );
    }

    // Extract fields
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = ['true', '1', 1, true].includes(statusRaw as string | number | boolean);

    // File upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'product');
    const fileData = await saveFilesFromFormData(formData, 'image', {
      dir: uploadDir,
      pattern: 'slug-unique',
      multiple: isMultipleImages,
    });

    logMessage('debug', 'File upload result:', fileData);
    let image = '';

    if (fileData) {
      image = isMultipleImages
        ? (fileData as UploadedFileInfo[]).map(file => file.url).join(', ')
        : (fileData as UploadedFileInfo).url;
    }

    const productPayload = {
      name,
      description,
      status,
      image,
    };

    logMessage('info', 'Product payload:', productPayload);

    const productCreateResult = await updateProduct(adminId, String(adminRole), productIdNum, productPayload);

    if (productCreateResult?.status) {
      logMessage('info', 'Product updated successfully:', productCreateResult.product);
      return NextResponse.json({ status: true, product: productCreateResult.product }, { status: 200 });
    }

    // ❌ Product creation failed — delete uploaded file(s)
    const deletePath = (file: UploadedFileInfo) => path.join(uploadDir, path.basename(file.url));

    if (isMultipleImages && Array.isArray(fileData)) {
      await Promise.all(fileData.map(file => deleteFile(deletePath(file))));
    } else {
      await deleteFile(deletePath(fileData as UploadedFileInfo));
    }

    logMessage('error', 'Product update failed', productCreateResult?.message);
    return NextResponse.json(
      { status: false, error: productCreateResult?.message || 'Product creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', '❌ Product Updation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Extract productId directly from the URL path
    const productId = req.nextUrl.pathname.split('/').pop();

    logMessage('debug', 'Requested Product ID:', productId);

    // Get headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', 'Invalid or missing admin ID header', { adminIdHeader, adminRole });
      return NextResponse.json(
        { error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`, { adminId, adminRole });
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const productIdNum = Number(productId);
    if (isNaN(productIdNum)) {
      logMessage('warn', 'Invalid product ID', { productId });
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const productResult = await getProductById(productIdNum);
    logMessage('debug', 'Product fetch result:', productResult);
    if (!productResult?.status) {
      logMessage('warn', 'Product not found', { productIdNum });
      return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
    }

    // Restore the product (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreProduct(adminId, String(adminRole), productIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'Product restored successfully:', restoreResult.restoredProduct);
      return NextResponse.json({ status: true, product: restoreResult.restoredProduct }, { status: 200 });
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
    const productId = req.nextUrl.pathname.split('/').pop();

    logMessage('debug', 'Delete Product Request:', { productId });

    // Extract admin ID and role from headers
    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    // Validate admin ID
    if (!adminId || isNaN(Number(adminId))) {
      logMessage('warn', 'Invalid or missing admin ID', { adminId });
      return NextResponse.json({ error: 'Admin ID is missing or invalid' }, { status: 400 });
    }

    // Check if the admin user exists
    const userCheck = await isUserExist(Number(adminId), String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `Admin not found: ${userCheck.message}`, { adminId, adminRole });
      return NextResponse.json({ error: `Admin not found: ${userCheck.message}` }, { status: 404 });
    }

    // Validate product ID
    const productIdNum = Number(productId);
    if (isNaN(productIdNum)) {
      logMessage('warn', 'Invalid product ID format', { productId });
      return NextResponse.json({ error: 'Product ID is invalid' }, { status: 400 });
    }

    const productResult = await getProductById(productIdNum);
    if (!productResult?.status) {
      logMessage('warn', 'Product not found', { productIdNum });
      return NextResponse.json({ status: false, message: 'Product not found' }, { status: 404 });
    }

    const result = await softDeleteProduct(Number(adminId), String(adminRole), productIdNum);  // Assuming softDeleteProduct marks the product as deleted
    logMessage('info', `Soft delete request for product: ${productIdNum}`, { adminId });

    if (result?.status) {
      logMessage('info', `Product soft deleted successfully: ${productIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `Product soft deleted successfully` }, { status: 200 });
    }

    logMessage('info', `Product not found or could not be deleted: ${productIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'Product not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during product deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

