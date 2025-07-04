(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__fb7dcd71._.js", {

"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/src/middlewares/adminAuth.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/adminAuthMiddleware.ts
__turbopack_context__.s({
    "adminAuthMiddleware": (()=>adminAuthMiddleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)");
;
;
const SECRET_KEY = process.env.JWT_SECRET || '3792e68ef011e0f236a60627ddf304e1bb64d76d5e4dbebca4579490d3c4e6d8c618456f29aa6f92f8dc3cbd4414362b47d4545ffdc0b9549e43b629c39282bb36b9cff7295fc4269d765d59e4d8a811113b911080878f7647e0329a072afdc06d2ecd658c8e79f2ad04e74dbffc45ed10c850b02afdf10b209989910fadaf7ddbef0bb7d0cff27ed8f4a10d3415420107ddba2d9ac8bcf4f7b3b942b5bbe600d9007f9e88b2451cbfaeaab239677b3ed28eaa860eb40fd5d0e36969b6943a3215d2a9f1125ca06be806f8d73d8ae642c4a29b3a728cf42305e1150e4c1f3ed6e14bd3662531cd14357c6b3f3a57095609811f5e9459307cbe70f9b7a159c8d3';
async function adminAuthMiddleware(req, adminRole, applicableRoles) {
    try {
        // Extract token from Authorization header
        const token = req.headers.get("authorization")?.split(" ")[1];
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access denied. Please log in to continue."
            }, {
                status: 401
            });
        }
        console.log(`Role: ${adminRole}`);
        // Verify token and extract admin details
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, new TextEncoder().encode(SECRET_KEY));
        console.log(`payload:`, payload);
        if (!payload || typeof payload !== 'object' || typeof payload.adminId !== 'number' || typeof payload.adminRole !== 'string') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access forbidden. Invalid token payload."
            }, {
                status: 403
            });
        } else if (!applicableRoles.includes(payload.adminRole)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access denied. Admin privileges required."
            }, {
                status: 403
            });
        }
        console.log(`payload - Admin ID: ${payload.adminId}, Role: ${payload.adminRole}`);
        // Clone the request and set custom headers
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        response.headers.set(`x-${adminRole}-id`, payload.adminId.toString());
        response.headers.set(`x-${adminRole}-role`, payload.adminRole.toString());
        return response;
    } catch (error) {
        console.error(`error - `, error);
        let message = "Authentication failed. Please try again.";
        if (typeof error === "object" && error !== null && "code" in error) {
            const err = error;
            if (err.code === 'ERR_JWT_EXPIRED') {
                message = "Session expired. Please log in again.";
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 401
        });
    }
}
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/middleware.ts
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middlewares$2f$adminAuth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/middlewares/adminAuth.ts [middleware-edge] (ecmascript)");
;
;
// Helper function to check if a pathname matches a route string or pattern
function routeMatches(pathname, routes) {
    return routes.some((route)=>pathname === route || pathname.startsWith(route));
}
function normalizePath(path) {
    return path.startsWith("/") ? path : `/${path}`;
}
// Helper function to check if pathname + method match any skippable route entry
function routeMatchesWithMethod(pathname, method, routes) {
    return routes.some((routeObj)=>{
        if (typeof routeObj === "string") {
            const route = normalizePath(routeObj);
            return pathname === route || pathname.startsWith(route);
        } else {
            const route = normalizePath(routeObj.route);
            const matchesRoute = pathname === route || pathname.startsWith(route);
            if (!matchesRoute) return false;
            if (!routeObj.methods) return true;
            return routeObj.methods.includes(method);
        }
    });
}
function middleware(req) {
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // Apply CORS headers globally
    res.headers.set("Access-Control-Allow-Origin", "*"); // TODO: Replace '*' with actual domain in production
    res.headers.set("Access-Control-Allow-Methods", "*");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // Log request method and URL (for debugging)
    console.log(`req.method: ${req.method}`);
    console.log(`req.url: ${req.url}`);
    // Handle preflight OPTIONS requests quickly
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: res.headers
        });
    }
    const pathname = req.nextUrl.pathname;
    const method = req.method;
    const routeProtections = [
        {
            skip: true,
            routes: [
                "/api/admin/auth/login",
                "/api/dropshipper/auth/login",
                "/api/dropshipper/auth/password/forget",
                "/api/dropshipper/auth/password/reset",
                "/api/dropshipper/auth/registration",
                "/api/supplier/auth/login",
                "/api/supplier/auth/password/forget",
                "/api/supplier/auth/password/reset",
                "/api/supplier/auth/registration",
                {
                    route: "/api/location/country",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "/api/location/country/[countryId]/states",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "/api/location/state",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "/api/location/state/[stateId]/cities",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "/api/location/city",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "/api/brand",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "/api/category",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "api/order/shipping/status",
                    methods: [
                        "GET"
                    ]
                },
                {
                    route: "api/dropshipper/shopify/callback",
                    methods: [
                        "GET"
                    ]
                }
            ]
        },
        {
            skipRoutes: [
                "/api/supplier/auth/verify"
            ],
            routes: [
                "/api/admin",
                "/api/admin/:path*",
                "/api/product",
                "/api/category",
                "/api/brand"
            ],
            role: "admin",
            applicableRoles: [
                "admin",
                "admin_staff"
            ]
        },
        {
            routes: [
                "/api/dropshipper",
                "/api/dropshipper/list",
                "/api/dropshipper/auth/verify",
                "/api/dropshipper/profile",
                "/api/dropshipper/profile/update",
                "/api/dropshipper/product"
            ],
            role: "dropshipper",
            applicableRoles: [
                "dropshipper",
                "dropshipper_staff"
            ]
        },
        {
            routes: [
                "/api/supplier",
                "/api/supplier/",
                "/api/supplier/list",
                "/api/supplier/auth/verify",
                "/api/supplier/profile",
                "/api/supplier/profile/update",
                "/api/supplier/product"
            ],
            role: "supplier",
            applicableRoles: [
                "supplier",
                "supplier_staff"
            ]
        },
        {
            routes: [
                "/api/warehouse",
                "/api/warehouse/",
                "/api/location/country",
                "/api/location/country/",
                "/api/location/state",
                "/api/location/state/",
                "/api/location/city",
                "/api/location/city/",
                "/api/admin/supplier",
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
                "/api/order"
            ],
            role: "admin",
            applicableRoles: [
                "admin",
                "admin_staff",
                "dropshipper",
                "dropshipper_staff",
                "supplier",
                "supplier_staff"
            ]
        }
    ];
    for (const protection of routeProtections){
        // ✅ First skip if 'skip' flag is set and route matches
        if (protection.skip && routeMatchesWithMethod(pathname, method, protection.routes)) {
            return res;
        }
        // ✅ Then skip if pathname+method match any in 'skipRoutes'
        if (protection.skipRoutes && routeMatchesWithMethod(pathname, method, protection.skipRoutes)) {
            return res;
        }
        // ✅ Finally, protect the route
        if (routeMatches(pathname, protection.routes)) {
            if (protection.role && protection.applicableRoles) {
                console.log(`req.url: matched protected route for role ${protection.role}`);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middlewares$2f$adminAuth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["adminAuthMiddleware"])(req, protection.role, protection.applicableRoles);
            }
            break;
        }
    }
    return res; // Proceed normally if no protection or skipped
}
const config = {
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
        "/api/order/:path*"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__fb7dcd71._.js.map