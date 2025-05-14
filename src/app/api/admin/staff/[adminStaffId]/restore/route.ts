import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getAdminStaffById, restoreAdminStaff } from '@/app/models/admin/staff';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const adminStaffId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete Admin Request:', { adminStaffId });

    // Get headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminIdHeaderNum = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminIdHeaderNum)) {
      logMessage('warn', 'Invalid or missing admin ID header', { adminIdHeaderNum, adminRole });
      return NextResponse.json(
        { error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const userCheck = await isUserExist(adminIdHeaderNum, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`, { adminIdHeaderNum, adminRole });
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const adminStaffResult = await getAdminStaffById(Number(adminStaffId));
    if (!adminStaffResult?.status) {
      logMessage('warn', `Admin Staff not found: ${adminStaffResult.message}`, { adminStaffId });
      return NextResponse.json({ error: `Admin Staff not found: ${adminStaffResult.message}` }, { status: 404 });
    }

    // Restore the admin (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreAdminStaff(adminIdHeaderNum, String(adminRole), Number(adminStaffId));

    if (restoreResult?.status) {
      logMessage('info', 'Admin restored successfully:', restoreResult.restoredAdminStaff);
      return NextResponse.json({ status: true, admin: restoreResult.restoredAdminStaff, message: 'Admin Staff restored successfully' }, { status: 200 });
    }

    logMessage('error', 'Admin restore failed');
    return NextResponse.json({ status: false, error: 'Admin restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ Admin restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
