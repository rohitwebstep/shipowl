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

        // Fetch admin by email and role
        let adminResponse = await adminByUsernameRole(email, 'admin');
        if (!adminResponse.status || !adminResponse.admin) {
            adminResponse = await adminByUsernameRole(email, 'admin_staff');
            if (!adminResponse.status || !adminResponse.admin) {
                adminResponse = await adminByUsernameRole(email, 'admin_staff');
                return NextResponse.json({ error: adminResponse.message || "Invalid email or password" }, { status: 401 });
            }
        }

        const admin = adminResponse.admin;

        // Compare the provided password with the stored hash
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate authentication token
        const token = generateToken(admin.id, admin.role);
        return NextResponse.json({
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error(`Error during login:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function adminByUsernameRole(adminname: string, role: string) {
    try {

        const adminRoleStr = String(role); // Ensure it's a string
        const adminModel = ["admin", "dropshipper", "supplier"].includes(adminRoleStr) ? "admin" : "adminStaff";

        // Fetch admin details from database
        let admin
        if (adminModel === "admin") {
            admin = await prisma.admin.findFirst({
                where: { email: adminname, role },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true, // Hashed password stored in DB
                    role: true,
                },
            });
        } else {
            admin = await prisma.adminStaff.findFirst({
                where: { email: adminname, role },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true,
                },
            });
        }

        // If admin doesn't exist, return false with a message
        if (!admin) {
            return { status: false, message: "User with the provided ID does not exist" };
        }

        return { status: true, admin };
    } catch (error) {
        console.error(`Error fetching admin:`, error);
        return { status: false, message: "Internal Server Error" };
    }
}
