import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getStateById, restoreState } from '@/app/models/location/state';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const stateId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete State Request:', { stateId });

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

    const stateIdNum = Number(stateId);
    if (isNaN(stateIdNum)) {
      logMessage('warn', 'Invalid state ID', { stateId });
      return NextResponse.json({ error: 'Invalid state ID' }, { status: 400 });
    }

    const stateResult = await getStateById(stateIdNum);
    logMessage('debug', 'State fetch result:', stateResult);
    if (!stateResult?.status) {
      logMessage('warn', 'State not found', { stateIdNum });
      return NextResponse.json({ status: false, message: 'State not found' }, { status: 404 });
    }

    // Restore the state (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreState(adminId, String(adminRole), stateIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'State restored successfully:', restoreResult.state);
      return NextResponse.json({ status: true, state: restoreResult.state }, { status: 200 });
    }

    logMessage('error', 'State restore failed');
    return NextResponse.json({ status: false, error: 'State restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ State restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
