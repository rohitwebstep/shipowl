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
"[externals]/fs/promises [external] (fs/promises, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

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
            if (expectedType === 'number' && isNaN(Number(val)) || expectedType === 'boolean' && !(val === 'true' || val === 'false')) {
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
"[project]/src/app/api/product/create/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$saveFiles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/saveFiles.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$validateFormData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/validateFormData.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
async function POST(req) {
    try {
        const isMultipleImages = false; // Set to true if you want to allow multiple images
        const formData = await req.formData();
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
        const name = formData.get('name');
        const description = formData.get('description');
        const price = parseFloat(formData.get('price'));
        const quantity = parseInt(formData.get('quantity'), 10);
        const status = formData.get('status') === 'true';
        const uploadPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'tmp', 'uploads', 'products');
        const fileData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$saveFiles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveFilesFromFormData"])(formData, 'image', {
            dir: uploadPath,
            pattern: 'slug-unique',
            multiple: isMultipleImages
        });
        // Create a final string of URLs separated by commas in both conditions
        const urls = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : fileData.url;
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        } else {
            console.log(`isMultipleImages - `, isMultipleImages);
            console.log(`fileData - `, fileData);
            console.log('Final URLs:', urls);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            files: fileData
        });
    } catch (err) {
        console.error('❌ File Save Error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'File upload failed'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__a4fc73c4._.js.map