import { NextRequest, NextResponse } from 'next/server';
import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getPermissions, updatePermission } from '@/app/models/admin/supplier/order/permission';

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching permissions');

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

    const result = await isUserExist(adminId, String(adminRole));
    if (!result.status) {
      logMessage('warn', `User not found: ${result.message}`);
      return NextResponse.json(
        { status: false, error: `User Not Found: ${result.message}` },
        { status: 404 }
      );
    }

    const suppliersResult = await getPermissions();
    if (suppliersResult?.status) {
      return NextResponse.json(
        { status: true, permissions: suppliersResult.permissions },
        { status: 200 }
      );
    }

    logMessage('warn', 'No permissions found');
    return NextResponse.json(
      { status: false, error: "No permissions found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching permissions:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for fetching suppliers');

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

    // Parse JSON body to get permissions array
    const body = await req.json();
    const permissions = body.permissions;

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { status: false, error: "Permissions must be an array" },
        { status: 400 }
      );
    }

    // Clean and validate permissions array
    const cleanedPermissions = permissions.map((perm: any) => {
      return {
        permissionId: Number(perm.permissionId),
        status: perm.status === true || perm.status === 'true' || perm.status === 1 || perm.status === '1'
      };
    }).filter((perm: any) => !isNaN(perm.permissionId) && typeof perm.status === 'boolean');

    // Now you have cleanedPermissions with permissionId as number and status as boolean

    logMessage('info', 'Cleaned Permissions:', cleanedPermissions);

    const permissionPayload = {
      adminId,
      adminRole,
      permissions: cleanedPermissions
    };

    logMessage('info', 'Brand payload created:', permissionPayload);

    const updatePermissionResult = await updatePermission(adminId, String(adminRole), permissionPayload);

    if (updatePermissionResult?.status) {
      return NextResponse.json({ status: true }, { status: 200 });
    }

    // Continue your logic with cleanedPermissions...

    return NextResponse.json({ status: true, data: cleanedPermissions });

  } catch (error) {
    logMessage('error', 'Error processing request:', error);
    return NextResponse.json(
      { status: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
