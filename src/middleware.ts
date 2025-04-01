// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuthMiddleware } from "./middlewares/adminAuth";  // Import admin middleware

export function middleware(req: NextRequest) {
    // Apply adminAuthMiddleware to /api/admin/list route
    if (req.url.includes("/api/admin/list")) {
        return adminAuthMiddleware(req);
    }

    return NextResponse.next();  // Continue processing for other routes
}

// Define the matcher for specific routes
export const config = {
    matcher: [
        "/api/admin/list",
    ],
};
