import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getBrandsByStatus } from '@/app/models/admin/brand';
import { checkAdminPermission } from '@/utils/auth/checkAdminPermission';

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching brands');

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

    const permissionResult = await checkAdminPermission({
      admin_id: Number(adminId),
      role: String(adminRole),
      panel: "admin",
      module: "category",
      action: "trash-view"
    });

    if (!permissionResult.status) {
      return NextResponse.json(
        {
          status: false,
          message: permissionResult.message || "You do not have permission to perform this action."
        },
        { status: 403 }
      );
    }

    // Fetch all brands
    const brandsResult = await getBrandsByStatus("deleted");

    if (brandsResult?.status) {
      return NextResponse.json(
        { status: true, brands: brandsResult.brands },
        { status: 200 }
      );
    }

    logMessage('warn', 'No brands found');
    return NextResponse.json(
      { status: false, error: "No brands found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching brands:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

