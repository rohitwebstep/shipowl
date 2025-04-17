import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { getStateById } from '@/app/models/location/state';
import { getCitiesByState } from '@/app/models/location/city';

export async function GET(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const stateId = parts[parts.length - 2]; // Get the second-to-last segment

    logMessage('debug', 'Delete State Request:', { stateId });

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

    // Validate state ID
    const stateIdNum = Number(stateId);
    if (isNaN(stateIdNum)) {
      logMessage('warn', 'Invalid state ID format', { stateId });
      return NextResponse.json({ error: 'State ID is invalid' }, { status: 400 });
    }

    const stateResult = await getStateById(stateIdNum);
    if (!stateResult?.status) {
      logMessage('warn', 'State not found', { stateIdNum });
      return NextResponse.json({ status: false, message: 'State not found' }, { status: 404 });
    }

    // Fetch all cities
    const citiesResult = await getCitiesByState(stateIdNum);
    logMessage('info', 'Cities fetched successfully:', citiesResult);
    if (citiesResult?.status) {
      return NextResponse.json(
        { status: true, cities: citiesResult.cities },
        { status: 200 }
      );
    }

    logMessage('warn', 'No cities found');
    return NextResponse.json(
      { status: false, error: "No cities found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', '❌ Error fetching single country:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}
