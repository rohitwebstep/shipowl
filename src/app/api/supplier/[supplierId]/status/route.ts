import { NextRequest, NextResponse } from 'next/server';
import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import {
  getSupplierById,
  updateSupplierStatus,
} from '@/app/models/supplier/supplier';

export async function PATCH(req: NextRequest) {
  try {
    const parts = req.nextUrl.pathname.split('/');
    const supplierId = parts[parts.length - 2]; // Get the second-to-last segment
    logMessage('debug', 'Requested Supplier ID:', { supplierId });

    // Optional query param: e.g. ?status=active or inactive
    const statusRaw = req.nextUrl.searchParams.get('status');
    logMessage('debug', 'Requested status status:', { statusRaw });

    // Extract headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");
    const adminId = Number(adminIdHeader);

    if (!adminIdHeader || isNaN(adminId)) {
      logMessage('warn', 'Invalid or missing admin ID header', { adminIdHeader, adminRole });
      return NextResponse.json(
        { error: "Admin ID is missing or invalid" },
        { status: 400 }
      );
    }

    // Validate admin user
    const userCheck = await isUserExist(adminId, String(adminRole));
    if (!userCheck.status) {
      logMessage('warn', 'User not found', { adminId, adminRole });
      return NextResponse.json(
        { error: `Admin user not found: ${userCheck.message}` },
        { status: 404 }
      );
    }

    // Validate supplier ID
    const supplierIdNum = Number(supplierId);
    if (isNaN(supplierIdNum)) {
      logMessage('warn', 'Invalid supplier ID', { supplierId });
      return NextResponse.json({ error: 'Invalid supplier ID' }, { status: 400 });
    }

    // Fetch supplier data
    const supplierResult = await getSupplierById(supplierIdNum);
    logMessage('debug', 'Supplier fetch result:', { supplierResult });

    if (!supplierResult?.status) {
      logMessage('warn', 'Supplier not found', { supplierId: supplierIdNum });
      return NextResponse.json(
        { status: false, message: 'Supplier not found' },
        { status: 404 }
      );
    }

    const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

    // Update supplier status
    const updateResult = await updateSupplierStatus(adminId, String(adminRole), supplierIdNum, status);
    logMessage('debug', 'Supplier status update result:', { updateResult });

    if (!updateResult?.status) {
      logMessage('warn', 'Failed to update supplier status', { supplierId: supplierIdNum });
      return NextResponse.json(
        { status: false, message: 'Failed to update supplier status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: true,
      message: `Supplier marked as ${statusRaw}`,
    });

  } catch (error) {
    logMessage('error', '❌ Supplier status update error:', error);
    return NextResponse.json(
      { status: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
