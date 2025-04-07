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

    if (adminProtectedRoutes.some(route => req.url.includes(route))) {
        return adminAuthMiddleware(req);
    }

    return req;  // Continue processing for other routes
}

// Define the matcher for specific routes
export const config = {
    matcher: ["/api/admin/list", "/api/admin/auth/verify"],
};
