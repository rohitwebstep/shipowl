import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { saveFilesFromFormData, deleteFile } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { checkMainSKUAvailability, checkVariantSKUsAvailability, createProduct } from '@/app/models/product';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

export async function POST(req: NextRequest) {
  try {
    logMessage('debug', 'POST request received for product creation');

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

    const requiredFields = ['name', 'category', 'main_sku', 'brand', 'origin_country', 'shipping_country'];
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
    const extractJSON = (key: string): any | null => {
      const value = extractString(key);

      let parsedData;
      if (typeof value === 'string') {
        try {
          parsedData = JSON.parse(value);
          logMessage('info', "✅ Parsed value: 1", parsedData);
          return parsedData;
        } catch (error) {
          logMessage('warn', 'Failed to parse JSON value:', error);
        }

        try {
          parsedData = JSON.parse(value);
          logMessage('info', "✅ Parsed value: 2", parsedData);
          return parsedData;
        } catch (error) {
          logMessage('warn', 'Failed to parse JSON value:', error);
          return null;
        }
      }

      if (typeof value === 'object' && value !== null) {
        logMessage('info', "✅ Parsed value: 3", value);
        return value;
      }

      return null;
    };

    const statusRaw = formData.get('status')?.toString().toLowerCase();
    const status = ['true', '1', 1, true].includes(statusRaw as string | number | boolean);

    const main_sku = extractString('main_sku') || '';
    const { status: checkMainSKUAvailabilityResult, message: checkMainSKUAvailabilityMessage } = await checkMainSKUAvailability(main_sku);

    if (!checkMainSKUAvailabilityResult) {
      logMessage('warn', `SKU availability check failed: ${checkMainSKUAvailabilityMessage}`);
      return NextResponse.json({ status: false, error: checkMainSKUAvailabilityMessage }, { status: 400 });
    }

    const variants = extractJSON('variants');
    if (!Array.isArray(variants) || variants.length === 0) {
      logMessage('warn', 'Variants are not valid or empty');
      return NextResponse.json({ status: false, error: 'Variants are not valid or empty' }, { status: 400 });
    }

    const allUniqeSkus = new Set(variants.map((variant: any) => variant.sku));
    if (allUniqeSkus.size !== variants.length) {
      logMessage('warn', 'Duplicate SKUs found in variants');
      return NextResponse.json({ status: false, error: 'Duplicate SKUs found in variants' }, { status: 400 });
    }

    const { status: checkVariantSKUsAvailabilityResult, message: checkVariantSKUsAvailabilityMessage } = await checkVariantSKUsAvailability(Array.from(allUniqeSkus));

    if (!checkVariantSKUsAvailabilityResult) {
      logMessage('warn', `Variant SKU availability check failed: ${checkVariantSKUsAvailabilityMessage}`);
      return NextResponse.json({ status: false, error: checkVariantSKUsAvailabilityMessage }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'product');
    const fileFields = [
      'video',
      'package_weight_image',
      'package_length_image',
      'package_width_image',
      'package_height_image',
      'product_detail_video',
    ];

    const uploadedFiles: Record<string, string> = {};
    for (const field of fileFields) {
      const fileData = await saveFilesFromFormData(formData, field, {
        dir: uploadDir,
        pattern: 'slug-unique',
        multiple: true,
      });


      if (fileData) {
        logMessage('info', 'uploaded fileData:', fileData);
        if (Array.isArray(fileData)) {
          uploadedFiles[field] = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
        } else {
          uploadedFiles[field] = (fileData as UploadedFileInfo).url;
        }
      }
    }

    logMessage('info', 'Uploaded files:', uploadedFiles);
    const productPayload = {
      name: extractString('name') || '',
      categoryId: extractNumber('category') || 0,
      main_sku,
      description: extractString('description'),
      tags: extractJSON('tags'),
      brandId: extractNumber('brand') || 0,
      originCountryId: extractNumber('origin_country') || 0,
      shippingCountryId: extractNumber('shipping_country') || 0,
      list_as: extractString('list_as'),
      shipping_time: extractString('shipping_time'),
      weight: extractNumber('weight'),
      package_length: extractNumber('package_length'),
      package_width: extractNumber('package_width'),
      package_height: extractNumber('package_height'),
      chargeable_weight: extractNumber('chargeable_weight'),
      variants: extractJSON('variants'),
      product_detail_video: uploadedFiles['product_detail_video'],
      status,
      package_weight_image: uploadedFiles['package_weight_image'],
      package_length_image: uploadedFiles['package_length_image'],
      package_width_image: uploadedFiles['package_width_image'],
      package_height_image: uploadedFiles['package_height_image'],
      video_url: uploadedFiles['video'],
      createdBy: adminId,
      createdByRole: adminRole,
    };

    for (let index = 0; index < productPayload.variants.length; index++) {
      const variant = productPayload.variants[index];
      console.log(`🔁 Index: ${index}`);
      const variantImagesIndex = `variant_images_${index}`;

      // File upload
      const fileData = await saveFilesFromFormData(formData, variantImagesIndex, {
        dir: uploadDir,
        pattern: 'slug-unique',
        multiple: true,
      });

      let image = '';

      if (fileData) {
        logMessage('info', 'uploaded fileData:', fileData);

        if (Array.isArray(fileData)) {
          image = fileData.map((file: UploadedFileInfo) => file.url).join(', ');
        } else {
          image = (fileData as UploadedFileInfo).url;
        }
      }

      productPayload.variants[index].images = image;
    }

    logMessage('info', 'Product payload created:', productPayload);

    const productCreateResult = await createProduct(adminId, String(adminRole), productPayload);

    if (productCreateResult?.status) {
      return NextResponse.json({ status: true, product: productCreateResult.product }, { status: 200 });
    }

    for (const fileUrl of Object.values(uploadedFiles)) {
      await deleteFile(path.join(uploadDir, path.basename(fileUrl)));
    }

    logMessage('error', 'Product creation failed:', productCreateResult?.message || 'Unknown error');
    return NextResponse.json(
      { status: false, error: productCreateResult?.message || 'Product creation failed' },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Internal Server Error';
    logMessage('error', 'Product Creation Error:', error);
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
}