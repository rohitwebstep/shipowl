import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/auth/authUtils";
import { saveFilesFromFormData, deleteFile } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { isLocationHierarchyCorrect } from '@/app/models/location/city';
import { checkEmailAvailabilityForUpdate, checkUsernameAvailabilityForUpdate, updateSupplier } from '@/app/models/supplier/supplier';
import { updateSupplierCompany } from '@/app/models/supplier/company';
import { updateSupplierBankAccount } from '@/app/models/supplier/bankAccount';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

interface BankAccount {
  id?: number;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  bankBranch: string;
  accountType: string;
  ifscCode: string;
  cancelledChequeImage: string;
}

export async function PUT(req: NextRequest) {

  try {
    logMessage('debug', 'POST request received for supplier creation');


    const supplierIdHeader = req.headers.get('x-supplier-id');
    const supplierRole = req.headers.get('x-supplier-role');
    const supplierId = Number(supplierIdHeader);

    if (!supplierIdHeader || isNaN(supplierId)) {
      logMessage('warn', `Invalid supplierIdHeader: ${supplierIdHeader}`);
      return NextResponse.json({ error: 'User ID is missing or invalid in request' }, { status: 400 });
    }

    const userCheck = await isUserExist(supplierId, String(supplierRole));
    if (!userCheck.status) {
      logMessage('warn', `User not found: ${userCheck.message}`);
      return NextResponse.json({ error: `User Not Found: ${userCheck.message}` }, { status: 404 });
    }

    const requiredFields = ['name', 'username', 'email'];
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
    const extractDate = (key: string, outputFormat: string): string | null => {
      const value = extractString(key);
      if (!value) return null;

      // Define regular expressions for different date formats
      const regexPatterns = [
        { format: 'DD-MM-YYYY', regex: /^(\d{2})-(\d{2})-(\d{4})$/ },
        { format: 'YYYY-MM-DD', regex: /^(\d{4})-(\d{2})-(\d{2})$/ },
        { format: 'DD/MM/YYYY', regex: /^(\d{2})\/(\d{2})\/(\d{4})$/ },
        { format: 'YYYY/MM/DD', regex: /^(\d{4})\/(\d{2})\/(\d{2})$/ }
      ];

      let parsedDate: Date | null = null;

      // Try to match the input value to the known formats
      for (const { format, regex } of regexPatterns) {
        const match = value.match(regex);
        if (match) {
          const [, day, month, year] = match;
          // Convert matched values into a Date object
          parsedDate = new Date(`${year}-${month}-${day}`);
          logMessage('info', `✅ Parsed date from "${value}" using format "${format}"`);
          break;
        }
      }

      // If no valid date was parsed, return null
      if (!parsedDate) {
        logMessage('warn', `Failed to parse date for "${value}"`);
        return null;
      }

      // Helper function to format the date in a specific output format
      const formatDate = (date: Date, format: string): string => {
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        };

        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

        switch (format) {
          case 'DD-MM-YYYY':
            return formattedDate.replace(/\//g, '-');
          case 'YYYY-MM-DD':
            return formattedDate.split('/').reverse().join('-');
          default:
            return formattedDate;
        }
      };

      // Return the formatted date in the desired output format
      return formatDate(parsedDate, outputFormat);
    };

    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

    const email = extractString('email') || '';
    const { status: checkEmailAvailabilityResult, message: checkEmailAvailabilityMessage } = await checkEmailAvailabilityForUpdate(email, supplierId);

    if (!checkEmailAvailabilityResult) {
      logMessage('warn', `Email availability check failed: ${checkEmailAvailabilityMessage}`);
      return NextResponse.json({ status: false, error: checkEmailAvailabilityMessage }, { status: 400 });
    }

    const username = extractString('username') || '';
    const { status: checkUsernameAvailabilityResult, message: checkUsernameAvailabilityMessage } = await checkUsernameAvailabilityForUpdate(username, supplierId);

    if (!checkUsernameAvailabilityResult) {
      logMessage('warn', `Username availability check failed: ${checkUsernameAvailabilityMessage}`);
      return NextResponse.json({ status: false, error: checkUsernameAvailabilityMessage }, { status: 400 });
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

    const rawBankAccounts = extractJSON('bankAccounts');

    console.log(`rawBankAccounts`, rawBankAccounts);
    if (!Array.isArray(rawBankAccounts) || rawBankAccounts.length === 0) {
      logMessage('warn', 'Variants are not valid or empty');
      return NextResponse.json({ status: false, error: 'Variants are not valid or empty' }, { status: 400 });
    }
    const bankAccounts: BankAccount[] = Array.isArray(rawBankAccounts) ? rawBankAccounts as BankAccount[] : [];

    const supplierUploadDir = path.join(process.cwd(), 'public', 'uploads', 'supplier');
    const supplierFileFields = [
      'profilePicture'
    ];

    const supplierUploadedFiles: Record<string, string> = {};
    for (const field of supplierFileFields) {
      const fileData = await saveFilesFromFormData(formData, field, {
        dir: supplierUploadDir,
        pattern: 'slug-unique',
        multiple: true,
      });

      if (fileData) {
        logMessage('info', 'uploaded fileData:', fileData);
        if (Array.isArray(fileData)) {
          supplierUploadedFiles[field] = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
        } else {
          supplierUploadedFiles[field] = (fileData as UploadedFileInfo).url;
        }
      }
    }

    const supplierPayload = {
      name: extractString('name') || '',
      profilePicture: supplierUploadedFiles['profilePicture'],
      username,
      email,
      password: '',
      dateOfBirth: extractDate('dateOfBirth', 'YYYY-MM-DD') || '',
      currentAddress: extractString('currentAddress') || '',
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
      updatedAt: new Date(),
      updatedBy: supplierId,
      updatedByRole: supplierRole,
    };

    logMessage('info', 'Supplier payload updated:', supplierPayload);

    const supplierCreateResult = await updateSupplier(supplierId, String(supplierRole), supplierId, supplierPayload);

    if (!supplierCreateResult || !supplierCreateResult.status || !supplierCreateResult.supplier) {
      // Check if there are any uploaded files before attempting to delete
      if (Object.keys(supplierUploadedFiles).length > 0) {
        // Iterate over each field in supplierUploadedFiles
        for (const field in supplierUploadedFiles) {
          // Split the comma-separated URLs into an array of individual file URLs
          const fileUrls = supplierUploadedFiles[field].split(',').map((url) => url.trim());

          // Iterate over each file URL in the array
          for (const fileUrl of fileUrls) {
            if (fileUrl) {  // Check if the file URL is valid
              const filePath = path.join(supplierUploadDir, path.basename(fileUrl));

              // Attempt to delete the file
              await deleteFile(filePath);
              logMessage('info', `Deleted file: ${filePath}`);
            }
          }
        }
      } else {
        logMessage('info', 'No uploaded files to delete.');
      }
      logMessage('error', 'Supplier creation failed:', supplierCreateResult?.message || 'Unknown error');
      return NextResponse.json({ status: false, error: supplierCreateResult?.message || 'Supplier creation failed' }, { status: 500 });
    }

    const companyUploadDir = path.join(process.cwd(), 'public', 'uploads', 'supplier', `${supplierId}`, 'company');
    const supplierCompanyFileFields = [
      'gstDocument',
      'panCardImage',
      'aadharCardImage',
      'additionalDocumentUpload',
      'documentImage'
    ];

    const supplierCompanyUploadedFiles: Record<string, string> = {};
    for (const field of supplierCompanyFileFields) {
      const fileData = await saveFilesFromFormData(formData, field, {
        dir: companyUploadDir,
        pattern: 'slug-unique',
        multiple: true,
      });

      if (fileData) {
        logMessage('info', 'uploaded fileData:', fileData);
        if (Array.isArray(fileData)) {
          supplierCompanyUploadedFiles[field] = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
        } else {
          supplierCompanyUploadedFiles[field] = (fileData as UploadedFileInfo).url;
        }
      }
    }

    const supplierCompanyPayload = {
      admin: { connect: { id: supplierId } },
      companyName: extractString('companyName') || '',
      brandName: extractString('brandName') || '',
      brandShortName: extractString('brandShortName') || '',
      billingAddress: extractString('billingAddress') || '',
      billingPincode: extractString('billingPincode') || '',
      billingState: extractString('billingState') || '',
      billingCity: extractString('billingCity') || '',
      businessType: extractString('businessType') || '',
      clientEntryType: extractString('clientEntryType') || '',
      gstNumber: extractString('gstNumber') || '',
      companyPanNumber: extractString('companyPanNumber') || '',
      aadharNumber: extractString('aadharNumber') || '',
      gstDocument: supplierCompanyUploadedFiles['gstDocument'],
      panCardHolderName: extractString('panCardHolderName') || '',
      aadharCardHolderName: extractString('aadharCardHolderName') || '',
      panCardImage: supplierCompanyUploadedFiles['panCardImage'],
      aadharCardImage: supplierCompanyUploadedFiles['aadharCardImage'],
      additionalDocumentUpload: supplierCompanyUploadedFiles['additionalDocumentUpload'] || '',
      documentId: extractString('gstNumber') || '',
      documentName: extractString('companyPanNumber') || '',
      documentImage: supplierCompanyUploadedFiles['documentImage'],
      updatedAt: new Date(),
      updatedBy: supplierId,
      updatedByRole: supplierRole,
    };

    logMessage('info', 'Supplier payload updated:', supplierCompanyPayload);

    const supplierCompanyCreateResult = await updateSupplierCompany(supplierId, String(supplierRole), supplierId, supplierCompanyPayload);
    if (!supplierCompanyCreateResult || !supplierCompanyCreateResult.status || !supplierCompanyCreateResult.supplier) {

      // Check if there are any uploaded files before attempting to delete
      if (Object.keys(supplierCompanyUploadedFiles).length > 0) {
        // Iterate over each field in supplierCompanyUploadedFiles
        for (const field in supplierCompanyUploadedFiles) {
          // Split the comma-separated URLs into an array of individual file URLs
          const fileUrls = supplierCompanyUploadedFiles[field].split(',').map((url) => url.trim());

          // Iterate over each file URL in the array
          for (const fileUrl of fileUrls) {
            if (fileUrl) {  // Check if the file URL is valid
              const filePath = path.join(companyUploadDir, path.basename(fileUrl));

              // Attempt to delete the file
              await deleteFile(filePath);
              logMessage('info', `Deleted file: ${filePath}`);
            }
          }
        }
      } else {
        logMessage('info', 'No uploaded files to delete.');
      }

      logMessage('error', 'Supplier company creation failed', supplierCompanyCreateResult?.message);
      return NextResponse.json({ status: false, error: supplierCompanyCreateResult?.message || 'Supplier company creation failed' }, { status: 500 });
    }


    logMessage('debug', 'Supplier\'s bank accounts:', bankAccounts);

    const supplierBankAccountPayload = {
      admin: { connect: { id: supplierId } },
      bankAccounts,
      updatedAt: new Date(),
      updatedBy: supplierId,
      updatedByRole: supplierRole,
      createdAt: new Date(),
      createdBy: supplierId,
      createdByRole: supplierRole,
    }

    const bankAccountUploadDir = path.join(process.cwd(), 'public', 'uploads', 'supplier', `${supplierId}`, 'bank-aacount');
    const supplierBankAccountUploadedFiles: Record<string, string> = {};
    if (Array.isArray(supplierBankAccountPayload.bankAccounts) && supplierBankAccountPayload.bankAccounts.length > 0) {
      for (let index = 0; index < supplierBankAccountPayload.bankAccounts.length; index++) {
        console.log(`🔁 Index: ${index}`);
        const cancelledChequeImageIndex = `cancelledChequeImage${index}`;

        // File upload
        const fileData = await saveFilesFromFormData(formData, cancelledChequeImageIndex, {
          dir: bankAccountUploadDir,
          pattern: 'slug-unique',
          multiple: true,
        });

        let image = '';

        if (fileData) {
          logMessage('info', 'uploaded fileData:', fileData);

          if (Array.isArray(fileData)) {
            supplierBankAccountUploadedFiles[cancelledChequeImageIndex] = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
            image = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
          } else {
            supplierBankAccountUploadedFiles[cancelledChequeImageIndex] = (fileData as UploadedFileInfo).url;
            image = (fileData as UploadedFileInfo).url;
          }
        }

        supplierBankAccountPayload.bankAccounts[index].cancelledChequeImage = image;
      }
    }

    const supplierBankAccountCreateResult = await updateSupplierBankAccount(supplierId, String(supplierRole), supplierId, supplierBankAccountPayload);
    if (
      !supplierBankAccountCreateResult ||
      !supplierBankAccountCreateResult.status ||
      !supplierBankAccountCreateResult.bankAccounts
    ) {
      // Check if there are any uploaded files before attempting to delete
      if (Object.keys(supplierBankAccountUploadedFiles).length > 0) {
        // Iterate over each field in supplierBankAccountUploadedFiles
        for (const field in supplierBankAccountUploadedFiles) {
          // Split the comma-separated URLs into an array of individual file URLs
          const fileUrls = supplierBankAccountUploadedFiles[field].split(',').map((url) => url.trim());

          // Iterate over each file URL in the array
          for (const fileUrl of fileUrls) {
            if (fileUrl) {  // Check if the file URL is valid
              const filePath = path.join(companyUploadDir, path.basename(fileUrl));

              // Attempt to delete the file
              await deleteFile(filePath);
              logMessage('info', `Deleted file: ${filePath}`);
            }
          }
        }
      } else {
        logMessage('info', 'No uploaded files to delete.');
      }
      logMessage('error', 'Supplier company creation failed', supplierBankAccountCreateResult?.message);
      return NextResponse.json({
        status: false,
        error: supplierBankAccountCreateResult?.message || 'Supplier company creation failed'
      }, { status: 500 });
    }

    return NextResponse.json(
      { status: true, error: supplierCreateResult?.message || 'Supplier updated Successfuly' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Supplier Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }

}
