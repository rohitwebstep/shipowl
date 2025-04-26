import prisma from "@/lib/prisma";
import path from "path";
import { deleteFile } from '@/utils/saveFiles';
import { logMessage } from "@/utils/commonUtils";

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