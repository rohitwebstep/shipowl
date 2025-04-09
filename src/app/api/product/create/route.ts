import { NextRequest, NextResponse } from 'next/server';
import { saveFilesFromFormData } from '@/utils/saveFiles';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'products');

    const fileData = await saveFilesFromFormData(formData, 'image', {
      dir: uploadPath,
      pattern: 'slug-unique',
      multiple: true,
    });

    return NextResponse.json({ success: true, files: fileData });
  } catch (err) {
    console.error('❌ File Save Error:', err);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}
