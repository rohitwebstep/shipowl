import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getSuppliersByStatus } from '@/app/models/supplier/supplier';
import { checkStaffPermissionStatus } from '@/app/models/staffPermission';

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching suppliers');

    // Retrieve x-admin-id and x-admin-role from request headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

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

        const isStaff = !['admin', 'dropshipper', 'supplier'].includes(String(adminRole));

    if (isStaff) {
      const options = {
        panel: 'admin',
        module: 'supplier',
        action: 'trash-listing',
      };

      const staffPermissionsResult = await checkStaffPermissionStatus(options, adminId);
      logMessage('info', 'Fetched staff permissions:', staffPermissionsResult);

      if (!staffPermissionsResult.status) {
        return NextResponse.json(
          {
            status: false,
            message: staffPermissionsResult.message || "You do not have permission to perform this action."
          },
          { status: 403 }
        );
      }
    }

    // Fetch all suppliers
    const suppliersResult = await getSuppliersByStatus("deleted");

    if (suppliersResult?.status) {
      return NextResponse.json(
        { status: true, suppliers: suppliersResult.suppliers },
        { status: 200 }
      );
    }

    logMessage('warn', 'No suppliers found');
    return NextResponse.json(
      { status: false, error: "No suppliers found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching suppliers:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

