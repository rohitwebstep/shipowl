import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { isUserExist } from "@/utils/authUtils";
import { saveFilesFromFormData } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { createProduct } from '@/app/api/models/product';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

export async function POST(req: NextRequest) {
  try {
    // Get headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      return NextResponse.json(
        { error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const isMultipleImages = false; // Set true to allow multiple image uploads

    const formData = await req.formData();

    // Validate input
    const validation = validateFormData(formData, {
      requiredFields: ['name', 'price', 'quantity'],
      patternValidations: {
        price: 'number',
        quantity: 'number',
        status: 'boolean',
      },
    });

    if (!validation.isValid) {
      return NextResponse.json({ status: false, error: validation.errors }, { status: 400 });
    }

    // Extract fields
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string, 10);
    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = statusRaw === 'true' || statusRaw === '1';

    // File upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    const fileData = await saveFilesFromFormData(formData, 'image', {
      dir: uploadDir,
      pattern: 'slug-unique',
      multiple: isMultipleImages,
    });

    const image = isMultipleImages
      ? (fileData as UploadedFileInfo[]).map(file => file.url).join(', ')
      : (fileData as UploadedFileInfo).url;

    const productPayload = {
      name,
      description,
      price,
      quantity,
      status,
      image,
    };

    console.log("📦 productPayload:", productPayload);

    const productCreateResult = await createProduct(adminId, productPayload);

    if (productCreateResult?.status) {
      return NextResponse.json({ status: true, product: productCreateResult.product }, { status: 200 });
    }

    return NextResponse.json({ status: false, error: productCreateResult?.message || 'Product creation failed' }, { status: 500 });

  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('❌ Product Creation Error:', err);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}
