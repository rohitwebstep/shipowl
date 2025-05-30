import { NextRequest, NextResponse } from 'next/server';
import { logMessage } from '@/utils/commonUtils';
import { isUserExist } from '@/utils/auth/authUtils';
import { validateFormData } from '@/utils/validateFormData';
import {
    isShopUsedAndVerified,
    createDropshipperShopifyStore,
    deleteShopIfNotVerified,
} from '@/app/models/dropshipper/shopify';

export async function POST(req: NextRequest) {
    try {
        logMessage('debug', 'Received POST request to link Shopify store');

        // Extract and validate dropshipper identity
        const dropshipperId = Number(req.headers.get('x-dropshipper-id'));
        const dropshipperRole = req.headers.get('x-dropshipper-role');

        if (isNaN(dropshipperId)) {
            return NextResponse.json(
                { error: 'Invalid or missing dropshipper ID' },
                { status: 400 }
            );
        }

        logMessage(`debug`, `dropshipperId - ${dropshipperId} // dropshipperRole -- ${dropshipperRole}`);

        // Check if the user exists and is authorized
        const userCheck = await isUserExist(dropshipperId, String(dropshipperRole));
        if (!userCheck.status) {
            return NextResponse.json(
                { error: `Unauthorized user: ${userCheck.message}` },
                { status: 403 }
            );
        }

        // Parse and validate form data
        const formData = await req.formData();
        const validation = validateFormData(formData, {
            requiredFields: ['shop', 'apiKey', 'apiSecret', 'scopes', 'redirectUri'],
            patternValidations: {
                shop: 'string',
                apiKey: 'string',
                apiSecret: 'string',
                scopes: 'string',
                redirectUri: 'string',
            },
        });

        if (!validation.isValid) {
            return NextResponse.json(
                {
                    status: false,
                    error: validation.error,
                    message: validation.message,
                },
                { status: 400 }
            );
        }

        const extractString = (key: string) => (formData.get(key) as string)?.trim() || '';

        const shop = extractString('shop');
        const apiKey = extractString('apiKey');
        const apiSecret = extractString('apiSecret');
        const scopes = extractString('scopes');
        const redirectUri = extractString('redirectUri');

        // Check if the Shopify store is already registered and verified
        const isAlreadyUsed = await isShopUsedAndVerified(shop);
        if (isAlreadyUsed.status) {
            if (isAlreadyUsed.verified) {
                return NextResponse.json(
                    {
                        status: false,
                        message: isAlreadyUsed.message || 'This Shopify store is already registered and verified.',
                    },
                    { status: 409 }
                );
            } else {
                const deleteShop = await deleteShopIfNotVerified(shop);
                return NextResponse.json(
                    {
                        status: false,
                        message: deleteShop.message || 'This Shopify store is already registered and verified.',
                    },
                    { status: 409 }
                );
            }
        }

        // Prepare payload
        const payload = {
            admin: { connect: { id: dropshipperId } },
            shop,
            apiKey,
            apiSecret,
            scopes,
            redirectUri,
            createdAt: new Date(),
            createdBy: dropshipperId,
            createdByRole: dropshipperRole,
        };

        // Attempt to create the Shopify store record
        const result = await createDropshipperShopifyStore(
            dropshipperId,
            String(dropshipperRole),
            payload
        );

        if (result?.status) {
            const installUrl = `https://${shop}/admin/oauth/authorize` +
                `?client_id=${apiKey}` +
                `&scope=${encodeURIComponent(scopes)}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}`;

            return NextResponse.json({ status: true, installUrl }, { status: 200 });
        }

        logMessage('error', 'Failed to create store:', result?.message || 'Unknown error');
        return NextResponse.json(
            {
                status: false,
                error: result?.message || 'Store creation failed',
            },
            { status: 500 }
        );

    } catch (error) {
        logMessage('error', 'Exception in Shopify store linking:', error);
        return NextResponse.json({ status: false, error }, { status: 500 });
    }
}
