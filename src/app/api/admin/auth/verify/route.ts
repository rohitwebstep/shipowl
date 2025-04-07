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
        const { payload, status, message } = await verifyToken(token);
        if (!status || !payload || typeof payload.adminId !== 'number') {
            return NextResponse.json({ error: message }, { status: 403 });
        }

        // Determine the admin model based on role
        const adminRole = String(payload.adminRole); // Ensure it's a string
        const adminModel = ["admin", "dropshipper", "supplier"].includes(adminRole) ? "admin" : "adminStaff";

        // Fetch the admin from the database
        let admin
        if (adminModel === "admin") {
            admin = await prisma.admin.findUnique({
                where: { id: payload.adminId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });
        } else {
            admin = await prisma.adminStaff.findUnique({
                where: { id: payload.adminId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });
        }

        if (!admin) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        return NextResponse.json({ message: "Token is valid", admin });
    } catch (error) {
        console.error(`error - `, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
