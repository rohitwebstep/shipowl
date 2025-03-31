import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/authUtils';

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    console.log(`decoded - `, decoded);
    if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Token is valid', userId: decoded.userId, user: decoded });
}
