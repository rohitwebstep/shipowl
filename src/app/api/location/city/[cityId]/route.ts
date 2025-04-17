import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { getCityById, updateCity, softDeleteCity, restoreCity } from '@/app/models/location/city';

export async function GET(req: NextRequest) {
  try {
    // Extract cityId directly from the URL path
    const cityId = req.nextUrl.pathname.split('/').pop();

    logMessage('debug', 'Requested City ID:', cityId);

    const adminId = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    if (!adminId || isNaN(Number(adminId))) {
      logMessage('warn', 'Invalid or missing admin ID', { adminId });
      return NextResponse.json({ error: 'Invalid or missing admin ID' }, { status: 400 });
    }

    const userCheck = await isUserExist(Number(adminId), String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`, { adminId, adminRole });
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const cityIdNum = Number(cityId);
    if (isNaN(cityIdNum)) {
      logMessage('warn', 'Invalid city ID', { cityId });
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
    }

    const cityResult = await getCityById(cityIdNum);
    if (cityResult?.status) {
      logMessage('info', 'City found:', cityResult.city);
      return NextResponse.json({ status: true, city: cityResult.city }, { status: 200 });
    }

    logMessage('info', 'City found:', cityResult.city);
    return NextResponse.json({ status: false, message: 'City not found' }, { status: 404 });
  } catch (error) {
    logMessage('error', '❌ Error fetching single city:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Extract cityId directly from the URL path
    const cityId = req.nextUrl.pathname.split('/').pop();
    logMessage('debug', 'Requested City ID:', cityId);

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

    const cityIdNum = Number(cityId);
    if (isNaN(cityIdNum)) {
      logMessage('warn', 'Invalid city ID', { cityId });
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
    }

    const cityResult = await getCityById(cityIdNum);
    logMessage('debug', 'City fetch result:', cityResult);
    if (!cityResult?.status) {
      logMessage('warn', 'City not found', { cityIdNum });
      return NextResponse.json({ status: false, message: 'City not found' }, { status: 404 });
    }

    const formData = await req.formData();

    // Validate input
    const validation = validateFormData(formData, {
      requiredFields: ['name'],
      patternValidations: {},
    });

    logMessage('debug', 'Form validation result:', validation);

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json(
        { status: false, error: validation.error, message: validation.message },
        { status: 400 }
      );
    }

    // Extract fields
    const name = formData.get('name') as string;
    const countryId = Number(formData.get('country'));
    const stateId = Number(formData.get('state'));

    // Prepare the payload for city creation
    const cityPayload = {
      name,
      state: {
        connect: {
          id: stateId,
        },
      },
      country: {
        connect: {
          id: countryId,
        },
      },
      updatedAt: new Date(),
      updatedBy: adminId,
      updatedByRole: adminRole,
    };

    logMessage('info', 'City payload:', cityPayload);

    const cityCreateResult = await updateCity(adminId, String(adminRole), cityIdNum, cityPayload);

    if (cityCreateResult?.status) {
      logMessage('info', 'City updated successfully:', cityCreateResult.city);
      return NextResponse.json({ status: true, message: "City updated successfully", city: cityCreateResult.city }, { status: 200 });
    }

    logMessage('error', 'City update failed', cityCreateResult?.message);
    return NextResponse.json(
      { status: false, error: cityCreateResult?.message || 'City creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', '❌ City Updation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Extract cityId directly from the URL path
    const cityId = req.nextUrl.pathname.split('/').pop();

    logMessage('debug', 'Requested City ID:', cityId);

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

    const cityIdNum = Number(cityId);
    if (isNaN(cityIdNum)) {
      logMessage('warn', 'Invalid city ID', { cityId });
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
    }

    const cityResult = await getCityById(cityIdNum);
    logMessage('debug', 'City fetch result:', cityResult);
    if (!cityResult?.status) {
      logMessage('warn', 'City not found', { cityIdNum });
      return NextResponse.json({ status: false, message: 'City not found' }, { status: 404 });
    }

    // Restore the city (i.e., reset deletedAt, deletedBy, deletedByRole)
    const restoreResult = await restoreCity(adminId, String(adminRole), cityIdNum);

    if (restoreResult?.status) {
      logMessage('info', 'City restored successfully:', restoreResult.city);
      return NextResponse.json({ status: true, city: restoreResult.city }, { status: 200 });
    }

    logMessage('error', 'City restore failed');
    return NextResponse.json({ status: false, error: 'City restore failed' }, { status: 500 });

  } catch (error) {
    logMessage('error', '❌ City restore error:', error);
    return NextResponse.json({ status: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Extract cityId directly from the URL path
    const cityId = req.nextUrl.pathname.split('/').pop();

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

    const result = await softDeleteCity(Number(adminId), String(adminRole), cityIdNum);  // Assuming softDeleteCity marks the city as deleted
    logMessage('info', `Soft delete request for city: ${cityIdNum}`, { adminId });

    if (result?.status) {
      logMessage('info', `City soft deleted successfully: ${cityIdNum}`, { adminId });
      return NextResponse.json({ status: true, message: `City soft deleted successfully` }, { status: 200 });
    }

    logMessage('info', `City not found or could not be deleted: ${cityIdNum}`, { adminId });
    return NextResponse.json({ status: false, message: 'City not found or deletion failed' }, { status: 404 });
  } catch (error) {
    logMessage('error', 'Error during city deletion', { error });
    return NextResponse.json({ status: false, error: 'Internal server error' }, { status: 500 });
  }
}

