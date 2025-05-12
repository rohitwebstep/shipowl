import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getBadPincodeById, restoreBadPincode } from '@/app/models/badPincode';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const badPincodeId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete BadPincode Request:', { badPincodeId });

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

    const badPincodeIdNum = Number(badPincodeId);
    if (isNaN(badPincodeIdNum)) {
      logMessage('warn', 'Invalid badPincode ID', { badPincodeId });
      return NextResponse.json({ error: 'Invalid badPincode ID' }, { status: 400 });
    }

    const badPincodeResult = await getBadPincodeById(badPincodeIdNum);
    logMessage('debug', 'BadPincode fetch result:', badPincodeResult);
    if (!badPincodeResult?.status) {
      logMessage('warn', 'BadPincode not found', { badPincodeIdNum });
      return NextResponse.json({ status: false, message: 'BadPincode not found' }, { status: 404 });
    }

    // Restore the badPincode (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreBadPincode(adminId, String(adminRole), badPincodeIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'BadPincode restored successfully:', restoreResult.restoredBadPincode);
      return NextResponse.json({ status: true, badPincode: restoreResult.restoredBadPincode }, { status: 200 });
    }

    logMessage('error', 'BadPincode restore failed');
    return NextResponse.json({ status: false, error: 'BadPincode restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ BadPincode restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
