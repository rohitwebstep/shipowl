import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { generateToken } from '@/utils/authUtils';
import { comparePassword } from '@/utils/hashUtils';
import { verifyToken } from '@/utils/authUtils';
import bcrypt from 'bcryptjs';

export async function handleLogin(req: NextRequest, adminRole: string, adminStaffRole: string) {
    try {
        const { email, password } = await req.json();

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(`Hashed Password: ${hashedPassword}`); // Log the hashed password

        // Fetch admin by email and role
        let adminResponse = await adminByUsernameRole(email, adminRole);
        if (!adminResponse.status || !adminResponse.admin) {
            adminResponse = await adminByUsernameRole(email, adminStaffRole);
            if (!adminResponse.status || !adminResponse.admin) {
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

export async function handleVerifyLogin(req: NextRequest, adminRole: string, adminStaffRole: string) {
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
        const payloadAdminRole = String(payload.adminRole); // Ensure it's a string

        if (![adminRole, adminStaffRole].includes(payloadAdminRole)) {
            return NextResponse.json({ error: "Access denied. Invalid role." }, { status: 403 });
        }

        const adminModel = ["admin", "dropshipper", "supplier"].includes(payloadAdminRole) ? "admin" : "adminStaff";

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
