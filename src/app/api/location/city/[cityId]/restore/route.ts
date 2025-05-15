import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getCityById, restoreCity } from '@/app/models/location/city';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const cityId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete City Request:', { cityId });

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

    const cityIdNum = Number(cityId);
    if (isNaN(cityIdNum)) {
      logMessage('warn', 'Invalid city ID', { cityId });
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
    }

    const cityResult = await getCityById(cityIdNum);
    logMessage('debug', 'City fetch result:', cityResult);
    if (!cityResult?.status) {
      logMessage('warn', 'City not found', { cityIdNum });
      return NextResponse.json({ status: false, message: 'City not found' }, { status: 404 });
    }

    // Restore the city (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreCity(adminId, String(adminRole), cityIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'City restored successfully:', restoreResult.city);
      return NextResponse.json({ status: true, city: restoreResult.city }, { status: 200 });
    }

    logMessage('error', 'City restore failed');
    return NextResponse.json({ status: false, error: 'City restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ City restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
