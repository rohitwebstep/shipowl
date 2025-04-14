import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { createWarehouse, getWarehousesByStatus } from '@/app/models/warehouse';


export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for warehouse creation');

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
      requiredFields: ['name', 'gst_number', 'contact_name', 'contact_number', 'address_line_1', 'address_line_2', 'city', 'state', 'postal_code'],
      patternValidations: {
        status: 'boolean',
        city: 'number',
        state: 'number',
      },
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
    const gst_number = (formData.get('gst_number') as string) || '';
    const contact_name = (formData.get('contact_name') as string) || '';
    const contact_number = (formData.get('contact_number') as string) || '';
    const address_line_1 = (formData.get('address_line_1') as string) || '';
    const address_line_2 = (formData.get('address_line_2') as string) || '';

    const cityRaw = formData.get('city');
    const stateRaw = formData.get('state');
    // Ensure cityRaw and stateRaw are strings before converting them to BigInt
    const cityId = cityRaw && typeof cityRaw === 'string' ? BigInt(cityRaw) : null;
    const stateId = stateRaw && typeof stateRaw === 'string' ? BigInt(stateRaw) : null;

    const postal_code = (formData.get('postal_code') as string) || '';
    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = ['true', '1', 1, true].includes(statusRaw as string | number | boolean);

    logMessage('debug', 'Extracted fields:', {
      name,
      cityId,
      stateId,
    });

    // Validate required fields
    if (!name || cityId === null || stateId === null) {
      throw new Error("Missing required fields: name, city, or state");
    }

    // Prepare the payload for warehouse creation
    const warehousePayload = {
      name,
      gst_number,
      contact_name,
      contact_number,
      address_line_1,
      address_line_2,
      cityId,
      stateId,
      postal_code,
      status,
      createdAt: new Date(),
      createdBy: adminId,
      createdByRole: adminRole,
    };

    logMessage('info', 'Warehouse payload created:', warehousePayload);

    const warehouseCreateResult = await createWarehouse(adminId, String(adminRole), warehousePayload);

    if (warehouseCreateResult?.status) {
      logMessage('info', 'Warehouse created successfully:', warehouseCreateResult.warehouse);
      return NextResponse.json({ status: true, warehouse: warehouseCreateResult.warehouse }, { status: 200 });
    }

    logMessage('error', 'Warehouse creation failed:', warehouseCreateResult?.message || 'Unknown error');
    return NextResponse.json(
      { status: false, error: warehouseCreateResult?.message || 'Warehouse creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Warehouse Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching warehouses');

    // Retrieve x-admin-id and x-admin-role from request headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    const adminId = Number(adminIdHeader);
    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', `Invalid adminIdHeader: ${adminIdHeader}`);
      return NextResponse.json(
        { status: false, error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const result = await isUserExist(adminId, String(adminRole));
    if (!result.status) {
      logMessage('warn', `User not found: ${result.message}`);
      return NextResponse.json(
        { status: false, error: `User Not Found: ${result.message}` },
        { status: 404 }
      );
    }

    // Fetch all warehouses
    const warehousesResult = await getWarehousesByStatus("notDeleted");

    if (warehousesResult?.status) {
      return NextResponse.json(
        { status: true, warehouses: warehousesResult.warehouses },
        { status: 200 }
      );
    }

    logMessage('warn', 'No warehouses found');
    return NextResponse.json(
      { status: false, error: "No warehouses found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching warehouses:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch warehouses" },
      { status: 500 }
    );
  }
}