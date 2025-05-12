import { NextRequest, NextResponse } from 'next/server';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { validateFormData } from '@/utils/validateFormData';
import { parseFilesFromFormData } from '@/utils/parseCsvExcel';
import { importGoodPincodes } from '@/app/models/goodPincode';

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for brand creation');

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
      requiredFields: ['goodPincodes'],
      fileExtensionValidations: {
        goodPincodes: ['csv', 'xls', 'xlsx'], // ✅ correct placement and syntax
      },
    });

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json(
        { status: false, error: validation.error, message: validation.message },
        { status: 400 }
      );
    }

    const parsed = await parseFilesFromFormData(formData, 'goodPincodes', {
      returnInArray: false,
      multiple: false,
    });

    if (typeof parsed === 'object' && !Array.isArray(parsed) && 'rows' in parsed) {
      const needHeader = ['pincode'];
      const headersToKeep = new Set(needHeader.map(h => h.toLowerCase()));

      const filtered = (parsed.rows as Record<string, any>[]).map(row => {
        const newRow: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          if (headersToKeep.has(key.toLowerCase())) {
            newRow[key] = value;
          }
        }
        return newRow;
      });

      console.log(filtered);

      // Make sure filtered has the correct structure of { pincode: string }
      const filteredWithPincodes = filtered.map(item => ({
        pincode: String(item.pincode) // Ensuring `pincode` is a string
      }));

      if (!filtered) {
        logMessage('warn', 'File parsing failed');
        return NextResponse.json({ status: false, error: 'File parsing failed' }, { status: 400 });
      }

      const importGoodPincodesResult = await importGoodPincodes(adminId, String(adminRole), filteredWithPincodes);

      if (importGoodPincodesResult?.status) {
        return NextResponse.json({ status: true, message: importGoodPincodesResult?.message }, { status: 200 });
      }

      logMessage('error', 'GoodPincode creation failed:', importGoodPincodesResult?.message || 'Unknown error');
      return NextResponse.json(
        { status: false, error: importGoodPincodesResult?.message || 'GoodPincode creation failed' },
        { status: 500 }
      );
    } else {
      console.warn('Parsed data is not in expected format:', parsed);
      return NextResponse.json({ status: false, error: 'File parsing failed' }, { status: 400 });
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Brand Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}