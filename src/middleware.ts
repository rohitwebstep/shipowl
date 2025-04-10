// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuthMiddleware } from "./middlewares/adminAuth";  // Import admin middleware

export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    // Apply CORS headers globally
    res.headers.set("Access-Control-Allow-Origin", "*");  // Change '*' to your frontend URL in production
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: res.headers });
    }

    // Apply adminAuthMiddleware to /api/admin/list route
    const adminProtectedRoutes = ["/api/admin/list", "/api/admin/auth/verify"];
    const dropshipperProtectedRoutes = ["/api/dropshipper/list", "/api/dropshipper/auth/verify"];
    const supplierProtectedRoutes = ["/api/supplier/list", "/api/supplier/auth/verify"];
    const restProtectedRoutes = ["/api/product/create", "/api/category", "/api/category/:path*"];

    if (adminProtectedRoutes.some(route => req.url.includes(route))) {
        const applicableRoles = ["admin", "admin_staff"];
        const adminRole = "admin";
        return adminAuthMiddleware(req, adminRole, applicableRoles);
    }

    if (dropshipperProtectedRoutes.some(route => req.url.includes(route))) {
        const applicableRoles = ["dropshipper", "dropshipper_staff"];
        const adminRole = "dropshipper";
        return adminAuthMiddleware(req, adminRole, applicableRoles);
    }

    if (supplierProtectedRoutes.some(route => req.url.includes(route))) {
        const applicableRoles = ["supplier", "supplier_staff"];
        const adminRole = "supplier";
        return adminAuthMiddleware(req, adminRole, applicableRoles);
    }

    if (restProtectedRoutes.some(route => req.url.includes(route))) {
        const applicableRoles = ["admin", "admin_staff", "dropshipper", "dropshipper_staff", "supplier", "supplier_staff"];
        const adminRole = "admin";
        return adminAuthMiddleware(req, adminRole, applicableRoles);
    }

    return req;  // Continue processing for other routes
}

// Define the matcher for specific routes
export const config = {
    matcher: ["/api/admin/list", "/api/admin/auth/verify", "/api/dropshipper/list", "/api/dropshipper/auth/verify", "/api/supplier/list", "/api/supplier/auth/verify", "/api/product/create", "/api/category", "/api/category/:path*"],
};
