import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getHighRtoById, restoreHighRto } from '@/app/models/highRto';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const highRtoId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete HighRto Request:', { highRtoId });

    // Get headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', 'Invalid or missing admin ID header', { adminIdHeader, adminRole });
      return NextResponse.json(
        { error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`, { adminId, adminRole });
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const highRtoIdNum = Number(highRtoId);
    if (isNaN(highRtoIdNum)) {
      logMessage('warn', 'Invalid highRto ID', { highRtoId });
      return NextResponse.json({ error: 'Invalid highRto ID' }, { status: 400 });
    }

    const highRtoResult = await getHighRtoById(highRtoIdNum);
    logMessage('debug', 'HighRto fetch result:', highRtoResult);
    if (!highRtoResult?.status) {
      logMessage('warn', 'HighRto not found', { highRtoIdNum });
      return NextResponse.json({ status: false, message: 'HighRto not found' }, { status: 404 });
    }

    // Restore the highRto (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreHighRto(adminId, String(adminRole), highRtoIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'HighRto restored successfully:', restoreResult.restoredHighRto);
      return NextResponse.json({ status: true, highRto: restoreResult.restoredHighRto }, { status: 200 });
    }

    logMessage('error', 'HighRto restore failed');
    return NextResponse.json({ status: false, error: 'HighRto restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ HighRto restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
