import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getPaymentsByStatus } from '@/app/models/payment';


export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching payments');

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

    // Fetch all payments
    const paymentsResult = await getPaymentsByStatus("deleted");

    if (paymentsResult?.status) {
      return NextResponse.json(
        { status: true, payments: paymentsResult.payments },
        { status: 200 }
      );
    }

    logMessage('warn', 'No payments found');
    return NextResponse.json(
      { status: false, error: "No payments found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching payments:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

