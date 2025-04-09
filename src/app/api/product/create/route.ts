import { NextRequest, NextResponse } from 'next/server';
import { isUserExist } from '@/utils/authUtils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    if (!adminId || isNaN(Number(adminId))) {
      return NextResponse.json({ error: 'User ID is missing or invalid in request' }, { status: 400 });
    }

    const formData = await req.formData();
    const formDataObj: { [key: string]: any } = {};

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // 🟡 Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log(`📁 Created uploads directory at ${uploadsDir}`);
    }

    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.name) {
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadPath = path.join(uploadsDir, value.name);

        await writeFile(uploadPath, buffer);
        console.log(`✅ Saved file ${value.name} at ${uploadPath}`);

        const fileInfo = {
          name: value.name,
          type: value.type,
          size: value.size,
          url: `/uploads/${value.name}`,
        };

        if (formDataObj[key]) {
          if (!Array.isArray(formDataObj[key])) {
            formDataObj[key] = [formDataObj[key]];
          }
          formDataObj[key].push(fileInfo);
        } else {
          formDataObj[key] = fileInfo;
        }
      } else {
        formDataObj[key] = value;
      }
    }

    const result = await isUserExist(Number(adminId), String(adminRole));
    if (!result.status) {
      return NextResponse.json({ error: `User Not Found: ${result.message}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: formDataObj }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
