import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { getCityById, deleteCity } from '@/app/models/location/city';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const cityId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete City Request:', { cityId });

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

    // Validate city ID
    const cityIdNum = Number(cityId);
    if (isNaN(cityIdNum)) {
      logMessage('warn', 'Invalid city ID format', { cityId });
      return NextResponse.json({ error: 'City ID is invalid' }, { status: 400 });
    }

    const cityResult = await getCityById(cityIdNum);
    if (!cityResult?.status) {
      logMessage('warn', 'City not found', { cityIdNum });
      return NextResponse.json({ status: false, message: 'City not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteCity(cityIdNum);  // Assuming deleteCity is for permanent deletion
    logMessage('info', `Permanent delete request for city: ${cityIdNum}`, { adminId });


    if (result?.status) {
      logMessage('info', `City permanently deleted successfully: ${cityIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `City permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `City not found or could not be deleted: ${cityIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'City not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during city deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

