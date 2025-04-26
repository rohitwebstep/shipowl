import prisma from "@/lib/prisma";
import { logMessage } from "@/utils/commonUtils";

interface BankAccount {
    id?: number;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    bankBranch: string;
    accountType: string;
    ifscCode: string;
    cancelledChequeImage: string;
}

interface SupplierBankAccountPayload {
    admin: { connect: { id: number } };
    bankAccounts: BankAccount[];
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

export const getBankAccountById = async (id: number) => {
    try {
        const bankAccount = await prisma.bankAccount.findUnique({
            where: { id },
        });

        if (!bankAccount) return { status: false, message: "Company Bank Account not found" };
        return { status: true, bankAccount };
    } catch (error) {
        console.error("❌ getCompanyDeailBySupplierId Error:", error);
        return { status: false, message: "Error fetching supplier bank account" };
    }
};


export async function createSupplierBankAccount(
    adminId: number,
    adminRole: string,
    payload: SupplierBankAccountPayload
) {
    try {
        const { admin, bankAccounts, createdAt, createdBy, createdByRole } = payload;

        const bankAccountData = bankAccounts.map((account) => ({
            adminId: admin.connect.id,
            accountHolderName: account.accountHolderName,
            accountNumber: account.accountNumber,
            bankName: account.bankName,
            bankBranch: account.bankBranch,
            accountType: account.accountType,
            ifscCode: account.ifscCode,
            cancelledChequeImage: account.cancelledChequeImage,
            createdAt,
            createdBy,
            createdByRole
        }));

        const newBankAccounts = await prisma.bankAccount.createMany({
            data: bankAccountData,
        });

        return { status: true, bankAccounts: newBankAccounts };
    } catch (error) {
        logMessage("error", "Error creating supplier bank account", error);
        return { status: false, message: "Internal Server Error" };
    }
}

export async function updateSupplierBankAccount(
    adminId: number,
    adminRole: string,
    supplierId: number,
    payload: SupplierBankAccountPayload
) {
    try {
        const updateOrCreatePromises = payload.bankAccounts.map(async (account) => {
            if (account.id) {

                const { status: supplierStatus, bankAccount: currentBankAccount, message } = await getBankAccountById(account.id);
                if (!supplierStatus || !currentBankAccount) {
                    return { status: false, message: message || "Bank Account not found." };
                }

                const fields = ['cancelledChequeImage'] as const;
                const mergedImages: Partial<Record<typeof fields[number], string>> = {};

                for (const field of fields) {
                    const newImages = account[field];
                    const existingImages = currentBankAccount[field];
                    if (newImages && newImages.trim()) {
                        const merged = Array.from(new Set([
                            ...(existingImages ? existingImages.split(',').map(x => x.trim()) : []),
                            ...newImages.split(',').map(x => x.trim())
                        ])).join(',');
                        mergedImages[field] = merged;
                    }
                }

                // If account has an ID, update it
                return prisma.bankAccount.update({
                    where: { id: account.id },
                    data: {
                        adminId: payload.admin.connect.id,
                        accountHolderName: account.accountHolderName,
                        accountNumber: account.accountNumber,
                        bankName: account.bankName,
                        bankBranch: account.bankBranch,
                        accountType: account.accountType,
                        ifscCode: account.ifscCode,
                        cancelledChequeImage: mergedImages.cancelledChequeImage,
                        updatedAt: payload.updatedAt,
                        updatedBy: payload.updatedBy,
                        updatedByRole: payload.updatedByRole,
                    }
                });
            } else {
                // Else create a new bank account
                return prisma.bankAccount.create({
                    data: {
                        adminId: payload.admin.connect.id,
                        accountHolderName: account.accountHolderName,
                        accountNumber: account.accountNumber,
                        bankName: account.bankName,
                        bankBranch: account.bankBranch,
                        accountType: account.accountType,
                        ifscCode: account.ifscCode,
                        cancelledChequeImage: account.cancelledChequeImage,
                        createdAt: payload.createdAt,
                        createdBy: payload.createdBy,
                        createdByRole: payload.createdByRole,
                    }
                });
            }
        });

        const results = await Promise.all(updateOrCreatePromises);

        return { status: true, bankAccounts: results };
    } catch (error) {
        logMessage("error", "Error updating/creating supplier bank account", error);
        return { status: false, message: "Internal Server Error" };
    }
}

