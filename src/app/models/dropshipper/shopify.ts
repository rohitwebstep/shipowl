import prisma from "@/lib/prisma";
import path from "path";
import { deleteFile } from '@/utils/saveFiles';
import { logMessage } from "@/utils/commonUtils";

interface ShopifyStore {
    admin: {
        connect: { id: number }
    }
    id?: bigint; // Optional: ID of the dropshipperShopifyStore (if exists)
    shop: string;
    apiKey: string;
    apiSecret: string;
    scopes: string;
    redirectUri: string;
    verificationStatus?: boolean;
    status?: boolean; // Status of the dropshipperShopifyStore (active, inactive, etc.)
    createdAt?: Date; // Timestamp of when the dropshipperShopifyStore was created
    updatedAt?: Date; // Timestamp of when the dropshipperShopifyStore was last updated
    deletedAt?: Date | null; // Timestamp of when the dropshipperShopifyStore was deleted, or null if not deleted
    createdBy?: number; // ID of the dropshipperShopifyStore who created the dropshipperShopifyStore
    updatedBy?: number; // ID of the dropshipperShopifyStore who last updated the dropshipperShopifyStore
    deletedBy?: number; // ID of the dropshipperShopifyStore who deleted the dropshipperShopifyStore
    createdByRole?: string | null; // Role of the dropshipperShopifyStore who created the dropshipperShopifyStore
    updatedByRole?: string | null; // Role of the dropshipperShopifyStore who last updated the dropshipperShopifyStore
    deletedByRole?: string | null; // Role of the dropshipperShopifyStore who deleted the dropshipperShopifyStore
}

const serializeBigInt = <T>(obj: T): T => {
    // If it's an array, recursively apply serializeBigInt to each element
    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt) as T;
    }
    // If it's an object, recursively apply serializeBigInt to each key-value pair
    else if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        ) as T;
    }
    // If it's a BigInt, convert it to a string
    else if (typeof obj === 'bigint') {
        return obj.toString() as T;
    }

    // Return the value unchanged if it's not an array, object, or BigInt
    return obj;
};

export async function isShopUsedAndVerified(shop: string) {
    try {
        const existingStore = await prisma.shopifyStore.findFirst({
            where: {
                shop: shop,
                verificationStatus: true,
            }
        });

        if (existingStore) {
            return {
                status: true,
                shopifyStore: existingStore,
                message: 'Shop is used and verified.'
            };
        } else {
            return {
                status: false,
                shopifyStore: null,
                message: 'Shop is either not found or not verified.'
            };
        }

    } catch (error) {
        console.error(`Error checking if shop is used and verified:`, error);
        return {
            status: false,
            shopifyStore: null,
            message: 'An error occurred while checking the shop.'
        };
    }
}

export async function createDropshipperShopifyStore(dropshipperId: number, dropshipperRole: string, dropshipperShopifyStore: ShopifyStore) {
    try {
        const { admin, shop, apiKey, apiSecret, scopes, redirectUri, createdAt, createdBy, createdByRole } = dropshipperShopifyStore;

        // 🚫 Check if the shop is already used and verified
        const isAlreadyUsed = await isShopUsedAndVerified(shop);
        if (isAlreadyUsed.status) {
            return { status: false, message: "This Shopify store is already registered and verified." };
        }

        const statusRaw = false;
        const verificationStatusRaw = false;

        // Convert statusRaw to a boolean using the includes check
        const status = ['true', '1', true, 1, 'active', 'yes'].includes(statusRaw as string | number | boolean);
        const verificationStatus = ['true', '1', true, 1, 'active', 'yes'].includes(verificationStatusRaw as string | number | boolean);

        const newShopifyStore = await prisma.shopifyStore.create({
            data: {
                admin,
                shop,
                apiKey,
                apiSecret,
                scopes,
                redirectUri,
                status,
                verificationStatus,
                createdAt,
                createdBy,
                createdByRole
            },
        });

        return { status: true, dropshipperShopifyStore: serializeBigInt(newShopifyStore) };
    } catch (error) {
        console.error(`Error creating city:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}