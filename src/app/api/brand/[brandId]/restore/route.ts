import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getBrandById, restoreBrand } from '@/app/models/brand';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const brandId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete Brand Request:', { brandId });

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

    const brandIdNum = Number(brandId);
    if (isNaN(brandIdNum)) {
      logMessage('warn', 'Invalid brand ID', { brandId });
      return NextResponse.json({ error: 'Invalid brand ID' }, { status: 400 });
    }

    const brandResult = await getBrandById(brandIdNum);
    logMessage('debug', 'Brand fetch result:', brandResult);
    if (!brandResult?.status) {
      logMessage('warn', 'Brand not found', { brandIdNum });
      return NextResponse.json({ status: false, message: 'Brand not found' }, { status: 404 });
    }

    // Restore the brand (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreBrand(adminId, String(adminRole), brandIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'Brand restored successfully:', restoreResult.restoredBrand);
      return NextResponse.json({ status: true, brand: restoreResult.restoredBrand }, { status: 200 });
    }

    logMessage('error', 'Brand restore failed');
    return NextResponse.json({ status: false, error: 'Brand restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ Brand restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
