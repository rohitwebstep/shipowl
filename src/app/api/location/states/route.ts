import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { getAllStates } from '@/app/models/state';

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching states');

    // Fetch all states
    const statesResult = await getAllStates();
    logMessage('debug', 'States fetched successfully:', statesResult);
    if (statesResult?.status) {
      return NextResponse.json(
        { status: true, states: statesResult.states },
        { status: 200 }
      );
    }

    logMessage('warn', 'No states found');
    return NextResponse.json(
      { status: false, error: "No states found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching states:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch states" },
      { status: 500 }
    );
  }
}

