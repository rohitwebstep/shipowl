import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { generateToken } from '@/utils/authUtils';
import { comparePassword } from '@/utils/hashUtils';
import bcrypt from 'bcryptjs';

export async function handleLogin(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(`Hashed Password: ${hashedPassword}`); // Log the hashed password

        // Fetch the user by email from the database
        let user = await prisma.User.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true, // Hashed password stored in DB
                role: true,
            },
        });

        if (!user) {
            user = await prisma.UserStaff.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true,
                },
            });

            if (!user) {
                return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
            }
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = generateToken(user.id, user.role);
        return NextResponse.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(`error - `, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
