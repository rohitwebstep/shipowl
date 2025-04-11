import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getBrandById, deleteBrand } from '@/app/models/brand';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const brandId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete Brand Request:', { brandId });

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

    // Validate brand ID
    const brandIdNum = Number(brandId);
    if (isNaN(brandIdNum)) {
      logMessage('warn', 'Invalid brand ID format', { brandId });
      return NextResponse.json({ error: 'Brand ID is invalid' }, { status: 400 });
    }

    const brandResult = await getBrandById(brandIdNum);
    if (!brandResult?.status) {
      logMessage('warn', 'Brand not found', { brandIdNum });
      return NextResponse.json({ status: false, message: 'Brand not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteBrand(brandIdNum);  // Assuming deleteBrand is for permanent deletion
    logMessage('info', `Permanent delete request for brand: ${brandIdNum}`, { adminId });


    if (result?.status) {
      logMessage('info', `Brand permanently deleted successfully: ${brandIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `Brand permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `Brand not found or could not be deleted: ${brandIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'Brand not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during brand deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

