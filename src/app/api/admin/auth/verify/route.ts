import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { verifyToken } from '@/utils/authUtils';

export async function GET(req: NextRequest) {
    try {
        // Extract token from Authorization header
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        // Verify token and extract admin details
        const decodedAdmin = await verifyToken(token);
        if (!decodedAdmin || !decodedAdmin.adminId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        // Fetch the admin from the database
        const admin = await prisma.admin.findUnique({
            where: { id: decodedAdmin.adminId }, // Primary key lookup
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });


        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Token is valid", admin });
    } catch (error) {
        console.error(`error - `, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
