import { NextRequest, NextResponse } from 'next/server';
import { handleVerifyStatus } from '@/app/api/controllers/admin/authController';

export async function POST(req: NextRequest) {
    const adminRole = "dropshipper";
    const adminStaffRole = "dropshipper_staff";
    return handleVerifyStatus(req, adminRole, adminStaffRole);
}