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

        // Fetch user by email and role
        const userResponse = await userByUsernameRole(email, 'admin');
        console.log(`userResponse - `, userResponse);
        if (!userResponse.status || !userResponse.user) {
            return NextResponse.json({ error: userResponse.message || "Invalid email or password" }, { status: 401 });
        }

        const user = userResponse.user;

        // Compare the provided password with the stored hash
        const isPasswordValid = await comparePassword(password, user.password);
        console.log(`isPasswordValid - `, isPasswordValid);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate authentication token
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
        console.error(`Error during login:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function userByUsernameRole(username: string, role: string) {
    try {

        const userRoleStr = String(role); // Ensure it's a string
        const userModel = ["admin", "dropshipper", "supplier"].includes(userRoleStr) ? "user" : "userStaff";

        // Fetch user details from database
        let user
        console.log(`userModel - `, userModel);
        if (userModel === "user") {
            user = await prisma.user.findFirst({
                where: { email: username, role },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true, // Hashed password stored in DB
                    role: true,
                },
            });
        } else {
            user = await prisma.userStaff.findFirst({
                where: { email: username, role },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true,
                },
            });
        }

        // If user doesn't exist, return false with a message
        if (!user) {
            return { status: false, message: "User with the provided ID does not exist" };
        }

        return { status: true, user };
    } catch (error) {
        console.error(`Error fetching user:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}
