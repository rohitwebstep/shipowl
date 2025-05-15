import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getHighRtoById, deleteHighRto } from '@/app/models/highRto';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const highRtoId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete HighRto Request:', { highRtoId });

    // Extract admin ID and role from headers
    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    // Validate admin ID
    if (!adminId || isNaN(Number(adminId))) {
      logMessage('warn', 'Invalid or missing admin ID', { adminId });
      return NextResponse.json({ error: 'Admin ID is missing or invalid' }, { status: 400 });
    }

    // Check if the admin user exists
    const userCheck = await isUserExist(Number(adminId), String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `Admin not found: ${userCheck.message}`, { adminId, adminRole });
      return NextResponse.json({ error: `Admin not found: ${userCheck.message}` }, { status: 404 });
    }

    // Validate highRto ID
    const highRtoIdNum = Number(highRtoId);
    if (isNaN(highRtoIdNum)) {
      logMessage('warn', 'Invalid highRto ID format', { highRtoId });
      return NextResponse.json({ error: 'HighRto ID is invalid' }, { status: 400 });
    }

    const highRtoResult = await getHighRtoById(highRtoIdNum);
    if (!highRtoResult?.status) {
      logMessage('warn', 'HighRto not found', { highRtoIdNum });
      return NextResponse.json({ status: false, message: 'HighRto not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteHighRto(highRtoIdNum);  // Assuming deleteHighRto is for permanent deletion
    logMessage('info', `Permanent delete request for highRto: ${highRtoIdNum}`, { adminId });


    if (result?.status) {
      logMessage('info', `HighRto permanently deleted successfully: ${highRtoIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `HighRto permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `HighRto not found or could not be deleted: ${highRtoIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'HighRto not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during highRto deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

