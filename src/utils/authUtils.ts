import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import prisma from "@/lib/prisma";

const SECRET_KEY = process.env.JWT_SECRET || '3792e68ef011e0f236a60627ddf304e1bb64d76d5e4dbebca4579490d3c4e6d8c618456f29aa6f92f8dc3cbd4414362b47d4545ffdc0b9549e43b629c39282bb36b9cff7295fc4269d765d59e4d8a811113b911080878f7647e0329a072afdc06d2ecd658c8e79f2ad04e74dbffc45ed10c850b02afdf10b209989910fadaf7ddbef0bb7d0cff27ed8f4a10d3415420107ddba2d9ac8bcf4f7b3b942b5bbe600d9007f9e88b2451cbfaeaab239677b3ed28eaa860eb40fd5d0e36969b6943a3215d2a9f1125ca06be806f8d73d8ae642c4a29b3a728cf42305e1150e4c1f3ed6e14bd3662531cd14357c6b3f3a57095609811f5e9459307cbe70f9b7a159c8d3';

export function generateToken(adminId: string) {
    return jwt.sign({ adminId }, SECRET_KEY, { expiresIn: '1h' });
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        console.log(`payload - `, payload);
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

// Check if admin exists in the database
export async function isAdminExist(adminId: string) {
    try {
        // Validate if adminId is a valid positive integer
        if (!adminId || isNaN(Number(adminId)) || Number(adminId) <= 0) {
            return { status: false, message: "Invalid admin ID. It must be a positive integer." };
        }

        // Convert adminId to integer
        const adminIdInt = parseInt(adminId, 10);

        // Fetch admin details from database
        const admin = await prisma.admin.findUnique({
            where: { id: adminIdInt },
            select: {
                id: true,
                name: true,
                email: true,
                password: true, // Hashed password stored in DB
                role: true,
            },
        });

        // If admin doesn't exist, return false with a message
        if (!admin) {
            return { status: false, message: "Admin with the provided ID does not exist" };
        }

        // Return admin details if found
        return { status: true, admin };
    } catch (error) {
        console.error("Error fetching admin by ID:", error);
        return { status: false, message: "Internal Server Error" };
    }
}