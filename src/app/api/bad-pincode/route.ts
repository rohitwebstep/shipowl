import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { createBadPincode, getBadPincodesByStatus, getBadPincodeByPincode } from '@/app/models/badPincode';

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for badPincode creation');

    const adminIdHeader = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');
    const adminId = Number(adminIdHeader);

    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', `Invalid adminIdHeader: ${adminIdHeader}`);
      return NextResponse.json({ error: 'User ID is missing or invalid in request' }, { status: 400 });
    }

    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`);
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const requiredFields = ['pincode'];
    const formData = await req.formData();
    const validation = validateFormData(formData, {
      requiredFields: requiredFields,
      patternValidations: { status: 'boolean' },
    });

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json({ status: false, error: validation.error, message: validation.message }, { status: 400 });
    }

    const extractString = (key: string) => (formData.get(key) as string) || null;

    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

    const pincode = extractString('pincode');

    const getBadPincodeByPincodeResult = await getBadPincodeByPincode(pincode || '');

    if (!getBadPincodeByPincodeResult?.status) {
      logMessage('warn', 'BadPincode already exists:', getBadPincodeByPincodeResult?.message || 'Unknown error');
      return NextResponse.json(
        { status: false, error: getBadPincodeByPincodeResult?.message || 'BadPincode already exists' },
        { status: 400 }
      );
    }

    const badPincodePayload = {
      pincode: pincode || '',
      status,
      createdBy: adminId,
      createdByRole: adminRole || '',
    };

    logMessage('info', 'BadPincode payload created:', badPincodePayload);

    const badPincodeCreateResult = await createBadPincode(adminId, String(adminRole), badPincodePayload);

    if (badPincodeCreateResult?.status) {
      return NextResponse.json({ status: true, badPincode: badPincodeCreateResult.badPincode }, { status: 200 });
    }

    logMessage('error', 'BadPincode creation failed:', badPincodeCreateResult?.message || 'Unknown error');
    return NextResponse.json(
      { status: false, error: badPincodeCreateResult?.message || 'BadPincode creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'BadPincode Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {

    // Retrieve admin details from request headers
    const adminIdHeader = req.headers.get('x-admin-id');
    const adminRole = req.headers.get('x-admin-role');

    // Log admin info
    logMessage('info', 'Admin details received', { adminIdHeader, adminRole });

    // Validate adminId
    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', 'Invalid admin ID received', { adminIdHeader });
      return NextResponse.json(
        { status: false, error: 'Invalid or missing admin ID' },
        { status: 400 }
      );
    }

    // Check if the admin exists
    const userExistence = await isUserExist(adminId, String(adminRole));
    if (!userExistence.status) {
      logMessage('warn', 'Admin user not found', { adminId, adminRole });
      return NextResponse.json(
        { status: false, error: `User Not Found: ${userExistence.message}` },
        { status: 404 }
      );
    }

    // Fetch badPincodes based on filters
    const badPincodesResult = await getBadPincodesByStatus('notDeleted');

    // Handle response based on badPincodes result
    if (badPincodesResult?.status) {
      return NextResponse.json(
        { status: true, badPincodes: badPincodesResult.badPincodes },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: false, error: 'No badPincodes found' },
      { status: 404 }
    );
  } catch (error) {
    // Log and handle any unexpected errors
    logMessage('error', 'Error while fetching badPincodes', { error });
    return NextResponse.json(
      { status: false, error: 'Failed to fetch badPincodes due to an internal error' },
      { status: 500 }
    );
  }
}
