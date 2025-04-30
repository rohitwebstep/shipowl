// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuthMiddleware } from "./middlewares/adminAuth";

type RouteProtection = {
    routes: string[];
    role: string;
    applicableRoles: string[];
};

// Helper function to determine if a route matches
function routeMatches(url: string, routes: string[]): boolean {
    return routes.some(route => url.includes(route));
}

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Apply CORS headers globally
    res.headers.set("Access-Control-Allow-Origin", "*"); // Replace '*' with allowed domain in production
    res.headers.set("Access-Control-Allow-Methods", "*");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Log request method and URL (optional: remove in production)
    console.log(`req.method: ${req.method}`);
    console.log(`req.url: ${req.url}`);

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: res.headers });
    }

    const pathname = req.nextUrl.pathname;

    const routeProtections: RouteProtection[] = [
        {
            routes: [
                "/api/admin/list",
                "/api/admin/auth/verify"
            ],
            role: "admin",
            applicableRoles: ["admin", "admin_staff"],
        },
        {
            routes: [
                "/api/dropshipper/list",
                "/api/dropshipper/auth/verify",
                "/api/dropshipper/profile",
                "/api/dropshipper/profile/update",
            ],
            role: "dropshipper",
            applicableRoles: ["dropshipper", "dropshipper_staff"],
        },
        {
            routes: [
                "/api/supplier/list",
                "/api/supplier/auth/verify",
                "/api/supplier/profile",
                "/api/supplier/profile/update",
            ],
            role: "supplier",
            applicableRoles: ["supplier", "supplier_staff"],
        },
        {
            routes: [
                "/api/category",
                "/api/category/",
                "/api/brand",
                "/api/brand/",
                "/api/warehouse",
                "/api/warehouse/",
                "/api/location/country",
                "/api/location/country/",
                "/api/location/state",
                "/api/location/state/",
                "/api/location/city",
                "/api/location/city/",
                "/api/product",
                "/api/product/",
                "/api/supplier",
                "/api/dropshipper",
                "/api/dropshipper/",
            ],
            role: "admin",
            applicableRoles: [
                "admin",
                "admin_staff",
                "dropshipper",
                "dropshipper_staff",
                "supplier",
                "supplier_staff",
            ],
        },
    ];

    for (const protection of routeProtections) {
        if (routeMatches(pathname, protection.routes)) {
            console.log(`req.url: matched protected route for role ${protection.role}`);
            return adminAuthMiddleware(req, protection.role, protection.applicableRoles);
        }
    }

    return res; // Proceed to next handler for unprotected routes
}

export const config = {
    matcher: [
        "/api/admin/list",
        "/api/admin/auth/verify",
        "/api/dropshipper/list",
        "/api/dropshipper/auth/verify",
        "/api/supplier/list",
        "/api/supplier/auth/verify",
        "/api/supplier/profile/:path*",
        "/api/dropshipper/profile/:path*",
        "/api/category",
        "/api/category/:path*",
        "/api/brand",
        "/api/brand/:path*",
        "/api/warehouse",
        "/api/warehouse/:path*",
        "/api/location/country",
        "/api/location/country/:path*",
        "/api/location/state",
        "/api/location/state/:path*",
        "/api/location/city",
        "/api/location/city/:path*",
        "/api/product",
        "/api/product/:path*",
        "/api/supplier",
        "/api/dropshipper",
        "/api/dropshipper/:path*",
    ],
};
