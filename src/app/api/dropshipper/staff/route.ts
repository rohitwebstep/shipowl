import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import bcrypt from 'bcryptjs';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { saveFilesFromFormData, deleteFile } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { isLocationHierarchyCorrect } from '@/app/models/location/city';
import { checkEmailAvailability, createDropshipperStaff, getDropshipperStaffsByStatus } from '@/app/models/dropshipper/staff';
import { assignDropshipperStaffPermission } from '@/app/models/dropshipper/permission';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

interface DropshipperHasPermission {
  id?: number;
  dropshipper?: {
    connect: { id: number }; // or whatever your relation is
  };
  permission?: {
    connect: { id: number }; // or whatever your relation is
  };
  dropshipperStaffId?: number;
  permissionId?: number;
}

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for dropshipper creation');

    const dropshipperIdHeader = req.headers.get('x-dropshipper-id');
    const dropshipperRole = req.headers.get('x-dropshipper-role');
    const dropshipperId = Number(dropshipperIdHeader);

    if (!dropshipperIdHeader || isNaN(dropshipperId)) {
      logMessage('warn', `Invalid dropshipperIdHeader: ${dropshipperIdHeader}`);
      return NextResponse.json({ error: 'User ID is missing or invalid in request' }, { status: 400 });
    }

    const userCheck = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`);
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const requiredFields = ['name', 'email', 'password'];
    const formData = await req.formData();
    const validation = validateFormData(formData, {
      requiredFields: requiredFields,
      patternValidations: { status: 'boolean' },
    });

    if (!validation.isValid) {
      logMessage('warn', 'Form validation failed', validation.error);
      return NextResponse.json({ status: false, error: validation.error, message: validation.message }, { status: 400 });
    }

    const extractNumber = (key: string) => Number(formData.get(key)) || null;
    const extractString = (key: string) => (formData.get(key) as string) || null;
    const extractJSON = (key: string): Record<string, unknown> | null => {

      const value = extractString(key);
      const cleanedValue = typeof value === 'string' ? value.replace(/[\/\\]/g, '') : value;

      let parsedData;
      if (typeof cleanedValue === 'string') {
        try {
          parsedData = JSON.parse(cleanedValue);
          logMessage('info', "✅ Parsed value: 1", parsedData);
          return parsedData;
        } catch (error) {
          logMessage('warn', 'Failed to parse JSON value:', error);
        }

        try {
          parsedData = JSON.parse(cleanedValue);
          logMessage('info', "✅ Parsed value: 2", parsedData);
          return parsedData;
        } catch (error) {
          logMessage('warn', 'Failed to parse JSON value:', error);
          return null;
        }
      }

      if (typeof cleanedValue === 'object' && cleanedValue !== null) {
        logMessage('info', "✅ Parsed value: 3", cleanedValue);
        return cleanedValue;
      }

      return null;
    };

    const statusRaw = extractString('status')?.toLowerCase();
    const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

    const email = extractString('email') || '';
    const { status: checkEmailAvailabilityResult, message: checkEmailAvailabilityMessage } = await checkEmailAvailability(email);

    if (!checkEmailAvailabilityResult) {
      logMessage('warn', `Email availability check failed: ${checkEmailAvailabilityMessage}`);
      return NextResponse.json({ status: false, error: checkEmailAvailabilityMessage }, { status: 400 });
    }

    const permanentCountryId = extractNumber('permanentCountry') || 0;
    const permanentStateId = extractNumber('permanentState') || 0;
    const permanentCityId = extractNumber('permanentCity') || 0;

    const isLocationHierarchyCorrectResult = await isLocationHierarchyCorrect(permanentCityId, permanentStateId, permanentCountryId);
    logMessage('debug', 'Location hierarchy check result:', isLocationHierarchyCorrectResult);
    if (!isLocationHierarchyCorrectResult.status) {
      logMessage('warn', `Location hierarchy is incorrect: ${isLocationHierarchyCorrectResult.message}`);
      return NextResponse.json(
        { status: false, message: isLocationHierarchyCorrectResult.message || 'Location hierarchy is incorrect' },
        { status: 400 }
      );
    }

    const rawPermissions = extractJSON('permissions');

    if (!Array.isArray(rawPermissions) || rawPermissions.length === 0) {
      logMessage('warn', 'Variants are not valid or empty');
      return NextResponse.json({ status: false, error: 'Variants are not valid or empty' }, { status: 400 });
    }
    const permissions: DropshipperHasPermission[] = Array.isArray(rawPermissions) ? rawPermissions as DropshipperHasPermission[] : [];

    const password = extractString('password') || '';
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    const dropshipperUploadDir = path.join(process.cwd(), 'public', 'uploads', 'dropshipper');
    const dropshipperFileFields = [
      'profilePicture'
    ];

    const dropshipperUploadedFiles: Record<string, string> = {};
    for (const field of dropshipperFileFields) {
      const fileData = await saveFilesFromFormData(formData, field, {
        dir: dropshipperUploadDir,
        pattern: 'slug-unique',
        multiple: true,
      });

      if (fileData) {
        logMessage('info', 'uploaded fileData:', fileData);
        if (Array.isArray(fileData)) {
          dropshipperUploadedFiles[field] = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
        } else {
          dropshipperUploadedFiles[field] = (fileData as UploadedFileInfo).url;
        }
      }
    }

    const dropshipperPayload = {
      admin: {
        connect: {
          id: dropshipperId,
        },
      },
      name: extractString('name') || '',
      profilePicture: dropshipperUploadedFiles['profilePicture'],
      email,
      phoneNumber: extractString('phoneNumber') || '',
      password: hashedPassword,
      permanentAddress: extractString('permanentAddress') || '',
      permanentPostalCode: extractString('permanentPostalCode') || '',
      permanentCity: {
        connect: {
          id: permanentCityId,
        },
      },
      permanentState: {
        connect: {
          id: permanentStateId,
        },
      },
      permanentCountry: {
        connect: {
          id: permanentCountryId,
        },
      },
      status,
      createdAt: new Date(),
      createdBy: dropshipperId,
      createdByRole: dropshipperRole,
    };

    logMessage('info', 'Dropshipper payload created:', dropshipperPayload);

    const dropshipperStaffCreateResult = await createDropshipperStaff(dropshipperId, String(dropshipperRole), dropshipperPayload);

    if (!dropshipperStaffCreateResult || !dropshipperStaffCreateResult.status || !dropshipperStaffCreateResult.dropshipperStaff) {
      // Check if there are any uploaded files before attempting to delete
      if (Object.keys(dropshipperUploadedFiles).length > 0) {
        // Iterate over each field in dropshipperUploadedFiles
        for (const field in dropshipperUploadedFiles) {
          // Split the comma-separated URLs into an array of individual file URLs
          const fileUrls = dropshipperUploadedFiles[field].split(',').map((url) => url.trim());

          // Iterate over each file URL in the array
          for (const fileUrl of fileUrls) {
            if (fileUrl) {  // Check if the file URL is valid
              const filePath = path.join(dropshipperUploadDir, path.basename(fileUrl));

              // Attempt to delete the file
              await deleteFile(filePath);
              logMessage('info', `Deleted file: ${filePath}`);
            }
          }
        }
      } else {
        logMessage('info', 'No uploaded files to delete.');
      }
      logMessage('error', 'Dropshipper creation failed:', dropshipperStaffCreateResult?.message || 'Unknown error');
      return NextResponse.json({ status: false, error: dropshipperStaffCreateResult?.message || 'Dropshipper creation failed' }, { status: 500 });
    }

    logMessage('debug', 'Dropshipper Staff\'s permissions:', permissions);

    const dropshipperPermissionPayload = {
      dropshipperStaffId: dropshipperStaffCreateResult.dropshipperStaff.id,
      permissions,
      updatedAt: new Date(),
      updatedBy: dropshipperId,
      updatedByRole: dropshipperRole,
    }

    const dropshipperPermissionCreateResult = await assignDropshipperStaffPermission(dropshipperId, String(dropshipperRole), dropshipperPermissionPayload);
    if (
      !dropshipperPermissionCreateResult ||
      !dropshipperPermissionCreateResult.status ||
      !dropshipperPermissionCreateResult.permissions
    ) {
      logMessage('error', 'Dropshipper company creation failed', dropshipperPermissionCreateResult?.message);
      return NextResponse.json({
        status: false,
        error: dropshipperPermissionCreateResult?.message || 'Dropshipper company creation failed'
      }, { status: 500 });
    }

    return NextResponse.json(
      { status: true, error: dropshipperStaffCreateResult?.message || 'Dropshipper created Successfuly' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Dropshipper Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching dropshippers');

    // Retrieve x-dropshipper-id and x-dropshipper-role from request headers
    const dropshipperIdHeader = req.headers.get("x-dropshipper-id");
    const dropshipperRole = req.headers.get("x-dropshipper-role");

    logMessage('info', 'Dropshipper ID and Role:', { dropshipperIdHeader, dropshipperRole });
    const dropshipperId = Number(dropshipperIdHeader);
    if (!dropshipperIdHeader || isNaN(dropshipperId)) {
      logMessage('warn', `Invalid dropshipperIdHeader: ${dropshipperIdHeader}`);
      return NextResponse.json(
        { status: false, error: "User ID is missing or invalid in request" },
        { status: 400 }
      );
    }

    // Check if dropshipper exists
    const result = await isUserExist(dropshipperId, String(dropshipperRole));
    if (!result.status) {
      logMessage('warn', `User not found: ${result.message}`);
      return NextResponse.json(
        { status: false, error: `User Not Found: ${result.message}` },
        { status: 404 }
      );
    }

    // Fetch all dropshippers
    const dropshippersResult = await getDropshipperStaffsByStatus("notDeleted");

    if (dropshippersResult?.status) {
      return NextResponse.json(
        { status: true, dropshippers: dropshippersResult.dropshipperStaffs },
        { status: 200 }
      );
    }

    logMessage('warn', 'No dropshippers found');
    return NextResponse.json(
      { status: false, error: "No dropshippers found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching dropshippers:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch dropshippers" },
      { status: 500 }
    );
  }
}