// src/adminAuthMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isAdminExist } from "@/utils/authUtils";

export async function adminAuthMiddleware(req: NextRequest) {
    try {
        // Extract token from Authorization header
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify token and extract admin details
        const decodedAdmin = await verifyToken(token);
        if (!decodedAdmin || typeof decodedAdmin !== 'object' || typeof decodedAdmin.adminId !== 'number') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Check if admin exists
        const result = await isAdminExist(decodedAdmin.adminId);
        if (!result.status) {
            return NextResponse.json({ error: `Admin Not Found 1: ${result.message}` }, { status: 404 });
        }

        // Clone the request and set custom headers
        const response = NextResponse.next();
        response.headers.set("x-admin-id", decodedAdmin.adminId.toString());

        return response;
    } catch (error) {
        console.error(`error - `, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
