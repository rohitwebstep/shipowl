import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getHighRtosByStatus } from '@/app/models/highRto';


export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching highRtos');

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

    // Fetch all highRtos
    const highRtosResult = await getHighRtosByStatus("deleted");

    if (highRtosResult?.status) {
      return NextResponse.json(
        { status: true, highRtos: highRtosResult.highRtos },
        { status: 200 }
      );
    }

    logMessage('warn', 'No highRtos found');
    return NextResponse.json(
      { status: false, error: "No highRtos found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching highRtos:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch highRtos" },
      { status: 500 }
    );
  }
}

