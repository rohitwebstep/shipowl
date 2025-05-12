import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getGoodPincodeById, deleteGoodPincode } from '@/app/models/goodPincode';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const goodPincodeId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete GoodPincode Request:', { goodPincodeId });

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

    // Validate goodPincode ID
    const goodPincodeIdNum = Number(goodPincodeId);
    if (isNaN(goodPincodeIdNum)) {
      logMessage('warn', 'Invalid goodPincode ID format', { goodPincodeId });
      return NextResponse.json({ error: 'GoodPincode ID is invalid' }, { status: 400 });
    }

    const goodPincodeResult = await getGoodPincodeById(goodPincodeIdNum);
    if (!goodPincodeResult?.status) {
      logMessage('warn', 'GoodPincode not found', { goodPincodeIdNum });
      return NextResponse.json({ status: false, message: 'GoodPincode not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteGoodPincode(goodPincodeIdNum);  // Assuming deleteGoodPincode is for permanent deletion
    logMessage('info', `Permanent delete request for goodPincode: ${goodPincodeIdNum}`, { adminId });


    if (result?.status) {
      logMessage('info', `GoodPincode permanently deleted successfully: ${goodPincodeIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `GoodPincode permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `GoodPincode not found or could not be deleted: ${goodPincodeIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'GoodPincode not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during goodPincode deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

