import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { isUserExist } from "@/utils/authUtils";
import { saveFilesFromFormData, deleteFile } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { createCategory } from '@/app/models/category';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

export async function POST(req: NextRequest) {
  try {
    console.log(`Hit`);
    // Get headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      console.log(`adminIdHeader - `, adminIdHeader);
      console.log(`adminRole - `, adminRole);
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
      requiredFields: ['name'],
      patternValidations: {
        status: 'boolean',
      },
    });

    console.log(`formData - `, formData);

    if (!validation.isValid) {
      return NextResponse.json({ status: false, error: validation.errors }, { status: 400 });
    }

    // Extract fields
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = statusRaw === 'true' || statusRaw === '1';

    // File upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'category');
    const fileData = await saveFilesFromFormData(formData, 'image', {
      dir: uploadDir,
      pattern: 'slug-unique',
      multiple: isMultipleImages,
    });

    console.log(`fileData - `, fileData);
    let image = '';

    if (fileData) {
      image = isMultipleImages
        ? (fileData as UploadedFileInfo[]).map(file => file.url).join(', ')
        : (fileData as UploadedFileInfo).url;
    }

    const categoryPayload = {
      name,
      description,
      status,
      image,
    };

    console.log("📦 categoryPayload:", categoryPayload);

    const categoryCreateResult = await createCategory(adminId, String(adminRole), categoryPayload);

    if (categoryCreateResult?.status) {
      return NextResponse.json({ status: true, category: categoryCreateResult.category }, { status: 200 });
    }

    // ❌ Category creation failed — delete uploaded file(s)
    const deletePath = (file: UploadedFileInfo) => path.join(uploadDir, path.basename(file.url));

    if (isMultipleImages && Array.isArray(fileData)) {
      await Promise.all(fileData.map(file => deleteFile(deletePath(file))));
    } else {
      await deleteFile(deletePath(fileData as UploadedFileInfo));
    }

    return NextResponse.json(
      { status: false, error: categoryCreateResult?.message || 'Category creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('❌ Category Creation Error:', err);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}
