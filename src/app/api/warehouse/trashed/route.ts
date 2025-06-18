import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getWarehousesByStatus } from '@/app/models/warehouse';


export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching warehouses');

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
    const userCheck: UserCheckResult = await isUserExist(adminId, String(adminRole));
    if (!result.status) {
      logMessage('warn', `User not found: ${result.message}`);
      return NextResponse.json(
        { status: false, error: `User Not Found: ${result.message}` },
        { status: 404 }
      );
    }

    // Fetch all warehouses
    const warehousesResult = await getWarehousesByStatus("deleted");

    if (warehousesResult?.status) {
      return NextResponse.json(
        { status: true, warehouses: warehousesResult.warehouses },
        { status: 200 }
      );
    }

    logMessage('warn', 'No warehouses found');
    return NextResponse.json(
      { status: false, error: "No warehouses found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching warehouses:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch warehouses" },
      { status: 500 }
    );
  }
}

