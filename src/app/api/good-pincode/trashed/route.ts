import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getGoodPincodesByStatus } from '@/app/models/goodPincode';


export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching goodPincodes');

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

    // Fetch all goodPincodes
    const goodPincodesResult = await getGoodPincodesByStatus("deleted");

    if (goodPincodesResult?.status) {
      return NextResponse.json(
        { status: true, goodPincodes: goodPincodesResult.goodPincodes },
        { status: 200 }
      );
    }

    logMessage('warn', 'No goodPincodes found');
    return NextResponse.json(
      { status: false, error: "No goodPincodes found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching goodPincodes:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch goodPincodes" },
      { status: 500 }
    );
  }
}

