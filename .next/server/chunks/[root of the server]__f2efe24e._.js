module.exports = {

"[project]/.next-internal/server/app/api/admin/auth/login/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
async function connectToDatabase() {
    try {
        // Attempt to connect to the database
        await prisma.$connect();
        console.log("Database connection established successfully.");
    } catch (error) {
        // If connection fails, log the error
        console.error("Database connection failed:", error);
        // Avoid using process.exit in Edge Runtime
        // Instead, you can throw an error to be handled by the calling code
        throw new Error("Database connection failed");
    }
}
connectToDatabase().catch((error)=>{
    // Handle any unhandled promise rejections here, if necessary
    console.error(error);
// You can choose to return a response or perform other actions instead of exiting
});
const __TURBOPACK__default__export__ = prisma;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/src/utils/authUtils.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "generateToken": (()=>generateToken),
    "isUserExist": (()=>isUserExist),
    "verifyToken": (()=>verifyToken)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
const SECRET_KEY = process.env.JWT_SECRET || '3792e68ef011e0f236a60627ddf304e1bb64d76d5e4dbebca4579490d3c4e6d8c618456f29aa6f92f8dc3cbd4414362b47d4545ffdc0b9549e43b629c39282bb36b9cff7295fc4269d765d59e4d8a811113b911080878f7647e0329a072afdc06d2ecd658c8e79f2ad04e74dbffc45ed10c850b02afdf10b209989910fadaf7ddbef0bb7d0cff27ed8f4a10d3415420107ddba2d9ac8bcf4f7b3b942b5bbe600d9007f9e88b2451cbfaeaab239677b3ed28eaa860eb40fd5d0e36969b6943a3215d2a9f1125ca06be806f8d73d8ae642c4a29b3a728cf42305e1150e4c1f3ed6e14bd3662531cd14357c6b3f3a57095609811f5e9459307cbe70f9b7a159c8d3';
function generateToken(adminId, adminRole) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        adminId,
        adminRole
    }, SECRET_KEY, {
        expiresIn: '1h'
    });
}
async function verifyToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, new TextEncoder().encode(SECRET_KEY));
        return {
            payload,
            status: true,
            message: "Token is valid"
        };
    } catch (error) {
        let message = "Authentication failed. Please try again.";
        if (typeof error === "object" && error !== null && "code" in error) {
            const err = error;
            if (err.code === 'ERR_JWT_EXPIRED') {
                message = "Session expired. Please log in again.";
            }
        }
        return {
            payload: null,
            status: false,
            message
        };
    }
}
async function isUserExist(adminId, adminRole) {
    try {
        const adminRoleStr = String(adminRole); // Ensure it's a string
        const adminModel = [
            "admin",
            "dropshipper",
            "supplier"
        ].includes(adminRoleStr) ? "admin" : "adminStaff";
        // Fetch admin details from database
        let admin;
        if (adminModel === "admin") {
            admin = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.findUnique({
                where: {
                    id: adminId,
                    role: adminRoleStr
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true
                }
            });
        } else {
            admin = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaff.findUnique({
                where: {
                    id: adminId,
                    role: adminRoleStr
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true
                }
            });
        }
        // If admin doesn't exist, return false with a message
        if (!admin) {
            return {
                status: false,
                message: "User with the provided ID does not exist"
            };
        }
        // Return admin details if found
        return {
            status: true,
            admin
        };
    } catch (error) {
        console.error("Error fetching admin by ID:", error);
        return {
            status: false,
            message: "Internal Server Error"
        };
    }
}
}}),
"[project]/src/utils/hashUtils.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "comparePassword": (()=>comparePassword),
    "hashPassword": (()=>hashPassword)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
async function hashPassword(password) {
    const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, salt);
}
async function comparePassword(password, hashedPassword) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hashedPassword);
}
}}),
"[project]/src/app/api/controllers/admin/authController.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "adminByUsernameRole": (()=>adminByUsernameRole),
    "handleLogin": (()=>handleLogin),
    "handleVerifyLogin": (()=>handleVerifyLogin)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authUtils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$hashUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/hashUtils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
async function handleLogin(req, adminRole, adminStaffRole) {
    try {
        const { email, password } = await req.json();
        // Hash the password using bcrypt
        const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10); // Generates a salt with 10 rounds
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, salt);
        console.log(`Hashed Password: ${hashedPassword}`); // Log the hashed password
        // Fetch admin by email and role
        let adminResponse = await adminByUsernameRole(email, adminRole);
        if (!adminResponse.status || !adminResponse.admin) {
            adminResponse = await adminByUsernameRole(email, adminStaffRole);
            if (!adminResponse.status || !adminResponse.admin) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: adminResponse.message || "Invalid email or password",
                    status: false
                }, {
                    status: 401
                });
            }
        }
        const admin = adminResponse.admin;
        // Compare the provided password with the stored hash
        const isPasswordValid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$hashUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["comparePassword"])(password, admin.password);
        if (!isPasswordValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Invalid email or password',
                status: false
            }, {
                status: 401
            });
        }
        // Generate authentication token
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])(admin.id, admin.role);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error(`Error during login:`, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal Server Error",
            status: false
        }, {
            status: 500
        });
    }
}
async function handleVerifyLogin(req, adminRole, adminStaffRole) {
    try {
        // Extract token from Authorization header
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'No token provided',
                status: false
            }, {
                status: 401
            });
        }
        // Verify token and extract admin details
        const { payload, status, message } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!status || !payload || typeof payload.adminId !== 'number') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: message,
                status: false
            }, {
                status: 403
            });
        }
        // Determine the admin model based on role
        const payloadAdminRole = String(payload.adminRole); // Ensure it's a string
        if (![
            adminRole,
            adminStaffRole
        ].includes(payloadAdminRole)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Access denied. Invalid role.",
                status: false
            }, {
                status: 403
            });
        }
        const adminModel = [
            "admin",
            "dropshipper",
            "supplier"
        ].includes(payloadAdminRole) ? "admin" : "adminStaff";
        // Fetch the admin from the database
        let admin;
        if (adminModel === "admin") {
            admin = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.findUnique({
                where: {
                    id: payload.adminId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
        } else {
            admin = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaff.findUnique({
                where: {
                    id: payload.adminId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
        }
        if (!admin) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Invalid email or password",
                status: false
            }, {
                status: 401
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Token is valid",
            admin,
            status: true
        });
    } catch (error) {
        console.error(`error - `, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal Server Error",
            status: false
        }, {
            status: 500
        });
    }
}
async function adminByUsernameRole(username, role) {
    try {
        const adminRoleStr = String(role); // Ensure it's a string
        const adminModel = [
            "admin",
            "dropshipper",
            "supplier"
        ].includes(adminRoleStr) ? "admin" : "adminStaff";
        // Fetch admin details from database
        let admin;
        if (adminModel === "admin") {
            admin = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.findFirst({
                where: {
                    email: username,
                    role
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true
                }
            });
        } else {
            admin = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaff.findFirst({
                where: {
                    email: username,
                    role
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true
                }
            });
        }
        // If admin doesn't exist, return false with a message
        if (!admin) {
            return {
                status: false,
                message: "User with the provided ID does not exist"
            };
        }
        return {
            status: true,
            admin
        };
    } catch (error) {
        console.error(`Error fetching admin:`, error);
        return {
            status: false,
            message: "Internal Server Error"
        };
    }
}
}}),
"[project]/src/app/api/admin/auth/login/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$controllers$2f$admin$2f$authController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/controllers/admin/authController.ts [app-route] (ecmascript)");
;
async function POST(req) {
    const adminRole = "admin";
    const adminStaffRole = "admin_staff";
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$controllers$2f$admin$2f$authController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleLogin"])(req, adminRole, adminStaffRole);
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__f2efe24e._.js.map