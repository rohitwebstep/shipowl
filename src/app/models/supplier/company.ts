import prisma from "@/lib/prisma";
import path from "path";
import { deleteFile } from '@/utils/saveFiles';

interface SupplierCompany {
    admin: {
        connect: { id: number }; // City ID for permanent city (connected to a city record)
    };
    id?: bigint; // Optional: ID of the supplier (if exists)
    companyName: string;
    brandName: string;
    brandShortName: string;
    billingAddress: string;
    billingPincode: string;
    billingState: string;
    billingCity: string;
    businessType: string;
    clientEntryType: string;
    gstNumber: string;
    companyPanNumber: string;
    aadharNumber: string;
    gstDocument: string;
    panCardHolderName: string;
    aadharCardHolderName: string;
    panCardImage: string;
    aadharCardImage: string;
    additionalDocumentUpload: string;
    documentId: string;
    documentName: string;
    documentImage: string;
    createdAt?: Date; // Timestamp of when the supplier was created
    updatedAt?: Date; // Timestamp of when the supplier was last updated
    deletedAt?: Date | null; // Timestamp of when the supplier was deleted, or null if not deleted
    createdBy?: number; // ID of the admin who created the supplier
    updatedBy?: number; // ID of the admin who last updated the supplier
    deletedBy?: number; // ID of the admin who deleted the supplier
    createdByRole?: string | null; // Role of the admin who created the supplier
    updatedByRole?: string | null; // Role of the admin who last updated the supplier
    deletedByRole?: string | null; // Role of the admin who deleted the supplier
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

export const getCompanyDeailBySupplierId = async (supplierId: number) => {
    try {
        const companyDetail = await prisma.companyDetail.findUnique({
            where: { adminId: supplierId },
        });

        if (!companyDetail) return { status: false, message: "Company Bank Account not found" };
        return { status: true, companyDetail };
    } catch (error) {
        console.error("❌ getCompanyDeailBySupplierId Error:", error);
        return { status: false, message: "Error fetching supplier bank account" };
    }
};

export async function createSupplierCompany(adminId: number, adminRole: string, supplierCompany: SupplierCompany) {

    try {
        const {
            admin,
            companyName,
            brandName,
            brandShortName,
            billingAddress,
            billingPincode,
            billingState,
            billingCity,
            businessType,
            clientEntryType,
            gstNumber,
            companyPanNumber,
            aadharNumber,
            gstDocument,
            panCardHolderName,
            aadharCardHolderName,
            panCardImage,
            aadharCardImage,
            additionalDocumentUpload,
            documentId,
            documentName,
            documentImage,
            createdAt,
            createdBy,
            createdByRole
        } = supplierCompany;

        const newSupplier = await prisma.companyDetail.create({
            data: {
                admin,
                companyName,
                brandName,
                brandShortName,
                billingAddress,
                billingPincode,
                billingState,
                billingCity,
                businessType,
                clientEntryType,
                gstNumber,
                companyPanNumber,
                aadharNumber,
                gstDocument,
                panCardHolderName,
                aadharCardHolderName,
                panCardImage,
                aadharCardImage,
                additionalDocumentUpload,
                documentId,
                documentName,
                documentImage,
                createdAt,
                createdBy,
                createdByRole
            },
        });

        const sanitizedSupplier = serializeBigInt(newSupplier);
        return { status: true, supplier: sanitizedSupplier };
    } catch (error) {
        console.error(`Error creating city:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}

export async function updateSupplierCompany(
    adminId: number,
    adminRole: string,
    supplierId: number,
    supplierCompany: SupplierCompany
) {
    try {
        const { status: supplierStatus, companyDetail: currentCompanyDetail, message } = await getCompanyDeailBySupplierId(supplierId);
        if (!supplierStatus || !currentCompanyDetail) {
            return { status: false, message: message || "Bank Account not found." };
        }

        const fields = ['gstDocument', 'panCardImage', 'aadharCardImage', 'additionalDocumentUpload', 'documentImage'] as const;
        const mergedImages: Partial<Record<typeof fields[number], string>> = {};

        for (const field of fields) {
            const newImages = supplierCompany[field];
            const existingImages = currentCompanyDetail[field];
            if (newImages && newImages.trim()) {
                const merged = Array.from(new Set([
                    ...(existingImages ? existingImages.split(',').map(x => x.trim()) : []),
                    ...newImages.split(',').map(x => x.trim())
                ])).join(',');
                mergedImages[field] = merged;
            }
        }

        const updatedSupplier = await prisma.companyDetail.update({
            where: { adminId: supplierId },
            data: {
                admin: supplierCompany.admin,
                companyName: supplierCompany.companyName,
                brandName: supplierCompany.brandName,
                brandShortName: supplierCompany.brandShortName,
                billingAddress: supplierCompany.billingAddress,
                billingPincode: supplierCompany.billingPincode,
                billingState: supplierCompany.billingState,
                billingCity: supplierCompany.billingCity,
                businessType: supplierCompany.businessType,
                clientEntryType: supplierCompany.clientEntryType,
                gstNumber: supplierCompany.gstNumber,
                companyPanNumber: supplierCompany.companyPanNumber,
                aadharNumber: supplierCompany.aadharNumber,
                panCardHolderName: supplierCompany.panCardHolderName,
                aadharCardHolderName: supplierCompany.aadharCardHolderName,
                documentId: supplierCompany.documentId,
                documentName: supplierCompany.documentName,
                updatedBy: supplierCompany.updatedBy,
                updatedByRole: supplierCompany.updatedByRole,
                updatedAt: supplierCompany.updatedAt,
                gstDocument: mergedImages.gstDocument,
                panCardImage: mergedImages.panCardImage,
                aadharCardImage: mergedImages.aadharCardImage,
                additionalDocumentUpload: mergedImages.additionalDocumentUpload,
                documentImage: mergedImages.documentImage,
            },
        });

        return { status: true, supplier: serializeBigInt(updatedSupplier) };
    } catch (error) {
        console.error("Error updating supplier company:", error);
        return { status: false, message: "Internal Server Error" };
    }
}
