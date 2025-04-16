import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getCountryById, deleteCountry } from '@/app/models/location/country';

export async function DELETE(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const countryId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete Country Request:', { countryId });

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

    // Validate country ID
    const countryIdNum = Number(countryId);
    if (isNaN(countryIdNum)) {
      logMessage('warn', 'Invalid country ID format', { countryId });
      return NextResponse.json({ error: 'Country ID is invalid' }, { status: 400 });
    }

    const countryResult = await getCountryById(countryIdNum);
    if (!countryResult?.status) {
      logMessage('warn', 'Country not found', { countryIdNum });
      return NextResponse.json({ status: false, message: 'Country not found' }, { status: 404 });
    }

    // Permanent delete operation
    const result = await deleteCountry(countryIdNum);  // Assuming deleteCountry is for permanent deletion
    logMessage('info', `Permanent delete request for country: ${countryIdNum}`, { adminId });


    if (result?.status) {
      logMessage('info', `Country permanently deleted successfully: ${countryIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `Country permanently deleted successfully` }, { status: 200 });
    }

    logMessage('info', `Country not found or could not be deleted: ${countryIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'Country not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during country deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

