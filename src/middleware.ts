// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuthMiddleware } from "./middlewares/adminAuth";

type RouteProtection = {
    skip?: boolean;
    routes: string[];
    role?: string;
    applicableRoles?: string[];
};

// Helper function to determine if a route matches
function routeMatches(pathname: string, routes: string[]): boolean {
    return routes.some(route => pathname === route || pathname.startsWith(route));
}

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Apply CORS headers globally
    res.headers.set("Access-Control-Allow-Origin", "*"); // TODO: Replace '*' with actual domain in production
    res.headers.set("Access-Control-Allow-Methods", "*");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Log request method and URL
    console.log(`req.method: ${req.method}`);
    console.log(`req.url: ${req.url}`);

    // Handle preflight OPTIONS requests
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: res.headers });
    }

    const pathname = req.nextUrl.pathname;

    const routeProtections: RouteProtection[] = [
        {
            skip: true,
            routes: [
                "/api/admin/auth/login",
                "/api/dropshipper/auth/login",
                "/api/dropshipper/auth/registration",
                "/api/supplier/auth/login",
                "/api/supplier/auth/registration",
            ],
        },
        {
            routes: [
                "/api/admin",
                "/api/admin/:path*",
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
                "/api/courier-company",
                "/api/courier-company/:path*",
                "/api/high-rto",
                "/api/high-rto/:path*",
                "/api/good-pincode",
                "/api/good-pincode/:path*",
                "/api/bad-pincode",
                "/api/bad-pincode/:path*",
                "/api/payment",
                "/api/payment/:path*",
                "/api/order",
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
        // Only proceed if the current route group applies to the current URL and isn't skipped
        if (routeMatches(pathname, protection.routes)) {
            if (protection.skip) {
                break; // Skip checking other protections, since it's explicitly marked as skippable
            }

            if (protection.role && protection.applicableRoles) {
                console.log(`req.url: matched protected route for role ${protection.role}`);
                return adminAuthMiddleware(req, protection.role, protection.applicableRoles);
            }

            // If route matches but no auth needed, break to avoid checking others
            break;
        }
    }


    return res; // Proceed to next handler if no match
}

export const config = {
    matcher: [
        "/api/admin",
        "/api/admin/:path*",
        "/api/dropshipper",
        "/api/dropshipper/:path*",
        "/api/supplier",
        "/api/supplier/:path*",
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
        "/api/courier-company",
        "/api/courier-company/:path*",
        "/api/high-rto",
        "/api/high-rto/:path*",
        "/api/good-pincode",
        "/api/good-pincode/:path*",
        "/api/bad-pincode",
        "/api/bad-pincode/:path*",
        "/api/payment",
        "/api/payment/:path*",
        "/api/order",
        "/api/order/:path*",
    ],
};
