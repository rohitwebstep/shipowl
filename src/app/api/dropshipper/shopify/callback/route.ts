import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';
import { logMessage } from '@/utils/commonUtils';
import { isShopUsedAndVerified, verifyDropshipperShopifyStore } from '@/app/models/dropshipper/shopify';

export async function GET(req: NextRequest) {
    try {
        logMessage('debug', 'Received GET request to complete Shopify OAuth');

        const url = new URL(req.url);
        const shop = url.searchParams.get('shop');
        const code = url.searchParams.get('code');
        const hmac = url.searchParams.get('hmac');

        if (!shop || !code || !hmac) {
            return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
        }

        // ✅ Check if shop is already used and verified
        const isAlreadyUsed = await isShopUsedAndVerified(shop);
        if (!isAlreadyUsed.status || !isAlreadyUsed.shopifyStore) {
            return NextResponse.json({ status: false, message: isAlreadyUsed.message }, { status: 401 });
        }

        const shopifyStore = isAlreadyUsed.shopifyStore;

        // ✅ Check for required shopifyStore fields
        if (!shopifyStore.apiSecret || !shopifyStore.apiKey || !shopifyStore.apiVersion) {
            return NextResponse.json({
                error: 'Shopify store configuration is incomplete (missing apiKey, apiSecret, or apiVersion).',
            }, { status: 500 });
        }

        // ✅ Validate HMAC
        const params: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
            if (key !== 'hmac' && key !== 'signature') {
                params[key] = value;
            }
        });

        const message = new URLSearchParams(params).toString();
        const generatedHash = crypto
            .createHmac('sha256', shopifyStore.apiSecret)
            .update(message)
            .digest('hex');

        const hmacValid = crypto.timingSafeEqual(
            Buffer.from(hmac, 'utf-8'),
            Buffer.from(generatedHash, 'utf-8')
        );

        if (!hmacValid) {
            return NextResponse.json({ error: 'HMAC validation failed.' }, { status: 401 });
        }

        // 🔐 Exchange code for access token
        const tokenRes = await axios.post(
            `https://${shop}/admin/oauth/access_token`,
            qs.stringify({
                client_id: shopifyStore.apiKey,
                client_secret: shopifyStore.apiSecret,
                code
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const accessToken = tokenRes.data.access_token;

        // 🛒 Fetch shop data
        const shopInfoRes = await axios.get(
            `https://${shop}/admin/api/${shopifyStore.apiVersion}/shop.json`,
            {
                headers: {
                    'X-Shopify-Access-Token': accessToken
                }
            }
        );

        const shopData = shopInfoRes.data.shop;

        const payload = {
            admin: {
                connect: {
                    id: shopData.adminId
                }
            },
            shop: shop,
            accessToken: accessToken,
            email: shopData.email,
            shopOwner: shopData.shop_owner,
            name: shopData.name,
            domain: shopData.domain,
            myshopifyDomain: shopData.myshopify_domain,
            planName: shopData.plan_name,
            countryName: shopData.country_name,
            province: shopData.province,
            city: shopData.city,
            phone: shopData.phone,
            currency: shopData.currency,
            moneyFormat: shopData.money_format,
            ianaTimezone: shopData.iana_timezone,
            shopCreatedAt: shopData.created_at
        };

        // 🧩 Replace with actual dropshipper ID and role
        const dropshipperId = shopifyStore.adminId;
        const dropshipperRole = 'admin';

        const result = await verifyDropshipperShopifyStore(
            dropshipperId,
            dropshipperRole,
            payload
        );

        if (result?.status) {
            return NextResponse.json({ status: true }, { status: 200 });
        }

        logMessage('error', 'Failed to create store:', result?.message || 'Unknown error');
        return NextResponse.json({
            status: false,
            error: result?.message || 'Store creation failed',
        }, { status: 500 });

    } catch (error) {
        logMessage('error', 'OAuth Callback Error:', error);
        return NextResponse.json({ status: false, error }, { status: 500 });
    }
}
