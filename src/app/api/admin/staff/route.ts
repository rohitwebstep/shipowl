import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import bcrypt from 'bcryptjs';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { saveFilesFromFormData, deleteFile } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { isLocationHierarchyCorrect } from '@/app/models/location/city';
import { checkEmailAvailability, createAdminStaff, getAdminStaffsByStatus } from '@/app/models/admin/staff';
import { assignAdminStaffPermission } from '@/app/models/admin/permission';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

interface AdminHasPermission {
  id?: number;
  admin?: {
    connect: { id: number }; // or whatever your relation is
  };
  permission?: {
    connect: { id: number }; // or whatever your relation is
  };
  adminStaffId?: number;
  permissionId?: number;
}

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for admin creation');

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
    const permissions: AdminHasPermission[] = Array.isArray(rawPermissions) ? rawPermissions as AdminHasPermission[] : [];

    const password = extractString('password') || '';
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUploadDir = path.join(process.cwd(), 'public', 'uploads', 'admin');
    const adminFileFields = [
      'profilePicture'
    ];

    const adminUploadedFiles: Record<string, string> = {};
    for (const field of adminFileFields) {
      const fileData = await saveFilesFromFormData(formData, field, {
        dir: adminUploadDir,
        pattern: 'slug-unique',
        multiple: true,
      });

      if (fileData) {
        logMessage('info', 'uploaded fileData:', fileData);
        if (Array.isArray(fileData)) {
          adminUploadedFiles[field] = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
        } else {
          adminUploadedFiles[field] = (fileData as UploadedFileInfo).url;
        }
      }
    }

    const adminPayload = {
      admin: {
        connect: {
          id: adminId,
        },
      },
      name: extractString('name') || '',
      profilePicture: adminUploadedFiles['profilePicture'],
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
      createdBy: adminId,
      createdByRole: adminRole,
    };

    logMessage('info', 'Admin payload created:', adminPayload);

    const adminStaffCreateResult = await createAdminStaff(adminId, String(adminRole), adminPayload);

    if (!adminStaffCreateResult || !adminStaffCreateResult.status || !adminStaffCreateResult.adminStaff) {
      // Check if there are any uploaded files before attempting to delete
      if (Object.keys(adminUploadedFiles).length > 0) {
        // Iterate over each field in adminUploadedFiles
        for (const field in adminUploadedFiles) {
          // Split the comma-separated URLs into an array of individual file URLs
          const fileUrls = adminUploadedFiles[field].split(',').map((url) => url.trim());

          // Iterate over each file URL in the array
          for (const fileUrl of fileUrls) {
            if (fileUrl) {  // Check if the file URL is valid
              const filePath = path.join(adminUploadDir, path.basename(fileUrl));

              // Attempt to delete the file
              await deleteFile(filePath);
              logMessage('info', `Deleted file: ${filePath}`);
            }
          }
        }
      } else {
        logMessage('info', 'No uploaded files to delete.');
      }
      logMessage('error', 'Admin creation failed:', adminStaffCreateResult?.message || 'Unknown error');
      return NextResponse.json({ status: false, error: adminStaffCreateResult?.message || 'Admin creation failed' }, { status: 500 });
    }

    logMessage('debug', 'Admin Staff\'s permissions:', permissions);

    const adminPermissionPayload = {
      adminStaffId: adminStaffCreateResult.adminStaff.id,
      permissions,
      updatedAt: new Date(),
      updatedBy: adminId,
      updatedByRole: adminRole,
    }

    const adminPermissionCreateResult = await assignAdminStaffPermission(adminId, String(adminRole), adminPermissionPayload);
    if (
      !adminPermissionCreateResult ||
      !adminPermissionCreateResult.status ||
      !adminPermissionCreateResult.permissions
    ) {
      logMessage('error', 'Admin company creation failed', adminPermissionCreateResult?.message);
      return NextResponse.json({
        status: false,
        error: adminPermissionCreateResult?.message || 'Admin company creation failed'
      }, { status: 500 });
    }

    return NextResponse.json(
      { status: true, error: adminStaffCreateResult?.message || 'Admin created Successfuly' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Admin Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching admins');

    // Retrieve x-admin-id and x-admin-role from request headers
    const adminIdHeader = req.headers.get("x-admin-id");
    const adminRole = req.headers.get("x-admin-role");

    logMessage('info', 'Admin ID and Role:', { adminIdHeader, adminRole });
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

    // Fetch all admins
    const adminsResult = await getAdminStaffsByStatus("notDeleted");

    if (adminsResult?.status) {
      return NextResponse.json(
        { status: true, admins: adminsResult.adminStaffs },
        { status: 200 }
      );
    }

    logMessage('warn', 'No admins found');
    return NextResponse.json(
      { status: false, error: "No admins found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching admins:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}