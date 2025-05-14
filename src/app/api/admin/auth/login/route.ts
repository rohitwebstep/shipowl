// import { checkAdminPermission } from '@/utils/auth/checkAdminPermission';
import { handleLogin } from '../../../controllers/admin/authController';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const adminRole = "admin";
    const adminStaffRole = "admin_staff";

    /*
    const result = await checkAdminPermission({
        admin_id: 1,
        admin_type: "main",
        panel: "admin",
        role: "admin",
        module: "admin",
        action: "create"
    });
    */

    return handleLogin(req, adminRole, adminStaffRole);
}
