import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getGoodPincodeById, restoreGoodPincode } from '@/app/models/goodPincode';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const goodPincodeId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete GoodPincode Request:', { goodPincodeId });

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

    const goodPincodeIdNum = Number(goodPincodeId);
    if (isNaN(goodPincodeIdNum)) {
      logMessage('warn', 'Invalid goodPincode ID', { goodPincodeId });
      return NextResponse.json({ error: 'Invalid goodPincode ID' }, { status: 400 });
    }

    const goodPincodeResult = await getGoodPincodeById(goodPincodeIdNum);
    logMessage('debug', 'GoodPincode fetch result:', goodPincodeResult);
    if (!goodPincodeResult?.status) {
      logMessage('warn', 'GoodPincode not found', { goodPincodeIdNum });
      return NextResponse.json({ status: false, message: 'GoodPincode not found' }, { status: 404 });
    }

    // Restore the goodPincode (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreGoodPincode(adminId, String(adminRole), goodPincodeIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'GoodPincode restored successfully:', restoreResult.restoredGoodPincode);
      return NextResponse.json({ status: true, goodPincode: restoreResult.restoredGoodPincode }, { status: 200 });
    }

    logMessage('error', 'GoodPincode restore failed');
    return NextResponse.json({ status: false, error: 'GoodPincode restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ GoodPincode restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
