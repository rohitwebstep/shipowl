import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getStateById, deleteState } from '@/app/models/location/state';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const stateId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete State Request:', { stateId });

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

    // Validate state ID
    const stateIdNum = Number(stateId);
    if (isNaN(stateIdNum)) {
      logMessage('warn', 'Invalid state ID format', { stateId });
      return NextResponse.json({ error: 'State ID is invalid' }, { status: 400 });
    }

    const stateResult = await getStateById(stateIdNum);
    if (!stateResult?.status) {
      logMessage('warn', 'State not found', { stateIdNum });
      return NextResponse.json({ status: false, message: 'State not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteState(stateIdNum);  // Assuming deleteState is for permanent deletion
    logMessage('info', `Permanent delete request for state: ${stateIdNum}`, { adminId });


    if (result?.status) {
      logMessage('info', `State permanently deleted successfully: ${stateIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `State permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `State not found or could not be deleted: ${stateIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'State not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during state deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

