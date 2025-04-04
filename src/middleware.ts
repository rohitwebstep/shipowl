// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { userAuthMiddleware } from "./middlewares/userAuth";  // Import user middleware

export function middleware(req: NextRequest) {
    // Apply userAuthMiddleware to /api/user/list route
    if (req.url.includes("/api/user/list")) {
        return userAuthMiddleware(req);
    }

    return NextResponse.next();  // Continue processing for other routes
}

// Define the matcher for specific routes
export const config = {
    matcher: [
        "/api/user/list",
    ],
};
