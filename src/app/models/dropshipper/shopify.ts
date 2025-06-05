import prisma from "@/lib/prisma";

interface ShopifyStore {
    // === Primary Keys and Relations ===
    admin: {
        connect: { id: number };
    };
    id?: bigint; // Optional: ID of the dropshipperShopifyStore (if exists)
    createdBy?: number;
    createdByRole?: string | null;
    updatedBy?: number;
    updatedByRole?: string | null;
    deletedBy?: number;
    deletedByRole?: string | null;

    // === Shopify Store Identifiers ===
    shop: string;
    accessToken?: string;

    // === Shopify App Configuration ===
    apiKey?: string;        // Formerly SHOPIFY_API_KEY
    apiSecret?: string;     // Formerly SHOPIFY_API_SECRET
    scopes?: string;        // Formerly SHOPIFY_SCOPES (comma-separated)
    redirectUri?: string;
    apiVersion?: string;

    // === Shopify API & Version (optional, add if needed) ===
    // apiVersion?: string; 

    // === Store Metadata ===
    email?: string;
    name?: string;              // corresponds to shopName in Prisma
    planName?: string;
    countryName?: string;       // corresponds to country in Prisma
    shopOwner?: string;
    domain?: string;
    myshopifyDomain?: string;   // corresponds to myshopifyDomain in Prisma
    province?: string;
    city?: string;
    phone?: string;
    currency?: string;
    moneyFormat?: string;
    ianaTimezone?: string;      // corresponds to timezone in Prisma
    shopCreatedAt?: string;     // corresponds to createdAtShop in Prisma

    // === Status Flags ===
    verificationStatus?: boolean;
    status?: boolean;

    // === Timestamps ===
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

const serializeBigInt = <T>(obj: T): T => {
  if (typeof obj === "bigint") {
    return obj.toString() as unknown as T;
  }

  if (obj instanceof Date) {
    // Return Date object unchanged, no conversion
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt) as unknown as T;
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
    ) as T;
  }

  return obj;
};

export async function isShopUsedAndVerified(shop: string) {
    try {
        // Find the shop regardless of verification status
        const existingStore = await prisma.shopifyStore.findFirst({
            where: {
                shop: shop
            },
            include: {
                admin: true
            }
        });

        if (existingStore) {
            return {
                status: true,                        // shop exists
                verified: !!existingStore.verificationStatus,  // true if verified, else false
                shopifyStore: existingStore,
                message: existingStore.verificationStatus
                    ? 'Shop is used and verified.'
                    : 'Shop is used but not verified.'
            };
        } else {
            return {
                status: false,
                verified: false,
                shopifyStore: null,
                message: 'Shop not found.'
            };
        }

    } catch (error) {
        console.error(`Error checking if shop is used and verified:`, error);
        return {
            status: false,
            verified: false,
            shopifyStore: null,
            message: 'An error occurred while checking the shop.'
        };
    }
}

export async function createDropshipperShopifyStore(dropshipperId: number, dropshipperRole: string, dropshipperShopifyStore: ShopifyStore) {
    try {
        const { admin, shop, apiKey, apiSecret, scopes, redirectUri, apiVersion, createdAt, createdBy, createdByRole } = dropshipperShopifyStore;

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
                apiVersion,
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

export async function verifyDropshipperShopifyStore(dropshipperId: number, dropshipperRole: string, dropshipperShopifyStore: ShopifyStore) {
    try {
        const {
            shop,
            accessToken,
            email,
            shopOwner,
            name,
            domain,
            myshopifyDomain,
            planName,
            countryName,
            province,
            city,
            phone,
            currency,
            moneyFormat,
            ianaTimezone,
            shopCreatedAt,
        } = dropshipperShopifyStore;

        const existing = await isShopUsedAndVerified(shop);

        // 🚫 Stop if already verified
        if (existing.status && existing.shopifyStore && existing.verified) {
            return { status: true, message: "Shop already verified and connected." };
        }

        if (!existing.shopifyStore) {
            return { status: false, message: "Shopify store not found." };
        }

        // ✅ Update the accessToken and mark verified
        await prisma.shopifyStore.update({
            where: { id: Number(existing.shopifyStore.id) },
            data: {
                accessToken,
                email,
                shopOwner,
                name,
                domain,
                myshopifyDomain,
                planName,
                country: countryName,
                province,
                city,
                phone,
                currency,
                moneyFormat,
                timezone: ianaTimezone,
                createdAtShop: shopCreatedAt
            }
        });

        return { status: true };
    } catch (error) {
        console.error(`Error creating city:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

export async function deleteShopIfNotVerified(shop: string) {
    try {
        // Find the shop record regardless of verification status
        const existingStore = await prisma.shopifyStore.findFirst({
            where: { shop: shop }
        });

        if (!existingStore) {
            return {
                status: false,
                message: 'Shop not found.'
            };
        }

        // Check verification status
        if (existingStore.verificationStatus) {
            return {
                status: false,
                message: 'Shop is verified and will not be deleted.'
            };
        }

        // Delete the shop because it is not verified
        await prisma.shopifyStore.delete({
            where: { id: existingStore.id }
        });

        return {
            status: true,
            message: 'Shop was found but not verified, so it was deleted.'
        };
    } catch (error) {
        console.error(`Error deleting shop if not verified:`, error);
        return {
            status: false,
            message: 'An error occurred while trying to delete the shop.'
        };
    }
}

export async function getShopifyStoresByDropshipperId(dropshipperId: number) {
    try {
        const stores = await prisma.shopifyStore.findMany({
            where: {
                createdBy: dropshipperId
            },
            include: {
                admin: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!stores || stores.length === 0) {
            return {
                status: false,
                message: 'No Shopify stores found for this dropshipper.',
                shopifyStores: []
            };
        }

        return {
            status: true,
            shopifyStores: serializeBigInt(stores),
            message: `${stores.length} store(s) found for this dropshipper.`
        };

    } catch (error) {
        console.error(`Error fetching Shopify stores by dropshipperId:`, error);
        return {
            status: false,
            shopifyStores: [],
            message: 'Internal Server Error'
        };
    }
}

export async function getShopifyStoreByIdForDropshipper(storeId: number, dropshipperId: number) {
    try {
        const store = await prisma.shopifyStore.findUnique({
            where: {
                id: storeId,
                adminId: dropshipperId
            },
            include: {
                admin: true
            }
        });

        if (!store) {
            return {
                status: false,
                message: 'Shopify store not found.',
                shopifyStore: null
            };
        }

        return {
            status: true,
            shopifyStore: serializeBigInt(store),
            message: 'Shopify store found.'
        };

    } catch (error) {
        console.error(`Error fetching Shopify store by ID:`, error);
        return {
            status: false,
            shopifyStore: null,
            message: 'Internal Server Error'
        };
    }
}
