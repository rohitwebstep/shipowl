import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { logMessage } from '@/utils/commonUtils';
import { isUserExist } from '@/utils/auth/authUtils';
import { saveFilesFromFormData } from '@/utils/saveFiles';
import { validateFormData } from '@/utils/validateFormData';

export async function POST(req: NextRequest) {
    try {
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

        const urlParams = req.nextUrl.searchParams;
        const status = urlParams.get('status');
        const allowedStatuses = ['received', 'not received', 'wrong item received'];

        if (!status || !allowedStatuses.includes(status.toLowerCase())) {
            logMessage('warn', `Invalid status value: ${status}`);
            return NextResponse.json(
                { error: `Invalid status. Allowed values are: ${allowedStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        // If status is "wrong item received", then formData with media is mandatory
        let finalFiles: Record<string, string[]> = {};
        if (status.toLowerCase() === 'wrong item received') {
            const formData = await req.formData();

            const packingFiles = await saveFilesFromFormData(formData, 'packingGallery', {
                dir: path.join(process.cwd(), 'public', 'uploads', 'returns'),
                pattern: 'slug-unique', // must match the defined type
                multiple: true
            });

            const unboxingFiles = await saveFilesFromFormData(formData, 'unboxingGallery', {
                dir: path.join(process.cwd(), 'public', 'uploads', 'returns'),
                pattern: 'slug-unique',
                multiple: true
            });

            console.log(`packingFiles - `, packingFiles);
            console.log(`unboxingFiles - `, unboxingFiles);

            const isPackingArray = Array.isArray(packingFiles);
            const isUnboxingArray = Array.isArray(unboxingFiles);

            if (!isPackingArray || !isUnboxingArray || !packingFiles.length || !unboxingFiles.length) {
                return NextResponse.json(
                    {
                        error: 'Missing required media files',
                        message: 'Both packingGallery and unboxingGallery are required when status is "wrong item received".',
                    },
                    { status: 400 }
                );
            }

            finalFiles = {
                packingGallery: packingFiles.map((file: any) => file.url),
                unboxingGallery: unboxingFiles.map((file: any) => file.url),
            };

            logMessage('info', 'Uploaded Media Files:', finalFiles);
        }

        return NextResponse.json(
            {
                status: true,
                updatedStatus: status,
                media: finalFiles,
            },
            { status: 200 }
        );

    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'Internal Server Error';
        logMessage('error', 'HighRto Creation Error:', error);
        return NextResponse.json({ status: false, error }, { status: 500 });
    }
}
