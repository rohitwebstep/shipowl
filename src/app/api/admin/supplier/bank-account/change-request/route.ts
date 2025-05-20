import { NextRequest, NextResponse } from 'next/server';
import { fetchLogInfo, logMessage } from "@/utils/commonUtils";
import { getAllBankAccountChangeRequests } from '@/app/models/supplier/bankAccount';

export async function GET(req: NextRequest) {
    try {
        logMessage('debug', 'GET request received for bank account change requests');

        const fetchLogInfoResult = await fetchLogInfo('bankAccountChangeRequest', 'view', req);
        logMessage('debug', 'fetchLogInfo result:', fetchLogInfoResult);

        const requestResult = await getAllBankAccountChangeRequests();

        if (requestResult?.status) {
            return NextResponse.json(
                { status: true, requests: requestResult.requests },
                { status: 200 }
            );
        }

        logMessage('warn', 'No bank account change requests found');
        return NextResponse.json(
            { status: false, error: "No bank account change requests found" },
            { status: 404 }
        );
    } catch (error) {
        logMessage('error', 'Error fetching brands:', error);
        return NextResponse.json(
            { status: false, error: "Failed to fetch brands" },
            { status: 500 }
        );
    }
}
