import { handleLogin } from '../../../controllers/admin/authController';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    return handleLogin(req);
}
