import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getAdminStaffById, deleteAdminStaff } from '@/app/models/admin/staff';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const adminStaffId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete Admin Request:', { adminStaffId });

    // Extract admin ID and role from headers
    const adminIdHeader = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    // Validate admin ID
    if (!adminIdHeader || isNaN(Number(adminIdHeader))) {
      logMessage('warn', 'Invalid or missing admin ID', { adminIdHeader });
      return NextResponse.json({ error: 'Admin ID is missing or invalid' }, { status: 400 });
    }

    // Check if the admin user exists
    const userCheck = await isUserExist(Number(adminIdHeader), String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `Admin not found: ${userCheck.message}`, { adminIdHeader, adminRole });
      return NextResponse.json({ error: `Admin not found: ${userCheck.message}` }, { status: 404 });
    }

    const adminStaffResult = await getAdminStaffById(Number(adminStaffId));
    if (!adminStaffResult?.status) {
      logMessage('warn', 'Admin not found', { adminStaffId });
      return NextResponse.json({ status: false, message: 'Admin not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteAdminStaff(Number(adminStaffId));  // Assuming deleteAdmin is for permanent deletion
    logMessage('info', `Permanent delete request for admin: ${adminStaffId}`, { adminIdHeader });


    if (result?.status) {
      logMessage('info', `Admin permanently deleted successfully: ${adminStaffId}`, { adminIdHeader });
      return NextResponse.json({ status: true, message: `Admin permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `Admin not found or could not be deleted: ${adminStaffId}`, { adminIdHeader });
    return NextResponse.json({ status: false, message: 'Admin not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during admin deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

