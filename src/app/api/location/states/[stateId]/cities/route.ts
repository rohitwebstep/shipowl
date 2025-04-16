import { NextRequest, NextResponse } from 'next/server';
import { logMessage } from "@/utils/commonUtils";
import { getCitiesByStateId } from '@/app/models/city';

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching cities by state ID');

    const parts = req.nextUrl.pathname.split('/');
    const stateId = parts[parts.length - 2];

    logMessage('debug', 'Extracted stateId:', { stateId });

    const citiesResult = await getCitiesByStateId(stateId);
    logMessage('debug', 'Cities fetched successfully:', citiesResult);

    if (citiesResult?.status) {
      return NextResponse.json(
        { status: true, cities: citiesResult.cities },
        { status: 200 }
      );
    }

    logMessage('warn', 'No cities found for the given state ID');
    return NextResponse.json(
      { status: false, error: "No cities found for the specified state" },
      { status: 404 }
    );

  } catch (error) {
    logMessage('error', 'Unexpected error while fetching cities:', error);
    return NextResponse.json(
      { status: false, error: "An error occurred while fetching cities" },
      { status: 500 }
    );
  }
}
