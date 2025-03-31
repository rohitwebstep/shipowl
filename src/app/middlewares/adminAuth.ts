import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/authUtils';

export function middleware(req: NextRequest) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/protected/:path*'], // Protect only specific routes
};
