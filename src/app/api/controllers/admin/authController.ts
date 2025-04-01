import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { generateToken } from '@/utils/authUtils';
import { comparePassword } from '@/utils/hashUtils';
import bcrypt from 'bcryptjs';

export async function handleLogin(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Fetch the admin by email from the database
        const admin = await prisma.admin.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true, // Hashed password stored in DB
                role: true,
            },
        });

        if (!admin) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(`Hashed Password: ${hashedPassword}`); // Log the hashed password

        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = generateToken(admin.id);
        return NextResponse.json({
            message: "Login successful",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error(`error - `, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
