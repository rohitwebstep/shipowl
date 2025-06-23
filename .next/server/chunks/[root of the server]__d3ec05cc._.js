module.exports = {

"[project]/.next-internal/server/app/api/dropshipper/auth/login/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
"[project]/src/lib/prisma.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
(()=>{
    const e = new Error("Cannot find module '../../prisma/prisma/generated/client'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
const prisma = new PrismaClient();
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
"[project]/src/utils/auth/authUtils.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "generatePasswordResetToken": (()=>generatePasswordResetToken),
    "generateRegistrationToken": (()=>generateRegistrationToken),
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
    console.log(`adminId: ${adminId}, adminRole: ${adminRole}`);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        adminId,
        adminRole
    }, SECRET_KEY, {
        expiresIn: '3h'
    });
}
function generatePasswordResetToken(adminId, adminRole) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        adminId,
        adminRole
    }, SECRET_KEY, {
        expiresIn: '1h'
    });
}
function generateRegistrationToken(adminId, adminRole) {
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
                    role: true,
                    admin: true
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
"[project]/src/app/models/admin/emailConfig.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getEmailConfig": (()=>getEmailConfig)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
const getEmailConfig = async (panel, module, action, status = true // Default value is true
)=>{
    try {
        console.log(`Fetching email configuration for panel: ${panel}, module: ${module}, action: ${action}, status: ${status}`);
        // Fetching the email configuration from the database based on conditions
        const emailConfig = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].emailConfig.findFirst({
            where: {
                panel,
                module,
                action,
                status
            },
            orderBy: {
                id: "desc"
            }
        });
        if (!emailConfig) {
            return {
                status: false,
                message: "Email configuration not found"
            };
        }
        // Mapping the database result to the desired output format
        const config = {
            host: emailConfig.smtp_host,
            port: emailConfig.smtp_port,
            secure: emailConfig.smtp_secure,
            username: emailConfig.smtp_username,
            password: emailConfig.smtp_password,
            from_email: emailConfig.from_email,
            from_name: emailConfig.from_name
        };
        return {
            status: true,
            emailConfig: config,
            htmlTemplate: emailConfig.html_template,
            subject: emailConfig.subject
        };
    } catch (error) {
        console.error(`Error fetching email configuration for panel "${panel}", module "${module}", action "${action}":`, error);
        return {
            status: false,
            message: "Error fetching email configuration"
        };
    }
};
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/dns [external] (dns, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/child_process [external] (child_process, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}}),
"[project]/src/utils/email/sendEmail.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "sendEmail": (()=>sendEmail)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
;
async function sendEmail(config, mailData) {
    const { host, port, secure, username, password, from_email, from_name } = config;
    const { recipient = [], cc = [], bcc = [], subject, htmlBody, attachments = [] } = mailData;
    const formatAddressList = (list)=>Array.isArray(list) ? list.map(({ name, email })=>`${name} <${email}>`) : [];
    const formatAttachments = (list)=>list.map(({ name, path })=>({
                filename: name,
                path: path
            }));
    try {
        const transporter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
            host,
            port: Number(port),
            secure,
            auth: {
                user: username,
                pass: password
            }
        });
        const mailOptions = {
            from: `${from_name} <${from_email}>`,
            to: formatAddressList(recipient),
            cc: formatAddressList(cc),
            bcc: formatAddressList(bcc),
            subject,
            html: htmlBody,
            attachments: formatAttachments(attachments)
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`📤 Email sent to ${mailOptions.to.join(", ")} | ID: ${info.messageId}`);
        return {
            status: true,
            messageId: info.messageId
        };
    } catch (error) {
        // Specify a type other than 'any' for the error
        if (error instanceof Error) {
            console.error("❌ Email Error:", error.message);
            return {
                status: false,
                error: error.message
            };
        } else {
            console.error("❌ Unknown Error:", error);
            return {
                status: false,
                error: "Unknown error occurred"
            };
        }
    }
}
}}),
"[project]/src/utils/commonUtils.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ActivityLog": (()=>ActivityLog),
    "fetchLogInfo": (()=>fetchLogInfo),
    "logMessage": (()=>logMessage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ua$2d$parser$2d$js$2f$src$2f$main$2f$ua$2d$parser$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/ua-parser-js/src/main/ua-parser.mjs [app-route] (ecmascript)");
;
;
async function logMessage(type, message, item) {
    try {
        const isDev = process.env.DEBUG === 'true' || ("TURBOPACK compile-time value", "development") === 'development';
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        const logWithMessage = (logFn, prefix = '')=>{
            if (item !== undefined) {
                logFn(`${prefix}${message}`, item);
            } else {
                logFn(`${prefix}${message}`);
            }
        };
        switch(type.toLowerCase()){
            case 'error':
                logWithMessage(console.error, '❌ ');
                break;
            case 'warn':
                logWithMessage(console.warn, '⚠️ ');
                break;
            case 'info':
                logWithMessage(console.info, 'ℹ️ ');
                break;
            case 'debug':
                logWithMessage(console.debug, '🔍 ');
                break;
            case 'log':
                logWithMessage(console.log);
                break;
            case 'trace':
                logWithMessage(console.trace, '🔍 ');
                break;
            case 'table':
                if (item !== undefined) console.table(item);
                break;
            case 'group':
                console.group(message);
                break;
            case 'groupend':
                console.groupEnd();
                break;
            default:
                logWithMessage(console.log, '📌 ');
                break;
        }
    } catch (error) {
        console.error('❌ Error in logMessage:', error);
    }
}
async function ActivityLog(params) {
    try {
        const { adminId, adminRole, module, action, endpoint, method, payload, response, result, data, ipv4, ipv6, internetServiceProvider, clientInformation, userAgent } = params;
        // Save the activity log to the database
        const activityLog = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].activityLog.create({
            data: {
                adminId,
                adminRole,
                module,
                action,
                endpoint,
                method,
                payload: JSON.stringify(payload),
                response: JSON.stringify(response),
                result,
                data: data ? JSON.stringify(data) : null,
                ipv4,
                ipv6,
                internetServiceProvider,
                clientInformation,
                userAgent
            }
        });
        console.info('Activity Log saved successfully:', activityLog);
    } catch (error) {
        console.error('❌ Error saving activity log:', error);
    }
}
async function fetchLogInfo(module, action, req) {
    try {
        // Get the IP address from the 'x-forwarded-for' header or fallback to 'host' header
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : req.headers.get('host');
        // Construct the full URL
        const protocol = req.headers.get('x-forwarded-proto') || 'http'; // Default to 'http' if missing
        const host = req.headers.get('host'); // Get host from headers
        const url = `${protocol}://${host}${req.nextUrl.pathname}${req.nextUrl.search || ''}`; // Build complete URL
        // Get the HTTP method and the payload if applicable (POST, PUT, PATCH)
        const method = req.method;
        let payload = null;
        if ([
            'POST',
            'PUT',
            'PATCH'
        ].includes(method)) {
            try {
                payload = await req.json(); // Parse JSON payload
            } catch (error) {
                console.error('❌ Error parsing request body:', error);
            }
        }
        // Parse the User-Agent string for client details
        const userAgent = req.headers.get('user-agent') || 'Unknown';
        const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ua$2d$parser$2d$js$2f$src$2f$main$2f$ua$2d$parser$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UAParser"](userAgent);
        const clientInfo = parser.getResult();
        // Extract browser, OS, and device details
        const { browser, os, device } = clientInfo;
        const browserName = browser.name || 'Unknown Browser';
        const browserVersion = browser.version || 'Unknown Version';
        const osName = os.name || 'Unknown OS';
        const osVersion = os.version || 'Unknown OS Version';
        const deviceType = device.type || 'Unknown Device';
        // Log the gathered information
        const logInfo = {
            module,
            action,
            url,
            method,
            payload,
            response: true,
            result: [],
            data: [],
            ipAddress,
            clientInfo: {
                browser: browserName,
                browserVersion,
                os: osName,
                osVersion,
                device: deviceType
            },
            userAgent
        };
        // Example of logging the activity info
        logMessage('info', `Activity log Info:`, logInfo);
    } catch (error) {
        console.error('❌ Error saving activity log:', error);
    }
}
}}),
"[project]/src/app/models/staffPermission.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "checkStaffPermissionStatus": (()=>checkStaffPermissionStatus),
    "getStaffPermissions": (()=>getStaffPermissions),
    "getStaffPermissionsByStaffId": (()=>getStaffPermissionsByStaffId)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
const serializeBigInt = (obj)=>{
    if (typeof obj === "bigint") return obj.toString();
    if (obj instanceof Date) return obj;
    if (Array.isArray(obj)) return obj.map(serializeBigInt);
    if (obj && typeof obj === "object") {
        return Object.fromEntries(Object.entries(obj).map(([key, value])=>[
                key,
                serializeBigInt(value)
            ]));
    }
    return obj;
};
const getStaffPermissions = async (filter = {})=>{
    try {
        const staffPermissions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaffPermission.findMany({
            where: {
                ...filter.panel && {
                    panel: filter.panel
                },
                ...filter.module && {
                    module: filter.module
                },
                ...filter.action && {
                    action: filter.action
                }
            },
            orderBy: {
                id: "desc"
            }
        });
        return {
            status: true,
            staffPermissions: serializeBigInt(staffPermissions)
        };
    } catch (error) {
        console.error("❌ getStaffPermissions Error:", error);
        return {
            status: false,
            message: "Error fetching staff permissions"
        };
    }
};
const checkStaffPermissionStatus = async (filter = {}, staffId)=>{
    try {
        if (!staffId || isNaN(staffId)) {
            return {
                status: false,
                message: "Invalid staff ID"
            };
        }
        // Fetch staff permissions based on the provided filter and staff ID
        if (!filter.panel || !filter.module || !filter.action) {
            return {
                status: false,
                message: "all of filter must be provided"
            };
        }
        const isValidPanel = [
            "admin",
            "supplier",
            "customer"
        ].includes(filter.panel);
        if (!isValidPanel) {
            return {
                status: false,
                message: "Invalid panel provided"
            };
        }
        const staffPermissionsExist = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaffPermission.findFirst({
            where: {
                panel: filter.panel,
                module: filter.module,
                action: filter.action
            }
        });
        if (!staffPermissionsExist) {
            return {
                status: false,
                message: "No permissions found for the given filter"
            };
        }
        const staffPermissions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaffHasPermission.findFirst({
            where: {
                adminStaffPermissionId: staffPermissionsExist.id,
                adminStaffId: staffId
            },
            orderBy: {
                id: "desc"
            }
        });
        if (!staffPermissions) {
            return {
                status: false,
                message: "Action Unauthorized"
            };
        }
        return {
            status: true,
            message: "Action Authorized"
        };
    } catch (error) {
        console.error("❌ getStaffPermissions Error:", error);
        return {
            status: false,
            message: "Error fetching staff permissions"
        };
    }
};
const getStaffPermissionsByStaffId = async (filter = {}, staffId)=>{
    try {
        // Validate staff ID
        if (!staffId || isNaN(staffId)) {
            return {
                status: false,
                message: "Invalid staff ID"
            };
        }
        // Validate panel if provided
        if (filter.panel) {
            const isValidPanel = [
                "admin",
                "supplier",
                "customer",
                "dropshipper"
            ].includes(filter.panel);
            if (!isValidPanel) {
                return {
                    status: false,
                    message: "Invalid panel provided"
                };
            }
        }
        // Fetch permissions matching the filter
        const matchingPermissions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaffPermission.findMany({
            where: {
                ...filter.panel && {
                    panel: filter.panel
                },
                ...filter.module && {
                    module: filter.module
                },
                ...filter.action && {
                    action: filter.action
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        if (!matchingPermissions.length) {
            return {
                status: false,
                message: "No matching permissions found for the given filter"
            };
        }
        const permissionIds = matchingPermissions.map((p)=>p.id);
        // Get all permissions assigned to the staff from filtered list
        const assignedPermissions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaffHasPermission.findMany({
            where: {
                adminStaffPermissionId: {
                    in: permissionIds
                },
                adminStaffId: staffId
            },
            include: {
                permission: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        if (!assignedPermissions.length) {
            return {
                status: false,
                message: "No permissions assigned to this staff for the given filter"
            };
        }
        return {
            status: true,
            message: "Permissions retrieved successfully",
            assignedPermissions
        };
    } catch (error) {
        console.error("❌ getStaffPermissionsByStaffId Error:", error);
        return {
            status: false,
            message: "Error retrieving staff permissions"
        };
    }
};
}}),
"[project]/src/app/controllers/admin/authController.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "adminByToken": (()=>adminByToken),
    "adminByUsernameRole": (()=>adminByUsernameRole),
    "handleForgetPassword": (()=>handleForgetPassword),
    "handleLogin": (()=>handleLogin),
    "handleResetPassword": (()=>handleResetPassword),
    "handleVerifyLogin": (()=>handleVerifyLogin),
    "handleVerifyStatus": (()=>handleVerifyStatus)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$auth$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/auth/authUtils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$hashUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/hashUtils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$models$2f$admin$2f$emailConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/models/admin/emailConfig.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$email$2f$sendEmail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/email/sendEmail.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/commonUtils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$models$2f$staffPermission$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/models/staffPermission.ts [app-route] (ecmascript)");
;
;
;
;
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
        let type = 'main';
        let adminResponse = await adminByUsernameRole(email, adminRole);
        if (!adminResponse.status || !adminResponse.admin) {
            adminResponse = await adminByUsernameRole(email, adminStaffRole);
            type = 'sub';
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
        console.log(`admin - `, admin);
        // Correct usage of .toLowerCase() as a function
        if (admin.status.toLowerCase() !== 'active') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Admin account is not active",
                status: false
            }, {
                status: 403
            });
        }
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
        // Email & account verification checks for supplier
        if (type === 'main' && admin.role === 'supplier') {
            if ('isEmailVerified' in admin && !admin?.isEmailVerified) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: false,
                    message: "Email is not verified yet"
                }, {
                    status: 403
                });
            }
            if ('isVerified' in admin && !admin?.isVerified) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: false,
                    message: "Your account has not been verified by admin"
                }, {
                    status: 403
                });
            }
        }
        if (type === 'sub' && 'admin' in admin && admin.admin?.role === 'supplier') {
            if ('admin' in admin && !admin.admin.isEmailVerified) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: false,
                    message: "Main account's email is not verified yet"
                }, {
                    status: 403
                });
            }
            if ('admin' in admin && !admin.admin.isVerified) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: false,
                    message: "Main account is not yet verified by admin"
                }, {
                    status: 403
                });
            }
        }
        // Generate authentication token
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$auth$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateToken"])(admin.id, admin.role);
        const isStaffUser = ![
            'admin',
            'dropshipper',
            'supplier'
        ].includes(String(admin.role));
        let assignedPermissions;
        if (isStaffUser) {
            console.log(`AdminStaff`);
            const options = {
                panel: 'admin'
            };
            const assignedPermissionsResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$models$2f$staffPermission$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStaffPermissionsByStaffId"])(options, admin.id);
            assignedPermissions = assignedPermissionsResult.assignedPermissions;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            assignedPermissions
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
        // Use adminByToken to verify token and fetch admin details
        const { status, message, admin } = await adminByToken(token, adminRole, adminStaffRole);
        if (!status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: message || "Invalid email or password",
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
async function handleForgetPassword(req, panel, adminRole, adminStaffRole) {
    try {
        const { email } = await req.json();
        if (!email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Email is required.",
                status: false
            }, {
                status: 400
            });
        }
        // Attempt to fetch admin or adminStaff by email
        let userResponse = await adminByUsernameRole(email, adminRole);
        if (!userResponse.status || !userResponse.admin) {
            userResponse = await adminByUsernameRole(email, adminStaffRole);
            if (!userResponse.status || !userResponse.admin) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: "No account found with this email.",
                    status: false
                }, {
                    status: 404
                });
            }
        }
        const admin = userResponse.admin;
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$auth$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generatePasswordResetToken"])(admin.id, admin.role);
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        // Update token and expiry in database
        const updateData = {
            pr_token: token,
            pr_expires_at: expiry
        };
        if (admin.role === adminRole) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.update({
                where: {
                    id: admin.id
                },
                data: updateData
            });
        } else {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaff.update({
                where: {
                    id: admin.id
                },
                data: updateData
            });
        }
        // Optional: Send email
        // await sendPasswordResetEmail(admin.email, token);
        const { status: emailStatus, message: emailMessage, emailConfig, htmlTemplate, subject: emailSubject } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$models$2f$admin$2f$emailConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEmailConfig"])("admin", "auth", "forget-password", true);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logMessage"])('debug', 'Email Config:', emailConfig);
        if (!emailStatus || !emailConfig) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: emailMessage || "Failed to fetch email configuration.",
                status: false
            }, {
                status: 500
            });
        }
        let urlPanel;
        if (panel == 'dropshipper') {
            urlPanel = `https://shipowl.io/dropshipping/auth/password/reset?token=${token}`;
        } else {
            urlPanel = `https://shipowl.io/${panel}/auth/password/reset?token=${token}`;
        }
        // Use index signature to avoid TS error
        const replacements = {
            "{{name}}": admin.name,
            "{{resetUrl}}": urlPanel,
            "{{year}}": new Date().getFullYear().toString(),
            "{{appName}}": "Shipping OWL"
        };
        let htmlBody = htmlTemplate?.trim() ? htmlTemplate : "<p>Dear {{name}},</p><p>Click <a href='{{resetUrl}}'>here</a> to reset your password.</p>";
        Object.keys(replacements).forEach((key)=>{
            htmlBody = htmlBody.replace(new RegExp(key, "g"), replacements[key]);
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logMessage"])('debug', 'HTML Body:', htmlBody);
        let subject = emailSubject;
        Object.keys(replacements).forEach((key)=>{
            subject = subject.replace(new RegExp(key, "g"), replacements[key]);
        });
        const mailData = {
            recipient: [
                {
                    name: admin.name,
                    email
                }
            ],
            cc: [],
            bcc: [],
            subject,
            htmlBody,
            attachments: []
        };
        const emailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$email$2f$sendEmail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(emailConfig, mailData);
        if (!emailResult.status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Reset token created but failed to send email. Please try again.",
                status: false,
                emailError: emailResult.error
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Password reset link has been sent to your email.",
            status: true
        }, {
            status: 200
        });
    } catch (error) {
        console.error("❌ Forgot password error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Something went wrong. Please try again later.",
            status: false
        }, {
            status: 500
        });
    }
}
async function handleResetPassword(req, adminRole, adminStaffRole) {
    try {
        const { token, password } = await req.json();
        // Check if token is provided
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Token is required.",
                status: false
            }, {
                status: 400
            });
        }
        // Verify token and fetch admin details using adminByToken function
        const { status: tokenStatus, message: tokenMessage, admin } = await adminByToken(token, adminRole, adminStaffRole);
        if (!tokenStatus || !admin) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: false,
                message: tokenMessage || "Invalid token or role."
            }, {
                status: 401
            });
        }
        // Hash the password using bcrypt
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(10));
        // Prepare the update data
        const updateData = {
            pr_token: null,
            pr_expires_at: null,
            pr_last_reset: new Date(),
            password: hashedPassword
        };
        // Update the admin or admin staff record based on the role
        if (admin.role === adminRole) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.update({
                where: {
                    id: admin.id
                },
                data: updateData
            });
        } else {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaff.update({
                where: {
                    id: admin.id
                },
                data: updateData
            });
        }
        const { status: emailStatus, message: emailMessage, emailConfig, htmlTemplate, subject: emailSubject } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$models$2f$admin$2f$emailConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEmailConfig"])("admin", "auth", "reset-password", true);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logMessage"])('debug', 'Email Config:', emailConfig);
        if (!emailStatus || !emailConfig) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: emailMessage || "Failed to fetch email configuration.",
                status: false
            }, {
                status: 500
            });
        }
        // Use index signature to avoid TS error
        const replacements = {
            "{{name}}": admin.name,
            "{{year}}": new Date().getFullYear().toString(),
            "{{appName}}": "Shipping OWL"
        };
        let htmlBody = htmlTemplate?.trim() ? htmlTemplate : "<p>Dear {{name}},</p><p>Your password has been reset successfully.</p>";
        // Replace placeholders in the HTML template
        Object.keys(replacements).forEach((key)=>{
            htmlBody = htmlBody.replace(new RegExp(key, "g"), replacements[key]);
        });
        let subject = emailSubject;
        Object.keys(replacements).forEach((key)=>{
            subject = subject.replace(new RegExp(key, "g"), replacements[key]);
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logMessage"])('debug', 'HTML Body:', htmlBody);
        const mailData = {
            recipient: [
                {
                    name: admin.name,
                    email: admin.email
                }
            ],
            subject,
            htmlBody,
            attachments: []
        };
        // Send email notification
        const emailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$email$2f$sendEmail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(emailConfig, mailData);
        if (!emailResult.status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Password reset successful, but failed to send email notification.",
                status: false,
                emailError: emailResult.error
            }, {
                status: 500
            });
        }
        // Return success response
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Password reset successful. A notification has been sent to your email.",
            status: true
        }, {
            status: 200
        });
    } catch (error) {
        console.error("❌ Password reset error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "An error occurred while resetting the password. Please try again later.",
            status: false
        }, {
            status: 500
        });
    }
}
async function handleVerifyStatus(req, adminRole, adminStaffRole) {
    try {
        const { token } = await req.json();
        // Check if token is provided
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Token is required.",
                status: false
            }, {
                status: 400
            });
        }
        // Verify token and fetch admin details using adminByToken function
        const { status: tokenStatus, message: tokenMessage, admin } = await adminByToken(token, adminRole, adminStaffRole);
        if (!tokenStatus || !admin) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: false,
                message: tokenMessage || "Invalid token or role."
            }, {
                status: 401
            });
        }
        let loginLink;
        // Update the admin or admin staff record based on the role
        if (adminRole == 'supplier') {
            // Prepare the update data
            const updateAdminData = {
                isEmailVerified: true,
                emailVerifiedAt: new Date()
            };
            const updateStaffData = {
                status: 'active'
            };
            if (admin.role === adminRole) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.update({
                    where: {
                        id: admin.id
                    },
                    data: updateAdminData
                });
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaff.update({
                    where: {
                        id: admin.id
                    },
                    data: updateStaffData
                });
            }
            loginLink = `https://shipowl.io/supplier/auth/login`;
        } else if (adminRole == 'dropshipper') {
            // Prepare the update data
            const updateData = {
                status: 'active'
            };
            if (admin.role === adminRole) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].admin.update({
                    where: {
                        id: admin.id
                    },
                    data: updateData
                });
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].adminStaff.update({
                    where: {
                        id: admin.id
                    },
                    data: updateData
                });
            }
            loginLink = `https://shipowl.io/dropshipping/auth/login`;
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: false,
                message: "Role is not supproted for this action"
            }, {
                status: 500
            });
        }
        const { status: emailStatus, message: emailMessage, emailConfig, htmlTemplate, subject: emailSubject } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$models$2f$admin$2f$emailConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEmailConfig"])(adminRole, 'auth', 'verify', true);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logMessage"])('debug', 'Email Config:', emailConfig);
        if (!emailStatus || !emailConfig) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: emailMessage || "Failed to fetch email configuration.",
                status: false
            }, {
                status: 500
            });
        }
        // Use index signature to avoid TS error
        const replacements = {
            "{{name}}": admin.name,
            "{{year}}": new Date().getFullYear().toString(),
            "{{loginLink}}": loginLink,
            "{{appName}}": "Shipping OWL"
        };
        let htmlBody = htmlTemplate?.trim() ? htmlTemplate : "<p>Dear {{name}},</p><p>Your account has been verified successfully.</p>";
        // Replace placeholders in the HTML template
        Object.keys(replacements).forEach((key)=>{
            htmlBody = htmlBody.replace(new RegExp(key, "g"), replacements[key]);
        });
        let subject = emailSubject;
        Object.keys(replacements).forEach((key)=>{
            subject = subject.replace(new RegExp(key, "g"), replacements[key]);
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logMessage"])('debug', 'HTML Body:', htmlBody);
        const mailData = {
            recipient: [
                {
                    name: admin.name,
                    email: admin.email
                }
            ],
            subject,
            htmlBody,
            attachments: []
        };
        // Send email notification
        const emailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$email$2f$sendEmail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(emailConfig, mailData);
        if (!emailResult.status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Account Verified successful, but failed to send email notification.",
                status: false,
                emailError: emailResult.error
            }, {
                status: 500
            });
        }
        // Return success response
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Account Verified successful. A notification has been sent to your email.",
            status: true
        }, {
            status: 200
        });
    } catch (error) {
        console.error("❌ Account Verified error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "An error occurred while verifing the account. Please try again later.",
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
        console.log(`adminRoleStr - `, adminRoleStr);
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
                    role: true,
                    status: true,
                    isVerified: true,
                    isEmailVerified: true
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
                    role: true,
                    status: true,
                    admin: true
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
async function adminByToken(token, adminRole, adminStaffRole) {
    try {
        // Verify token and extract admin details
        const { payload, status, message } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$auth$2f$authUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!status || !payload || typeof payload.adminId !== 'number') {
            return {
                status: false,
                message: message || "Unauthorized access. Invalid token."
            };
        }
        // Determine the admin model based on role
        const payloadAdminRole = String(payload.adminRole); // Ensure it's a string
        if (![
            adminRole,
            adminStaffRole
        ].includes(payloadAdminRole)) {
            return {
                status: false,
                message: "Access denied. Invalid role."
            };
        }
        // Set the correct admin model
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
        // If admin not found, return error
        if (!admin) {
            return {
                status: false,
                message: "Invalid admin credentials or account not found."
            };
        }
        // Return success with admin details
        return {
            status: true,
            message: "Token is valid",
            admin
        };
    } catch (error) {
        console.error("Error fetching admin:", error);
        return {
            status: false,
            message: "Internal Server Error"
        };
    }
}
}}),
"[project]/src/app/api/dropshipper/auth/login/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$controllers$2f$admin$2f$authController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/controllers/admin/authController.ts [app-route] (ecmascript)");
;
async function POST(req) {
    const adminRole = "dropshipper";
    const adminStaffRole = "dropshipper_staff";
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$controllers$2f$admin$2f$authController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleLogin"])(req, adminRole, adminStaffRole);
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__d3ec05cc._.js.map