import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getBadPincodeById, deleteBadPincode } from '@/app/models/badPincode';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const badPincodeId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete BadPincode Request:', { badPincodeId });

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

    // Validate badPincode ID
    const badPincodeIdNum = Number(badPincodeId);
    if (isNaN(badPincodeIdNum)) {
      logMessage('warn', 'Invalid badPincode ID format', { badPincodeId });
      return NextResponse.json({ error: 'BadPincode ID is invalid' }, { status: 400 });
    }

    const badPincodeResult = await getBadPincodeById(badPincodeIdNum);
    if (!badPincodeResult?.status) {
      logMessage('warn', 'BadPincode not found', { badPincodeIdNum });
      return NextResponse.json({ status: false, message: 'BadPincode not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteBadPincode(badPincodeIdNum);  // Assuming deleteBadPincode is for permanent deletion
    logMessage('info', `Permanent delete request for badPincode: ${badPincodeIdNum}`, { adminId });


    if (result?.status) {
      logMessage('info', `BadPincode permanently deleted successfully: ${badPincodeIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `BadPincode permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `BadPincode not found or could not be deleted: ${badPincodeIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'BadPincode not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during badPincode deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

