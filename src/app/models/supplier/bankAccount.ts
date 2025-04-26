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
        const { admin, bankAccounts, updatedAt, updatedBy, updatedByRole } = payload;

        const updateOrCreatePromises = bankAccounts.map((account) => {
            if (account.id) {
                // If account has an ID, update it
                return prisma.bankAccount.update({
                    where: { id: account.id },
                    data: {
                        adminId: admin.connect.id,
                        accountHolderName: account.accountHolderName,
                        accountNumber: account.accountNumber,
                        bankName: account.bankName,
                        bankBranch: account.bankBranch,
                        accountType: account.accountType,
                        ifscCode: account.ifscCode,
                        cancelledChequeImage: account.cancelledChequeImage,
                        updatedAt,
                        updatedBy,
                        updatedByRole
                    }
                });
            } else {
                // Else create a new bank account
                return prisma.bankAccount.create({
                    data: {
                        adminId: admin.connect.id,
                        accountHolderName: account.accountHolderName,
                        accountNumber: account.accountNumber,
                        bankName: account.bankName,
                        bankBranch: account.bankBranch,
                        accountType: account.accountType,
                        ifscCode: account.ifscCode,
                        cancelledChequeImage: account.cancelledChequeImage,
                        updatedAt,
                        updatedBy,
                        updatedByRole
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

