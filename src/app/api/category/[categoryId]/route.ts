import { NextRequest, NextResponse } from 'next/server';
import { isUserExist } from "@/utils/authUtils";
import { getCategoryById } from '@/app/models/category';

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } } // Use inline typing without a separate interface
) {
  try {
    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    if (!adminId || isNaN(Number(adminId))) {
      return NextResponse.json({ error: 'Invalid or missing admin ID' }, { status: 400 });
    }

    const userCheck = await isUserExist(Number(adminId), String(adminRole));
    if (!userCheck.status) {
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const { categoryId } = params;
    const categoryIdNum = Number(categoryId);
    if (isNaN(categoryIdNum)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const categoryResult = await getCategoryById(categoryIdNum);
    if (categoryResult?.status) {
      return NextResponse.json({ status: true, category: categoryResult.category }, { status: 200 });
    }

    return NextResponse.json({ status: false, message: 'Category not found' }, { status: 404 });
  } catch (error) {
    console.error('❌ Error fetching single category:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}