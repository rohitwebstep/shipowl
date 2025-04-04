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

        // Verify token and extract user details
        const decodedUser = await verifyToken(token);
        if (!decodedUser || typeof decodedUser.userId !== 'number') {
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        // Determine the user model based on role
        const userModel = ["admin", "dropshipper", "supplier"].includes(decodedUser.userRole) ? "user" : "userStaff";

        // Fetch the user from the database
        const user = await prisma[userModel].findUnique({
            where: { id: decodedUser.userId }, // Primary key lookup
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        return NextResponse.json({ message: "Token is valid", user });
    } catch (error) {
        console.error(`error - `, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
