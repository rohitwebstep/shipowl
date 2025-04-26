import prisma from "@/lib/prisma";
import path from "path";
import { deleteFile } from '@/utils/saveFiles';
import { logMessage } from "@/utils/commonUtils";

interface Supplier {
    id?: bigint; // Optional: ID of the supplier (if exists)
    name: string; // Name of the supplier
    profilePicture: string,
    username: string; // Username of the supplier
    email: string; // Email address of the supplier
    password: string; // Password for the supplier account
    dateOfBirth: string; // Date of birth (stored as a string in 'YYYY-MM-DD' format)
    currentAddress: string; // Current address of the supplier
    permanentAddress: string; // Permanent address of the supplier
    permanentPostalCode: string; // Postal code of the permanent address
    permanentCity: {
        connect: { id: number }; // City ID for permanent city (connected to a city record)
    };
    permanentState: {
        connect: { id: number }; // State ID for permanent state (connected to a state record)
    };
    permanentCountry: {
        connect: { id: number }; // Country ID for permanent country (connected to a country record)
    };
    status: boolean; // Status of the supplier (active, inactive, etc.)
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

export async function checkEmailAvailability(email: string) {
    try {
        // Query to find if an email already exists with role 'supplier'
        const existingSupplier = await prisma.admin.findUnique({
            where: { email },
            select: { email: true, role: true },
        });

        // If the email is already in use by a supplier
        if (existingSupplier && existingSupplier.role === 'supplier') {
            return {
                status: false,
                message: `Email "${email}" is already in use by a supplier.`,
            };
        }

        // If no record is found, the email is available
        return {
            status: true,
            message: `Email "${email}" is available.`,
        };
    } catch (error) {
        // Log the error and return a general error message
        console.error('Error checking email availability:', error);
        return {
            status: false,
            message: 'Error while checking email availability.',
        };
    }
}

export async function checkUsernameAvailability(username: string) {
    try {
        // Query to find if an username already exists with role 'supplier'
        const existingSupplier = await prisma.admin.findUnique({
            where: { username },
            select: { username: true, role: true },
        });

        // If the username is already in use by a supplier
        if (existingSupplier && existingSupplier.role === 'supplier') {
            return {
                status: false,
                message: `Username "${username}" is already in use by a supplier.`,
            };
        }

        // If no record is found, the username is available
        return {
            status: true,
            message: `Username "${username}" is available.`,
        };
    } catch (error) {
        // Log the error and return a general error message
        console.error('Error checking username availability:', error);
        return {
            status: false,
            message: 'Error while checking username availability.',
        };
    }
}

export async function createSupplier(adminId: number, adminRole: string, supplier: Supplier) {
    try {
        const { name, profilePicture, username, email, password, dateOfBirth, currentAddress, permanentAddress, permanentPostalCode, permanentCity, permanentState, permanentCountry, status: statusRaw, createdAt, createdBy, createdByRole } = supplier;

        // Convert statusRaw to a boolean using the includes check
        const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

        // Convert boolean status to string ('active' or 'inactive')
        const statusString = status ? 'active' : 'inactive';

        const newSupplier = await prisma.admin.create({
            data: {
                name,
                profilePicture,
                username,
                email,
                password,
                role: 'supplier',
                dateOfBirth: new Date(dateOfBirth),
                currentAddress,
                permanentAddress,
                permanentPostalCode,
                permanentCity,
                permanentState,
                permanentCountry,
                status: statusString,
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

export const getSuppliersByStatus = async (status: "deleted" | "notDeleted" = "notDeleted") => {
    try {
        let whereCondition = {};

        switch (status) {
            case "notDeleted":
                whereCondition = { role: 'supplier', deletedAt: null };
                break;
            case "deleted":
                whereCondition = { role: 'supplier', deletedAt: { not: null } };
                break;
            default:
                throw new Error("Invalid status");
        }

        const suppliers = await prisma.admin.findMany({
            where: whereCondition,
            orderBy: { name: "asc" }
        });

        const sanitizedCities = serializeBigInt(suppliers);

        return { status: true, suppliers: sanitizedCities };
    } catch (error) {
        console.error(`Error fetching suppliers by status (${status}):`, error);
        return { status: false, message: "Error fetching suppliers" };
    }
};

// 🔵 GET BY ID
export const getSupplierById = async (id: number) => {
    try {
        const supplier = await prisma.admin.findUnique({
            where: { id, role: 'supplier' },
        });

        if (!supplier) return { status: false, message: "Supplier not found" };
        return { status: true, supplier };
    } catch (error) {
        console.error("❌ getSupplierById Error:", error);
        return { status: false, message: "Error fetching supplier" };
    }
};

// 🟡 UPDATE
export const updateSupplier = async (
    adminId: number,
    adminRole: string,
    supplierId: number,
    supplier: Supplier
) => {
    try {
        const {
            name,
            profilePicture,
            username,
            email,
            password,
            dateOfBirth,
            currentAddress,
            permanentAddress,
            permanentPostalCode,
            permanentCity,
            permanentState,
            permanentCountry,
            status: statusRaw,
            updatedAt,
            updatedBy,
            updatedByRole
        } = supplier;

        // Convert statusRaw to a boolean using the includes check
        const status = ['true', '1', true, 1, 'active'].includes(statusRaw as string | number | boolean);

        // Convert boolean status to string ('active' or 'inactive')
        const statusString = status ? 'active' : 'inactive';

        const { status: supplierStatus, supplier: currentSupplier, message } = await getSupplierById(supplierId);

        if (!supplierStatus || !supplier) {
            return { status: false, message: message || "Supplier not found." };
        }

        if (profilePicture && profilePicture.trim() !== '' && currentSupplier?.profilePicture?.trim()) {
            try {
                const imageFileName = path.basename(currentSupplier.profilePicture.trim());
                const filePath = path.join(process.cwd(), 'public', 'uploads', 'supplier');

                const fileDeleted = await deleteFile(filePath);

                if (!fileDeleted) {
                    console.warn(`Failed to delete old profile picture: ${imageFileName}`);
                }
            } catch (error) {
                console.error("Error deleting profile picture:", error);
            }
        }

        const updateData = {
            name,
            username,
            email,
            password,
            role: 'supplier',
            dateOfBirth: new Date(dateOfBirth),
            currentAddress,
            permanentAddress,
            permanentPostalCode,
            permanentCity,
            permanentState,
            permanentCountry,
            status: statusString,
            updatedBy,
            updatedByRole,
            updatedAt,
            ...(profilePicture && profilePicture.trim() !== '' ? { profilePicture: profilePicture.trim() } : {})
        };

        const newSupplier = await prisma.admin.update({
            where: { id: supplierId },
            data: updateData,
        });

        const sanitizedSupplier = serializeBigInt(newSupplier);
        return { status: true, supplier: sanitizedSupplier };
    } catch (error) {
        console.error(`Error updating supplier:`, error);
        return { status: false, message: "Internal Server Error" };
    }
};

// 🔴 Soft DELETE (marks as deleted by setting deletedAt field for supplier and variants)
export const softDeleteSupplier = async (adminId: number, adminRole: string, id: number) => {
    try {
        // Soft delete the supplier
        const updatedSupplier = await prisma.admin.update({
            where: { id, role: 'supplier' },
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });

        // Soft delete the companyDetails of this supplier
        const updatedCompanyDeatil = await prisma.companyDetail.update({
            where: { adminId: id },  // assuming `supplierId` is the foreign key in the variant table
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });

        // Soft delete the bankAccounts of this supplier
        const updatedBankAccounts = await prisma.bankAccount.updateMany({
            where: { adminId: id },  // assuming `supplierId` is the foreign key in the variant table
            data: {
                deletedBy: adminId,
                deletedAt: new Date(),
                deletedByRole: adminRole,
            },
        });

        return {
            status: true,
            message: "Supplier soft deleted successfully",
            updatedSupplier,
            updatedCompanyDeatil,
            updatedBankAccounts
        };
    } catch (error) {
        console.error("❌ softDeleteSupplier Error:", error);
        return { status: false, message: "Error soft deleting supplier" };
    }
};


// 🟢 RESTORE (Restores a soft-deleted supplier setting deletedAt to null)
export const restoreSupplier = async (adminId: number, adminRole: string, id: number) => {
    try {
        // Restore the supplier
        const restoredSupplier = await prisma.admin.update({
            where: { id },
            include: { companyDetail: true, bankAccounts: true },
            data: {
                deletedBy: null,      // Reset the deletedBy field
                deletedAt: null,      // Set deletedAt to null
                deletedByRole: null,  // Reset the deletedByRole field
                updatedBy: adminId,   // Record the user restoring the supplier
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field
            },
        });

        // Restore the variants of this supplier
        await prisma.companyDetail.updateMany({
            where: { adminId: id },  // assuming `supplierId` is the foreign key in the variant table
            data: {
                deletedBy: null,      // Reset the deletedBy field for variants
                deletedAt: null,      // Set deletedAt to null for variants
                deletedByRole: null,  // Reset the deletedByRole field for variants
                updatedBy: adminId,   // Record the user restoring the variant
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field for variants
            },
        });

        // Restore the variants of this supplier
        await prisma.bankAccount.updateMany({
            where: { adminId: id },  // assuming `supplierId` is the foreign key in the variant table
            data: {
                deletedBy: null,      // Reset the deletedBy field for variants
                deletedAt: null,      // Set deletedAt to null for variants
                deletedByRole: null,  // Reset the deletedByRole field for variants
                updatedBy: adminId,   // Record the user restoring the variant
                updatedByRole: adminRole, // Record the role of the user
                updatedAt: new Date(), // Update the updatedAt field for variants
            },
        });

        const sanitizedSupplier = serializeBigInt(restoredSupplier);
        logMessage('debug', 'fetched suppliers :', sanitizedSupplier);

        return {
            status: true,
            message: "Supplier restored successfully",
            restoredSupplier: sanitizedSupplier
        };
    } catch (error) {
        console.error("❌ restoreSupplier Error:", error);
        return { status: false, message: "Error restoring supplier" };
    }
};

// 🔴 DELETE
export const deleteSupplier = async (id: number) => {
    try {
        console.log(`id - `, id);
        await prisma.admin.delete({ where: { id, role: 'supplier' } });
        return { status: true, message: "Supplier deleted successfully" };
    } catch (error) {
        console.error("❌ deleteSupplier Error:", error);
        return { status: false, message: "Error deleting supplier" };
    }
};