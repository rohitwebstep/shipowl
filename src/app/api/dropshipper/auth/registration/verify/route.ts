import { NextRequest } from 'next/server';
import { handleVerifyStatus } from '@/app/api/controllers/admin/authController';

export async function PATCH(req: NextRequest) {
    const adminRole = "dropshipper";
    const adminStaffRole = "dropshipper_staff";
    return handleVerifyStatus(req, adminRole, adminStaffRole);
}