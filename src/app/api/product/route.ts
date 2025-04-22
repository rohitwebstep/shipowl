import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from "@/utils/commonUtils";
import { isUserExist } from "@/utils/authUtils";
import { saveFilesFromFormData, deleteFile } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';
import { getBrandById } from '@/app/models/brand';
import { getCategoryById } from '@/app/models/category';
import { getCountryById } from '@/app/models/location/country'
import { checkMainSKUAvailability, checkVariantSKUsAvailability, createProduct, getProductsByStatus } from '@/app/models/product';

type UploadedFileInfo = {
  originalName: string;
  savedAs: string;
  size: number;
  type: string;
  url: string;
};

interface Variant {
  id?: number; // Assuming you have an ID for the variant
  color: string;
  sku: string;
  qty: number;
  currency: string;
  article_id: string;
  suggested_price: number;
  shipowl_price: number;
  rto_suggested_price: number;
  rto_price: number;
  images: string;
}

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
    const extractJSON = (key: string): Record<string, unknown> | null => {

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

    const rawVariants = extractJSON('variants');

    console.log(`rawVariants`, rawVariants);
    if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
      logMessage('warn', 'Variants are not valid or empty');
      return NextResponse.json({ status: false, error: 'Variants are not valid or empty' }, { status: 400 });
    }
    const variants: Variant[] = Array.isArray(rawVariants) ? rawVariants as Variant[] : [];

    const allUniqeSkus = new Set(variants.map((variant: { sku: string }) => variant.sku)); // Typed the variant as an object with a sku
    if (allUniqeSkus.size !== variants.length) {
      logMessage('warn', 'Duplicate SKUs found in variants');
      return NextResponse.json({ status: false, error: 'Duplicate SKUs found in variants' }, { status: 400 });
    }

    const { status: checkVariantSKUsAvailabilityResult, message: checkVariantSKUsAvailabilityMessage } = await checkVariantSKUsAvailability(Array.from(allUniqeSkus));

    if (!checkVariantSKUsAvailabilityResult) {
      logMessage('warn', `Variant SKU availability check failed: ${checkVariantSKUsAvailabilityMessage}`);
      return NextResponse.json({ status: false, error: checkVariantSKUsAvailabilityMessage }, { status: 400 });
    }

    const brandId = extractNumber('brand') || 0;
    const brandResult = await getBrandById(brandId);
    if (!brandResult?.status) {
      logMessage('info', 'Brand found:', brandResult.brand);
      return NextResponse.json({ status: false, message: brandResult.message || 'Brand not found' }, { status: 404 });
    }

    const categoryId = extractNumber('category') || 0;
    const categoryResult = await getCategoryById(categoryId);
    if (!categoryResult?.status) {
      logMessage('info', 'Category found:', categoryResult.category);
      return NextResponse.json({ status: false, message: categoryResult.message || 'Category not found' }, { status: 404 });
    }

    const originCountryId = extractNumber('origin_country') || 0;
    const originCountryResult = await getCountryById(originCountryId);
    if (!originCountryResult?.status) {
      logMessage('info', 'Country found:', originCountryResult.country);
      return NextResponse.json({ status: false, message: 'Origin Country not found' }, { status: 404 });
    }

    const shippingCountryId = extractNumber('shipping_country') || 0;
    const shippingCountryResult = await getCountryById(shippingCountryId);
    if (!shippingCountryResult?.status) {
      logMessage('info', 'Country found:', shippingCountryResult.country);
      return NextResponse.json({ status: false, message: 'Shipping Country not found' }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'product');
    const fileFields = [
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
      categoryId,
      main_sku,
      ean: extractString('ean') || '',
      hsnCode: extractString('hsn_ode') || '',
      taxRate: extractNumber('tax_rate') || 0,
      upc: extractString('upc') || '',
      rtoAddress: extractString('rto_address') || '',
      pickupAddress: extractString('pickup_address') || '',
      description: extractString('description'),
      tags: extractString('tags') || '',
      brandId: extractNumber('brand') || 0,
      originCountryId,
      shippingCountryId,
      list_as: extractString('list_as'),
      shipping_time: extractString('shipping_time'),
      weight: extractNumber('weight'),
      package_length: extractNumber('package_length'),
      package_width: extractNumber('package_width'),
      package_height: extractNumber('package_height'),
      chargeable_weight: extractNumber('chargeable_weight'),
      variants,
      product_detail_video: uploadedFiles['product_detail_video'],
      status,
      package_weight_image: uploadedFiles['package_weight_image'],
      package_length_image: uploadedFiles['package_length_image'],
      package_width_image: uploadedFiles['package_width_image'],
      package_height_image: uploadedFiles['package_height_image'],
      video_url: extractString('video_url'),
      createdBy: adminId,
      createdByRole: adminRole,
    };

    if (Array.isArray(productPayload.variants) && productPayload.variants.length > 0) {
      for (let index = 0; index < productPayload.variants.length; index++) {
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

export async function GET(req: NextRequest) {
  try {
    logMessage('debug', 'GET request received for fetching products');

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

    // Fetch all products
    const productsResult = await getProductsByStatus("notDeleted");

    if (productsResult?.status) {
      return NextResponse.json(
        { status: true, products: productsResult.products },
        { status: 200 }
      );
    }

    logMessage('warn', 'No products found');
    return NextResponse.json(
      { status: false, error: "No products found" },
      { status: 404 }
    );
  } catch (error) {
    logMessage('error', 'Error fetching products:', error);
    return NextResponse.json(
      { status: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}