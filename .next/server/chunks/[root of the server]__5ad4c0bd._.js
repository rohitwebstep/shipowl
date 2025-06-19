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
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

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
"[externals]/fs/promises [external] (fs/promises, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[project]/src/utils/saveFiles.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "saveFilesFromFormData": (()=>saveFilesFromFormData)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
// Helper: ensure directory exists
async function ensureDir(dirPath) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dirPath)) {
        // console.log(`📁 Directory not found. Creating: ${dirPath}`);
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["mkdir"])(dirPath, {
            recursive: true
        });
    } else {
    // console.log(`✅ Directory already exists: ${dirPath}`);
    }
}
// Helper: generate file name
function generateFileName(originalName, pattern, customName) {
    const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].extname(originalName);
    const base = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].basename(originalName, ext);
    switch(pattern){
        case 'original':
            // console.log(`📝 Using original filename: ${originalName}`);
            return originalName;
        case 'custom':
            const name = `${customName}${ext}`;
            // console.log(`📝 Using custom filename: ${name}`);
            return name;
        case 'slug':
            const slug = base.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const slugName = `${slug}${ext}`;
            // console.log(`📝 Using slug filename: ${slugName}`);
            return slugName;
        case 'slug-unique':
            const unique = `${base.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
            const slugUniqueName = `${unique}${ext}`;
            // console.log(`📝 Using slug-unique filename: ${slugUniqueName}`);
            return slugUniqueName;
        default:
            return originalName;
    }
}
async function saveFilesFromFormData(formData, fieldName, options) {
    const { dir, pattern, customName, multiple = false } = options;
    // console.log(`🚀 Starting file save from field: "${fieldName}"`);
    await ensureDir(dir);
    const result = multiple ? [] : null;
    const files = formData.getAll(fieldName).filter((item)=>item instanceof File && item.name);
    // console.log(`📦 Total files to process: ${files.length}`);
    for(let index = 0; index < files.length; index++){
        const file = files[index];
        // console.log(`📄 Processing file ${index + 1}: ${file.name}`);
        const nameToUse = pattern === 'custom' && multiple ? `${customName}-${index + 1}` : pattern === 'custom' ? customName : file.name;
        const finalFileName = generateFileName(nameToUse, pattern, nameToUse);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dir, finalFileName);
        // console.log(`💾 Saving file to: ${fullPath}`);
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["writeFile"])(fullPath, buffer);
        // console.log(`✅ Saved file ${file.name} as ${finalFileName}`);
        const fileUrl = fullPath.split('public')[1].replace(/\\/g, '/');
        const info = {
            originalName: file.name,
            savedAs: finalFileName,
            size: file.size,
            type: file.type,
            url: `/uploads${fileUrl}`
        };
        // console.log(`📁 File saved info:`, info);
        if (multiple) {
            result.push(info);
        } else {
            return info;
        }
    }
    // console.log(`🎉 All files processed.`);
    return result;
}
}}),
"[project]/src/utils/validateFormData.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "validateFormData": (()=>validateFormData)
});
function validateFormData(formData, { requiredFields = [], patternValidations = {} }) {
    const errors = [];
    // ✅ Required fields check
    for (const field of requiredFields){
        const value = formData.get(field);
        if (value === null || value === '' || typeof value === 'string' && value.trim() === '') {
            errors.push(`Field "${field}" is required`);
        }
    }
    // ✅ Type pattern check (only if field exists)
    for (const [field, expectedType] of Object.entries(patternValidations)){
        const value = formData.get(field);
        if (value !== null) {
            const val = typeof value === 'string' ? value.trim() : value;
            if (expectedType === 'number' && isNaN(Number(val)) || expectedType === 'boolean' && ![
                'true',
                'false',
                '1',
                '0',
                true,
                false,
                1,
                0
            ].includes(val.toString().toLowerCase())) {
                errors.push(`Field "${field}" must be of type ${expectedType}`);
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
}}),
"[project]/src/app/api/models/product.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createProduct": (()=>createProduct),
    "generateProductSlug": (()=>generateProductSlug)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
async function generateProductSlug(name) {
    let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let isSlugTaken = true;
    let suffix = 0;
    // Keep checking until an unused slug is found
    while(isSlugTaken){
        const existingProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.findUnique({
            where: {
                slug
            }
        });
        if (existingProduct) {
            // If the slug already exists, add a suffix (-1, -2, etc.)
            suffix++;
            slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${suffix}`;
        } else {
            // If the slug is not taken, set isSlugTaken to false to exit the loop
            isSlugTaken = false;
        }
    }
    return slug;
}
async function createProduct(adminId, product) {
    try {
        const { name, description, price, quantity, status, image } = product;
        // Generate a unique slug for the product
        const slug = await generateProductSlug(name);
        const newProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.create({
            data: {
                name,
                description,
                price,
                quantity,
                status,
                slug,
                image,
                createdAt: new Date(),
                createdBy: adminId
            }
        });
        return {
            status: true,
            product: newProduct
        };
    } catch (error) {
        console.error(`Error creating product:`, error);
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/authUtils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$saveFiles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/saveFiles.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$validateFormData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/validateFormData.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$models$2f$product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/models/product.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function POST(req) {
    try {
        // Get headers
        const adminIdHeader = req.headers.get("x-admin-id");
        const adminRole = req.headers.get("x-admin-role");
        const adminId = Number(adminIdHeader);
        if (!adminIdHeader || isNaN(adminId)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User ID is missing or invalid in request"
            }, {
                status: 400
            });
        }
        // Check if admin exists
        const userCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUserExist"])(adminId, String(adminRole));
        if (!userCheck.status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `User Not Found: ${userCheck.message}`
            }, {
                status: 404
            });
        }
        const isMultipleImages = false; // Set true to allow multiple image uploads
        const formData = await req.formData();
        // Validate input
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$validateFormData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateFormData"])(formData, {
            requiredFields: [
                'name',
                'price',
                'quantity'
            ],
            patternValidations: {
                price: 'number',
                quantity: 'number',
                status: 'boolean'
            }
        });
        if (!validation.isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: validation.errors
            }, {
                status: 400
            });
        }
        // Extract fields
        const name = formData.get('name');
        const description = formData.get('description') || '';
        const price = parseFloat(formData.get('price'));
        const quantity = parseInt(formData.get('quantity'), 10);
        const statusRaw = formData.get('status')?.toString().toLowerCase();
        const status = statusRaw === 'true' || statusRaw === '1';
        // File upload
        const uploadDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'tmp', 'uploads', 'products');
        const fileData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$saveFiles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveFilesFromFormData"])(formData, 'image', {
            dir: uploadDir,
            pattern: 'slug-unique',
            multiple: isMultipleImages
        });
        const image = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : fileData.url;
        const productPayload = {
            name,
            description,
            price,
            quantity,
            status,
            image
        };
        console.log("📦 productPayload:", productPayload);
        const productCreateResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$models$2f$product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createProduct"])(adminId, productPayload);
        if (productCreateResult?.status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                product: productCreateResult.product
            }, {
                status: 200
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: productCreateResult?.message || 'Product creation failed'
        }, {
            status: 500
        });
    } catch (err) {
        console.error('❌ Product Creation Error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: err.message || 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__5ad4c0bd._.js.map