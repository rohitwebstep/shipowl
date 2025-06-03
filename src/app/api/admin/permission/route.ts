import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getAllPermissionsByStatus, updateAdminPermissions } from '@/app/models/admin/permission';


export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching admins');

    // Retrieve x-admin-id and x-admin-role from request headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    logMessage('info', 'Admin ID and Role:', { adminIdHeader, adminRole });
    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', `Invalid adminIdHeader: ${adminIdHeader}`);
      return NextResponse.json(
        { status: false, error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const result = await isUserExist(adminId, String(adminRole));
    if (!result.status) {
      logMessage('warn', `User not found: ${result.message}`);
      return NextResponse.json(
        { status: false, error: `User Not Found: ${result.message}` },
        { status: 404 }
      );
    }

    // Fetch all admins
    const adminsResult = await getAllPermissionsByStatus("notDeleted");

    if (adminsResult?.status) {
      return NextResponse.json(
        { status: true, permissions: adminsResult.permissions },
        { status: 200 }
      );
    }

    logMessage('warn', 'No permissions found');
    return NextResponse.json(
      { status: false, error: "No permissions found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching admins:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    logMessage('debug', 'PUT request received for updating admin permissions (FormData)');

    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    logMessage('info', 'Admin ID and Role:', { adminIdHeader, adminRole });

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', `Invalid adminIdHeader: ${adminIdHeader}`);
      return NextResponse.json(
        { status: false, error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Validate admin user
    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`);
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userCheck.message}` },
        { status: 404 }
      );
    }

    // Parse FormData from request
    const formData = await req.formData();
    const permissions: { permissionId: number; status: boolean }[] = [];

    // Extract FormData entries
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^permissions\[(\d+)]\[(permissionId|status)]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        if (!permissions[index]) permissions[index] = { permissionId: 0, status: false };

        if (field === 'permissionId') {
          permissions[index].permissionId = Number(value);
        } else if (field === 'status') {
          permissions[index].status = value === 'true';
        }
      }
    }

    if (permissions.length === 0) {
      logMessage('warn', 'No permissions found in form data');
      return NextResponse.json(
        { status: false, error: 'No permissions provided' },
        { status: 400 }
      );
    }

    const adminPermissionPayload = {
      adminId,
      permissions,
      updatedAt: new Date(),
      updatedBy: adminId,
      updatedByRole: adminRole,
    }

    // Update permissions
    const updateResult = await updateAdminPermissions(adminId, String(adminRole), adminPermissionPayload);

    if (updateResult?.status) {
      return NextResponse.json(
        { status: true, message: 'Permissions updated successfully' },
        { status: 200 }
      );
    }

    logMessage('warn', 'Permission update failed');
    return NextResponse.json(
      { status: false, error: 'Failed to update permissions' },
      { status: 500 }
    );

  } catch (error) {
    logMessage('error', 'Error updating admin permissions:', error);
    return NextResponse.json(
      { status: false, error: 'Internal server error while updating permissions' },
      { status: 500 }
    );
  }
}