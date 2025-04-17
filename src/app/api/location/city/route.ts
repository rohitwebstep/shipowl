import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { createCity, getCitiesByStatus } from '@/app/models/location/city';
import { isStateInCountry } from '@/app/models/location/state';
import { getCountryById } from '@/app/models/location/country';
import { getStateById } from '@/app/models/location/state';

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for city creation');

    // Get headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', `Invalid adminIdHeader: ${adminIdHeader}`);
      return NextResponse.json(
        { error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`);
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
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

    const countryIdNum = Number(countryId);
    const stateIdNum = Number(stateId);

    if (isNaN(countryIdNum) || isNaN(stateIdNum)) {
      logMessage('warn', 'Invalid country or state ID', { countryId, stateId });
      return NextResponse.json({ error: 'Invalid country or state ID' }, { status: 400 });
    }

    const countryResult = await getCountryById(countryIdNum);
    logMessage('debug', 'Country fetch result:', countryResult);
    if (!countryResult?.status) {
      logMessage('warn', 'Country not found', { countryIdNum });
      return NextResponse.json({ status: false, message: 'Country not found' }, { status: 404 });
    }

    const stateResult = await getStateById(stateIdNum);
    logMessage('debug', 'State fetch result:', stateResult);
    if (!stateResult?.status) {
      logMessage('warn', 'State not found', { stateIdNum });
      return NextResponse.json({ status: false, message: 'State not found' }, { status: 404 });
    }

    const isStateInCountryResult = await isStateInCountry(stateId, countryId);
    if (!isStateInCountryResult.status) {
      logMessage('warn', `State not found in country: ${isStateInCountryResult.message}`);
      return NextResponse.json(
        { status: false, error: isStateInCountryResult.message },
        { status: 400 }
      );
    }

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
      createdAt: new Date(),
      createdBy: adminId,
      createdByRole: adminRole,
    };

    logMessage('info', 'City payload created:', cityPayload);

    const cityCreateResult = await createCity(adminId, String(adminRole), cityPayload);

    if (cityCreateResult?.status) {
      logMessage('info', 'City created successfully:', cityCreateResult.city);
      return NextResponse.json({ status: true, message: "City created successfully", city: cityCreateResult.city }, { status: 200 });
    }

    logMessage('error', 'City creation failed:', cityCreateResult?.message || 'Unknown error');
    return NextResponse.json(
      { status: false, error: cityCreateResult?.message || 'City creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'City Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function GET() {
  try {
    logMessage('debug', 'GET request received for fetching cities');

    // Fetch all cities
    const citiesResult = await getCitiesByStatus("notDeleted");
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
    logMessage('error', 'Error fetching cities:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}