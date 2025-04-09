module.exports = {

"[project]/.next-internal/server/app/api/product/create/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/app/api/product/create/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authUtils.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        // Retrieve x-admin-id from request headers
        const adminId = req.headers.get('x-admin-id');
        const adminRole = req.headers.get('x-admin-role');
        if (!adminId || isNaN(Number(adminId))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User ID is missing or invalid in request'
            }, {
                status: 400
            });
        }
        // 🟡 Extract form-data from the request
        const formData = await req.formData();
        console.log(`formData: `, formData);
        const formDataObj = {};
        formData.forEach((value, key)=>{
            formDataObj[key] = value;
        });
        console.log('Parsed Form Data:', formDataObj);
        // Check if admin exists
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUserExist"])(Number(adminId), String(adminRole));
        if (!result.status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `User Not Found 1: ${result.message}`
            }, {
                status: 404
            });
        }
        const products = [
            {
                name: 'Product 1',
                price: 100,
                description: 'Description 1',
                image: 'image1.jpg',
                category: 'Category 1',
                stock: 10,
                sku: 'SKU1',
                tags: [
                    'tag1',
                    'tag2'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 2',
                price: 150,
                description: 'Description 2',
                image: 'image2.jpg',
                category: 'Category 2',
                stock: 20,
                sku: 'SKU2',
                tags: [
                    'tag3',
                    'tag4'
                ],
                status: 'inactive',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 3',
                price: 200,
                description: 'Description 3',
                image: 'image3.jpg',
                category: 'Category 1',
                stock: 5,
                sku: 'SKU3',
                tags: [
                    'tag1',
                    'tag5'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 4',
                price: 50,
                description: 'Description 4',
                image: 'image4.jpg',
                category: 'Category 3',
                stock: 30,
                sku: 'SKU4',
                tags: [
                    'tag6'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 5',
                price: 120,
                description: 'Description 5',
                image: 'image5.jpg',
                category: 'Category 2',
                stock: 15,
                sku: 'SKU5',
                tags: [
                    'tag3',
                    'tag7'
                ],
                status: 'inactive',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 6',
                price: 250,
                description: 'Description 6',
                image: 'image6.jpg',
                category: 'Category 1',
                stock: 12,
                sku: 'SKU6',
                tags: [
                    'tag2',
                    'tag8'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 7',
                price: 90,
                description: 'Description 7',
                image: 'image7.jpg',
                category: 'Category 4',
                stock: 50,
                sku: 'SKU7',
                tags: [
                    'tag9'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 8',
                price: 180,
                description: 'Description 8',
                image: 'image8.jpg',
                category: 'Category 5',
                stock: 25,
                sku: 'SKU8',
                tags: [
                    'tag10',
                    'tag11'
                ],
                status: 'inactive',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 9',
                price: 160,
                description: 'Description 9',
                image: 'image9.jpg',
                category: 'Category 3',
                stock: 8,
                sku: 'SKU9',
                tags: [
                    'tag4',
                    'tag12'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 10',
                price: 220,
                description: 'Description 10',
                image: 'image10.jpg',
                category: 'Category 2',
                stock: 18,
                sku: 'SKU10',
                tags: [
                    'tag5',
                    'tag13'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 11',
                price: 140,
                description: 'Description 11',
                image: 'image11.jpg',
                category: 'Category 4',
                stock: 35,
                sku: 'SKU11',
                tags: [
                    'tag6',
                    'tag14'
                ],
                status: 'inactive',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 12',
                price: 110,
                description: 'Description 12',
                image: 'image12.jpg',
                category: 'Category 1',
                stock: 40,
                sku: 'SKU12',
                tags: [
                    'tag7',
                    'tag15'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 13',
                price: 300,
                description: 'Description 13',
                image: 'image13.jpg',
                category: 'Category 5',
                stock: 7,
                sku: 'SKU13',
                tags: [
                    'tag8',
                    'tag16'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 14',
                price: 80,
                description: 'Description 14',
                image: 'image14.jpg',
                category: 'Category 3',
                stock: 22,
                sku: 'SKU14',
                tags: [
                    'tag9',
                    'tag17'
                ],
                status: 'inactive',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Product 15',
                price: 130,
                description: 'Description 15',
                image: 'image15.jpg',
                category: 'Category 2',
                stock: 12,
                sku: 'SKU15',
                tags: [
                    'tag10',
                    'tag18'
                ],
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                formDataObj
            }
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch admins'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__b1ac5185._.js.map