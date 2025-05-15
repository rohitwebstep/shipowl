import { getPermissionsOfAdminStaff } from "@/app/models/admin/permission";
import { isUserExist } from "@/utils/auth/authUtils";
import { logMessage } from "@/utils/commonUtils";

interface PermissionCheckParams {
    admin_id: number;
    panel: string;
    role: string;
    module: string;
    action: string;
}

interface PermissionCheckResult {
    status: boolean;
    message: string;
}

export async function checkAdminPermission({
    admin_id,
    panel,
    role,
    module,
    action
}: PermissionCheckParams): Promise<PermissionCheckResult> {

    // Check if the user exists
    const userCheck = await isUserExist(admin_id, role);
    if (!userCheck.status) {
        logMessage('warn', `User not found: ${userCheck.message}`);
        return {
            status: false,
            message: `Permission denied for action "${action}" on module "${module}" - User not found.`
        };
    }

    const getPermissionsOfAdminResult = await getPermissionsOfAdminStaff(admin_id);
    if (getPermissionsOfAdminResult.status && Array.isArray(getPermissionsOfAdminResult.permissions)) {
        const hasPermission = getPermissionsOfAdminResult.permissions.some((perm) => {
            return (
                perm.permission &&
                perm.permission.panel === panel &&
                perm.permission.module === module &&
                perm.permission.action === action &&
                perm.permission.status === true
            );
        });

        if (hasPermission) {
            return {
                status: true,
                message: `Permission granted for action "${action}" on module "${module}".`
            };
        } else {
            return {
                status: false,
                message: `Permission denied for action "${action}" on module "${module}".`
            };
        }
    }

    return {
        status: false,
        message: `Permission denied for action "${action}" on module "${module}" - No permissions found.`
    };
}
