(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__10070c6a._.js", {

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
        // Verify token and extract admin details
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, new TextEncoder().encode(SECRET_KEY));
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
        console.log(`Admin ID: ${payload.adminId}, Role: ${payload.adminRole}`);
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
"[project]/prisma/prisma/generated/client/runtime/index-browser.js [middleware-edge] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
var ne = Object.defineProperty;
var We = Object.getOwnPropertyDescriptor;
var Ge = Object.getOwnPropertyNames;
var Je = Object.prototype.hasOwnProperty;
var Xe = (e, n, i)=>n in e ? ne(e, n, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: i
    }) : e[n] = i;
var Ce = (e, n)=>{
    for(var i in n)ne(e, i, {
        get: n[i],
        enumerable: !0
    });
}, Ke = (e, n, i, t)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let r of Ge(n))!Je.call(e, r) && r !== i && ne(e, r, {
        get: ()=>n[r],
        enumerable: !(t = We(n, r)) || t.enumerable
    });
    return e;
};
var Qe = (e)=>Ke(ne({}, "__esModule", {
        value: !0
    }), e);
var ie = (e, n, i)=>Xe(e, typeof n != "symbol" ? n + "" : n, i);
var yn = {};
Ce(yn, {
    Decimal: ()=>je,
    Public: ()=>ge,
    getRuntime: ()=>Re,
    makeStrictEnum: ()=>Oe,
    objectEnumValues: ()=>Pe
});
module.exports = Qe(yn);
var ge = {};
Ce(ge, {
    validator: ()=>be
});
function be(...e) {
    return (n)=>n;
}
var te = Symbol(), me = new WeakMap, we = class {
    constructor(n){
        n === te ? me.set(this, "Prisma.".concat(this._getName())) : me.set(this, "new Prisma.".concat(this._getNamespace(), ".").concat(this._getName(), "()"));
    }
    _getName() {
        return this.constructor.name;
    }
    toString() {
        return me.get(this);
    }
}, G = class extends we {
    _getNamespace() {
        return "NullTypes";
    }
}, J = class extends G {
    constructor(){
        super(...arguments);
        ie(this, "_brand_DbNull");
    }
};
Ne(J, "DbNull");
var X = class extends G {
    constructor(){
        super(...arguments);
        ie(this, "_brand_JsonNull");
    }
};
Ne(X, "JsonNull");
var K = class extends G {
    constructor(){
        super(...arguments);
        ie(this, "_brand_AnyNull");
    }
};
Ne(K, "AnyNull");
var Pe = {
    classes: {
        DbNull: J,
        JsonNull: X,
        AnyNull: K
    },
    instances: {
        DbNull: new J(te),
        JsonNull: new X(te),
        AnyNull: new K(te)
    }
};
function Ne(e, n) {
    Object.defineProperty(e, "name", {
        value: n,
        configurable: !0
    });
}
var Ye = new Set([
    "toJSON",
    "$$typeof",
    "asymmetricMatch",
    Symbol.iterator,
    Symbol.toStringTag,
    Symbol.isConcatSpreadable,
    Symbol.toPrimitive
]);
function Oe(e) {
    return new Proxy(e, {
        get (n, i) {
            if (i in n) return n[i];
            if (!Ye.has(i)) throw new TypeError("Invalid enum value: ".concat(String(i)));
        }
    });
}
var xe = ()=>{
    var e, n;
    return ((n = (e = globalThis.process) == null ? void 0 : e.release) == null ? void 0 : n.name) === "node";
}, ze = ()=>{
    var e, n;
    return !!globalThis.Bun || !!((n = (e = globalThis.process) == null ? void 0 : e.versions) != null && n.bun);
}, ye = ()=>!!globalThis.Deno, en = ()=>typeof globalThis.Netlify == "object", nn = ()=>typeof globalThis.EdgeRuntime == "object", tn = ()=>{
    var e;
    return ((e = globalThis.navigator) == null ? void 0 : e.userAgent) === "Cloudflare-Workers";
};
function rn() {
    var i;
    return (i = [
        [
            en,
            "netlify"
        ],
        [
            nn,
            "edge-light"
        ],
        [
            tn,
            "workerd"
        ],
        [
            ye,
            "deno"
        ],
        [
            ze,
            "bun"
        ],
        [
            xe,
            "node"
        ]
    ].flatMap((t)=>t[0]() ? [
            t[1]
        ] : []).at(0)) != null ? i : "";
}
var sn = {
    node: "Node.js",
    workerd: "Cloudflare Workers",
    deno: "Deno and Deno Deploy",
    netlify: "Netlify Edge Functions",
    "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)"
};
function Re() {
    let e = rn();
    return {
        id: e,
        prettyName: sn[e] || e,
        isEdge: [
            "workerd",
            "deno",
            "netlify",
            "edge-light"
        ].includes(e)
    };
}
var V = 9e15, H = 1e9, ve = "0123456789abcdef", oe = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", ue = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", Ee = {
    precision: 20,
    rounding: 4,
    modulo: 1,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -V,
    maxE: V,
    crypto: !1
}, Te, Z, w = !0, ce = "[DecimalError] ", $ = ce + "Invalid argument: ", De = ce + "Precision limit exceeded", Fe = ce + "crypto unavailable", Le = "[object Decimal]", R = Math.floor, C = Math.pow, on = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, un = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, fn = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, Ie = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, D = 1e7, m = 7, cn = 9007199254740991, ln = oe.length - 1, ke = ue.length - 1, h = {
    toStringTag: Le
};
h.absoluteValue = h.abs = function() {
    var e = new this.constructor(this);
    return e.s < 0 && (e.s = 1), p(e);
};
h.ceil = function() {
    return p(new this.constructor(this), this.e + 1, 2);
};
h.clampedTo = h.clamp = function(e, n) {
    var i, t = this, r = t.constructor;
    if (e = new r(e), n = new r(n), !e.s || !n.s) return new r(NaN);
    if (e.gt(n)) throw Error($ + n);
    return i = t.cmp(e), i < 0 ? e : t.cmp(n) > 0 ? n : new r(t);
};
h.comparedTo = h.cmp = function(e) {
    var n, i, t, r, s = this, o = s.d, u = (e = new s.constructor(e)).d, c = s.s, f = e.s;
    if (!o || !u) return !c || !f ? NaN : c !== f ? c : o === u ? 0 : !o ^ c < 0 ? 1 : -1;
    if (!o[0] || !u[0]) return o[0] ? c : u[0] ? -f : 0;
    if (c !== f) return c;
    if (s.e !== e.e) return s.e > e.e ^ c < 0 ? 1 : -1;
    for(t = o.length, r = u.length, n = 0, i = t < r ? t : r; n < i; ++n)if (o[n] !== u[n]) return o[n] > u[n] ^ c < 0 ? 1 : -1;
    return t === r ? 0 : t > r ^ c < 0 ? 1 : -1;
};
h.cosine = h.cos = function() {
    var e, n, i = this, t = i.constructor;
    return i.d ? i.d[0] ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = an(t, He(t, i)), t.precision = e, t.rounding = n, p(Z == 2 || Z == 3 ? i.neg() : i, e, n, !0)) : new t(1) : new t(NaN);
};
h.cubeRoot = h.cbrt = function() {
    var e, n, i, t, r, s, o, u, c, f, l = this, a = l.constructor;
    if (!l.isFinite() || l.isZero()) return new a(l);
    for(w = !1, s = l.s * C(l.s * l, 1 / 3), !s || Math.abs(s) == 1 / 0 ? (i = b(l.d), e = l.e, (s = (e - i.length + 1) % 3) && (i += s == 1 || s == -2 ? "0" : "00"), s = C(i, 1 / 3), e = R((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), s == 1 / 0 ? i = "5e" + e : (i = s.toExponential(), i = i.slice(0, i.indexOf("e") + 1) + e), t = new a(i), t.s = l.s) : t = new a(s.toString()), o = (e = a.precision) + 3;;)if (u = t, c = u.times(u).times(u), f = c.plus(l), t = k(f.plus(l).times(u), f.plus(c), o + 2, 1), b(u.d).slice(0, o) === (i = b(t.d)).slice(0, o)) if (i = i.slice(o - 3, o + 1), i == "9999" || !r && i == "4999") {
        if (!r && (p(u, e + 1, 0), u.times(u).times(u).eq(l))) {
            t = u;
            break;
        }
        o += 4, r = 1;
    } else {
        (!+i || !+i.slice(1) && i.charAt(0) == "5") && (p(t, e + 1, 1), n = !t.times(t).times(t).eq(l));
        break;
    }
    return w = !0, p(t, e, a.rounding, n);
};
h.decimalPlaces = h.dp = function() {
    var e, n = this.d, i = NaN;
    if (n) {
        if (e = n.length - 1, i = (e - R(this.e / m)) * m, e = n[e], e) for(; e % 10 == 0; e /= 10)i--;
        i < 0 && (i = 0);
    }
    return i;
};
h.dividedBy = h.div = function(e) {
    return k(this, new this.constructor(e));
};
h.dividedToIntegerBy = h.divToInt = function(e) {
    var n = this, i = n.constructor;
    return p(k(n, new i(e), 0, 1, 1), i.precision, i.rounding);
};
h.equals = h.eq = function(e) {
    return this.cmp(e) === 0;
};
h.floor = function() {
    return p(new this.constructor(this), this.e + 1, 3);
};
h.greaterThan = h.gt = function(e) {
    return this.cmp(e) > 0;
};
h.greaterThanOrEqualTo = h.gte = function(e) {
    var n = this.cmp(e);
    return n == 1 || n === 0;
};
h.hyperbolicCosine = h.cosh = function() {
    var e, n, i, t, r, s = this, o = s.constructor, u = new o(1);
    if (!s.isFinite()) return new o(s.s ? 1 / 0 : NaN);
    if (s.isZero()) return u;
    i = o.precision, t = o.rounding, o.precision = i + Math.max(s.e, s.sd()) + 4, o.rounding = 1, r = s.d.length, r < 32 ? (e = Math.ceil(r / 3), n = (1 / ae(4, e)).toString()) : (e = 16, n = "2.3283064365386962890625e-10"), s = j(o, 1, s.times(n), new o(1), !0);
    for(var c, f = e, l = new o(8); f--;)c = s.times(s), s = u.minus(c.times(l.minus(c.times(l))));
    return p(s, o.precision = i, o.rounding = t, !0);
};
h.hyperbolicSine = h.sinh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    if (!r.isFinite() || r.isZero()) return new s(r);
    if (n = s.precision, i = s.rounding, s.precision = n + Math.max(r.e, r.sd()) + 4, s.rounding = 1, t = r.d.length, t < 3) r = j(s, 2, r, r, !0);
    else {
        e = 1.4 * Math.sqrt(t), e = e > 16 ? 16 : e | 0, r = r.times(1 / ae(5, e)), r = j(s, 2, r, r, !0);
        for(var o, u = new s(5), c = new s(16), f = new s(20); e--;)o = r.times(r), r = r.times(u.plus(o.times(c.times(o).plus(f))));
    }
    return s.precision = n, s.rounding = i, p(r, n, i, !0);
};
h.hyperbolicTangent = h.tanh = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 7, t.rounding = 1, k(i.sinh(), i.cosh(), t.precision = e, t.rounding = n)) : new t(i.s);
};
h.inverseCosine = h.acos = function() {
    var e = this, n = e.constructor, i = e.abs().cmp(1), t = n.precision, r = n.rounding;
    return i !== -1 ? i === 0 ? e.isNeg() ? F(n, t, r) : new n(0) : new n(NaN) : e.isZero() ? F(n, t + 4, r).times(.5) : (n.precision = t + 6, n.rounding = 1, e = new n(1).minus(e).div(e.plus(1)).sqrt().atan(), n.precision = t, n.rounding = r, e.times(2));
};
h.inverseHyperbolicCosine = h.acosh = function() {
    var e, n, i = this, t = i.constructor;
    return i.lte(1) ? new t(i.eq(1) ? 0 : NaN) : i.isFinite() ? (e = t.precision, n = t.rounding, t.precision = e + Math.max(Math.abs(i.e), i.sd()) + 4, t.rounding = 1, w = !1, i = i.times(i).minus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln()) : new t(i);
};
h.inverseHyperbolicSine = h.asinh = function() {
    var e, n, i = this, t = i.constructor;
    return !i.isFinite() || i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 2 * Math.max(Math.abs(i.e), i.sd()) + 6, t.rounding = 1, w = !1, i = i.times(i).plus(1).sqrt().plus(i), w = !0, t.precision = e, t.rounding = n, i.ln());
};
h.inverseHyperbolicTangent = h.atanh = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isFinite() ? r.e >= 0 ? new s(r.abs().eq(1) ? r.s / 0 : r.isZero() ? r : NaN) : (e = s.precision, n = s.rounding, t = r.sd(), Math.max(t, e) < 2 * -r.e - 1 ? p(new s(r), e, n, !0) : (s.precision = i = t - r.e, r = k(r.plus(1), new s(1).minus(r), i + e, 1), s.precision = e + 4, s.rounding = 1, r = r.ln(), s.precision = e, s.rounding = n, r.times(.5))) : new s(NaN);
};
h.inverseSine = h.asin = function() {
    var e, n, i, t, r = this, s = r.constructor;
    return r.isZero() ? new s(r) : (n = r.abs().cmp(1), i = s.precision, t = s.rounding, n !== -1 ? n === 0 ? (e = F(s, i + 4, t).times(.5), e.s = r.s, e) : new s(NaN) : (s.precision = i + 6, s.rounding = 1, r = r.div(new s(1).minus(r.times(r)).sqrt().plus(1)).atan(), s.precision = i, s.rounding = t, r.times(2)));
};
h.inverseTangent = h.atan = function() {
    var e, n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding;
    if (f.isFinite()) {
        if (f.isZero()) return new l(f);
        if (f.abs().eq(1) && a + 4 <= ke) return o = F(l, a + 4, d).times(.25), o.s = f.s, o;
    } else {
        if (!f.s) return new l(NaN);
        if (a + 4 <= ke) return o = F(l, a + 4, d).times(.5), o.s = f.s, o;
    }
    for(l.precision = u = a + 10, l.rounding = 1, i = Math.min(28, u / m + 2 | 0), e = i; e; --e)f = f.div(f.times(f).plus(1).sqrt().plus(1));
    for(w = !1, n = Math.ceil(u / m), t = 1, c = f.times(f), o = new l(f), r = f; e !== -1;)if (r = r.times(c), s = o.minus(r.div(t += 2)), r = r.times(c), o = s.plus(r.div(t += 2)), o.d[n] !== void 0) for(e = n; o.d[e] === s.d[e] && e--;);
    return i && (o = o.times(2 << i - 1)), w = !0, p(o, l.precision = a, l.rounding = d, !0);
};
h.isFinite = function() {
    return !!this.d;
};
h.isInteger = h.isInt = function() {
    return !!this.d && R(this.e / m) > this.d.length - 2;
};
h.isNaN = function() {
    return !this.s;
};
h.isNegative = h.isNeg = function() {
    return this.s < 0;
};
h.isPositive = h.isPos = function() {
    return this.s > 0;
};
h.isZero = function() {
    return !!this.d && this.d[0] === 0;
};
h.lessThan = h.lt = function(e) {
    return this.cmp(e) < 0;
};
h.lessThanOrEqualTo = h.lte = function(e) {
    return this.cmp(e) < 1;
};
h.logarithm = h.log = function(e) {
    var n, i, t, r, s, o, u, c, f = this, l = f.constructor, a = l.precision, d = l.rounding, g = 5;
    if (e == null) e = new l(10), n = !0;
    else {
        if (e = new l(e), i = e.d, e.s < 0 || !i || !i[0] || e.eq(1)) return new l(NaN);
        n = e.eq(10);
    }
    if (i = f.d, f.s < 0 || !i || !i[0] || f.eq(1)) return new l(i && !i[0] ? -1 / 0 : f.s != 1 ? NaN : i ? 0 : 1 / 0);
    if (n) if (i.length > 1) s = !0;
    else {
        for(r = i[0]; r % 10 === 0;)r /= 10;
        s = r !== 1;
    }
    if (w = !1, u = a + g, o = B(f, u), t = n ? fe(l, u + 10) : B(e, u), c = k(o, t, u, 1), Q(c.d, r = a, d)) do if (u += 10, o = B(f, u), t = n ? fe(l, u + 10) : B(e, u), c = k(o, t, u, 1), !s) {
        +b(c.d).slice(r + 1, r + 15) + 1 == 1e14 && (c = p(c, a + 1, 0));
        break;
    }
    while (Q(c.d, r += 10, d))
    return w = !0, p(c, a, d);
};
h.minus = h.sub = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.constructor;
    if (e = new v(e), !g.d || !e.d) return !g.s || !e.s ? e = new v(NaN) : g.d ? e.s = -e.s : e = new v(e.d || g.s !== e.s ? g : NaN), e;
    if (g.s != e.s) return e.s = -e.s, g.plus(e);
    if (f = g.d, d = e.d, u = v.precision, c = v.rounding, !f[0] || !d[0]) {
        if (d[0]) e.s = -e.s;
        else if (f[0]) e = new v(g);
        else return new v(c === 3 ? -0 : 0);
        return w ? p(e, u, c) : e;
    }
    if (i = R(e.e / m), l = R(g.e / m), f = f.slice(), s = l - i, s) {
        for(a = s < 0, a ? (n = f, s = -s, o = d.length) : (n = d, i = l, o = f.length), t = Math.max(Math.ceil(u / m), o) + 2, s > t && (s = t, n.length = 1), n.reverse(), t = s; t--;)n.push(0);
        n.reverse();
    } else {
        for(t = f.length, o = d.length, a = t < o, a && (o = t), t = 0; t < o; t++)if (f[t] != d[t]) {
            a = f[t] < d[t];
            break;
        }
        s = 0;
    }
    for(a && (n = f, f = d, d = n, e.s = -e.s), o = f.length, t = d.length - o; t > 0; --t)f[o++] = 0;
    for(t = d.length; t > s;){
        if (f[--t] < d[t]) {
            for(r = t; r && f[--r] === 0;)f[r] = D - 1;
            --f[r], f[t] += D;
        }
        f[t] -= d[t];
    }
    for(; f[--o] === 0;)f.pop();
    for(; f[0] === 0; f.shift())--i;
    return f[0] ? (e.d = f, e.e = le(f, i), w ? p(e, u, c) : e) : new v(c === 3 ? -0 : 0);
};
h.modulo = h.mod = function(e) {
    var n, i = this, t = i.constructor;
    return e = new t(e), !i.d || !e.s || e.d && !e.d[0] ? new t(NaN) : !e.d || i.d && !i.d[0] ? p(new t(i), t.precision, t.rounding) : (w = !1, t.modulo == 9 ? (n = k(i, e.abs(), 0, 3, 1), n.s *= e.s) : n = k(i, e, 0, t.modulo, 1), n = n.times(e), w = !0, i.minus(n));
};
h.naturalExponential = h.exp = function() {
    return Se(this);
};
h.naturalLogarithm = h.ln = function() {
    return B(this);
};
h.negated = h.neg = function() {
    var e = new this.constructor(this);
    return e.s = -e.s, p(e);
};
h.plus = h.add = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a = this, d = a.constructor;
    if (e = new d(e), !a.d || !e.d) return !a.s || !e.s ? e = new d(NaN) : a.d || (e = new d(e.d || a.s === e.s ? a : NaN)), e;
    if (a.s != e.s) return e.s = -e.s, a.minus(e);
    if (f = a.d, l = e.d, u = d.precision, c = d.rounding, !f[0] || !l[0]) return l[0] || (e = new d(a)), w ? p(e, u, c) : e;
    if (s = R(a.e / m), t = R(e.e / m), f = f.slice(), r = s - t, r) {
        for(r < 0 ? (i = f, r = -r, o = l.length) : (i = l, t = s, o = f.length), s = Math.ceil(u / m), o = s > o ? s + 1 : o + 1, r > o && (r = o, i.length = 1), i.reverse(); r--;)i.push(0);
        i.reverse();
    }
    for(o = f.length, r = l.length, o - r < 0 && (r = o, i = l, l = f, f = i), n = 0; r;)n = (f[--r] = f[r] + l[r] + n) / D | 0, f[r] %= D;
    for(n && (f.unshift(n), ++t), o = f.length; f[--o] == 0;)f.pop();
    return e.d = f, e.e = le(f, t), w ? p(e, u, c) : e;
};
h.precision = h.sd = function(e) {
    var n, i = this;
    if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error($ + e);
    return i.d ? (n = Ze(i.d), e && i.e + 1 > n && (n = i.e + 1)) : n = NaN, n;
};
h.round = function() {
    var e = this, n = e.constructor;
    return p(new n(e), e.e + 1, n.rounding);
};
h.sine = h.sin = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + Math.max(i.e, i.sd()) + m, t.rounding = 1, i = hn(t, He(t, i)), t.precision = e, t.rounding = n, p(Z > 2 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.squareRoot = h.sqrt = function() {
    var e, n, i, t, r, s, o = this, u = o.d, c = o.e, f = o.s, l = o.constructor;
    if (f !== 1 || !u || !u[0]) return new l(!f || f < 0 && (!u || u[0]) ? NaN : u ? o : 1 / 0);
    for(w = !1, f = Math.sqrt(+o), f == 0 || f == 1 / 0 ? (n = b(u), (n.length + c) % 2 == 0 && (n += "0"), f = Math.sqrt(n), c = R((c + 1) / 2) - (c < 0 || c % 2), f == 1 / 0 ? n = "5e" + c : (n = f.toExponential(), n = n.slice(0, n.indexOf("e") + 1) + c), t = new l(n)) : t = new l(f.toString()), i = (c = l.precision) + 3;;)if (s = t, t = s.plus(k(o, s, i + 2, 1)).times(.5), b(s.d).slice(0, i) === (n = b(t.d)).slice(0, i)) if (n = n.slice(i - 3, i + 1), n == "9999" || !r && n == "4999") {
        if (!r && (p(s, c + 1, 0), s.times(s).eq(o))) {
            t = s;
            break;
        }
        i += 4, r = 1;
    } else {
        (!+n || !+n.slice(1) && n.charAt(0) == "5") && (p(t, c + 1, 1), e = !t.times(t).eq(o));
        break;
    }
    return w = !0, p(t, c, l.rounding, e);
};
h.tangent = h.tan = function() {
    var e, n, i = this, t = i.constructor;
    return i.isFinite() ? i.isZero() ? new t(i) : (e = t.precision, n = t.rounding, t.precision = e + 10, t.rounding = 1, i = i.sin(), i.s = 1, i = k(i, new t(1).minus(i.times(i)).sqrt(), e + 10, 0), t.precision = e, t.rounding = n, p(Z == 2 || Z == 4 ? i.neg() : i, e, n, !0)) : new t(NaN);
};
h.times = h.mul = function(e) {
    var n, i, t, r, s, o, u, c, f, l = this, a = l.constructor, d = l.d, g = (e = new a(e)).d;
    if (e.s *= l.s, !d || !d[0] || !g || !g[0]) return new a(!e.s || d && !d[0] && !g || g && !g[0] && !d ? NaN : !d || !g ? e.s / 0 : e.s * 0);
    for(i = R(l.e / m) + R(e.e / m), c = d.length, f = g.length, c < f && (s = d, d = g, g = s, o = c, c = f, f = o), s = [], o = c + f, t = o; t--;)s.push(0);
    for(t = f; --t >= 0;){
        for(n = 0, r = c + t; r > t;)u = s[r] + g[t] * d[r - t - 1] + n, s[r--] = u % D | 0, n = u / D | 0;
        s[r] = (s[r] + n) % D | 0;
    }
    for(; !s[--o];)s.pop();
    return n ? ++i : s.shift(), e.d = s, e.e = le(s, i), w ? p(e, a.precision, a.rounding) : e;
};
h.toBinary = function(e, n) {
    return Me(this, 2, e, n);
};
h.toDecimalPlaces = h.toDP = function(e, n) {
    var i = this, t = i.constructor;
    return i = new t(i), e === void 0 ? i : (q(e, 0, H), n === void 0 ? n = t.rounding : q(n, 0, 8), p(i, e + i.e + 1, n));
};
h.toExponential = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, !0) : (q(e, 0, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e + 1, n), i = L(t, !0, e + 1)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toFixed = function(e, n) {
    var i, t, r = this, s = r.constructor;
    return e === void 0 ? i = L(r) : (q(e, 0, H), n === void 0 ? n = s.rounding : q(n, 0, 8), t = p(new s(r), e + r.e + 1, n), i = L(t, !1, e + t.e + 1)), r.isNeg() && !r.isZero() ? "-" + i : i;
};
h.toFraction = function(e) {
    var n, i, t, r, s, o, u, c, f, l, a, d, g = this, v = g.d, N = g.constructor;
    if (!v) return new N(g);
    if (f = i = new N(1), t = c = new N(0), n = new N(t), s = n.e = Ze(v) - g.e - 1, o = s % m, n.d[0] = C(10, o < 0 ? m + o : o), e == null) e = s > 0 ? n : f;
    else {
        if (u = new N(e), !u.isInt() || u.lt(f)) throw Error($ + u);
        e = u.gt(n) ? s > 0 ? n : f : u;
    }
    for(w = !1, u = new N(b(v)), l = N.precision, N.precision = s = v.length * m * 2; a = k(u, n, 0, 1, 1), r = i.plus(a.times(t)), r.cmp(e) != 1;)i = t, t = r, r = f, f = c.plus(a.times(r)), c = r, r = n, n = u.minus(a.times(r)), u = r;
    return r = k(e.minus(i), t, 0, 1, 1), c = c.plus(r.times(f)), i = i.plus(r.times(t)), c.s = f.s = g.s, d = k(f, t, s, 1).minus(g).abs().cmp(k(c, i, s, 1).minus(g).abs()) < 1 ? [
        f,
        t
    ] : [
        c,
        i
    ], N.precision = l, w = !0, d;
};
h.toHexadecimal = h.toHex = function(e, n) {
    return Me(this, 16, e, n);
};
h.toNearest = function(e, n) {
    var i = this, t = i.constructor;
    if (i = new t(i), e == null) {
        if (!i.d) return i;
        e = new t(1), n = t.rounding;
    } else {
        if (e = new t(e), n === void 0 ? n = t.rounding : q(n, 0, 8), !i.d) return e.s ? i : e;
        if (!e.d) return e.s && (e.s = i.s), e;
    }
    return e.d[0] ? (w = !1, i = k(i, e, 0, n, 1).times(e), w = !0, p(i)) : (e.s = i.s, i = e), i;
};
h.toNumber = function() {
    return +this;
};
h.toOctal = function(e, n) {
    return Me(this, 8, e, n);
};
h.toPower = h.pow = function(e) {
    var n, i, t, r, s, o, u = this, c = u.constructor, f = +(e = new c(e));
    if (!u.d || !e.d || !u.d[0] || !e.d[0]) return new c(C(+u, f));
    if (u = new c(u), u.eq(1)) return u;
    if (t = c.precision, s = c.rounding, e.eq(1)) return p(u, t, s);
    if (n = R(e.e / m), n >= e.d.length - 1 && (i = f < 0 ? -f : f) <= cn) return r = Ue(c, u, i, t), e.s < 0 ? new c(1).div(r) : p(r, t, s);
    if (o = u.s, o < 0) {
        if (n < e.d.length - 1) return new c(NaN);
        if ((e.d[n] & 1) == 0 && (o = 1), u.e == 0 && u.d[0] == 1 && u.d.length == 1) return u.s = o, u;
    }
    return i = C(+u, f), n = i == 0 || !isFinite(i) ? R(f * (Math.log("0." + b(u.d)) / Math.LN10 + u.e + 1)) : new c(i + "").e, n > c.maxE + 1 || n < c.minE - 1 ? new c(n > 0 ? o / 0 : 0) : (w = !1, c.rounding = u.s = 1, i = Math.min(12, (n + "").length), r = Se(e.times(B(u, t + i)), t), r.d && (r = p(r, t + 5, 1), Q(r.d, t, s) && (n = t + 10, r = p(Se(e.times(B(u, n + i)), n), n + 5, 1), +b(r.d).slice(t + 1, t + 15) + 1 == 1e14 && (r = p(r, t + 1, 0)))), r.s = o, w = !0, c.rounding = s, p(r, t, s));
};
h.toPrecision = function(e, n) {
    var i, t = this, r = t.constructor;
    return e === void 0 ? i = L(t, t.e <= r.toExpNeg || t.e >= r.toExpPos) : (q(e, 1, H), n === void 0 ? n = r.rounding : q(n, 0, 8), t = p(new r(t), e, n), i = L(t, e <= t.e || t.e <= r.toExpNeg, e)), t.isNeg() && !t.isZero() ? "-" + i : i;
};
h.toSignificantDigits = h.toSD = function(e, n) {
    var i = this, t = i.constructor;
    return e === void 0 ? (e = t.precision, n = t.rounding) : (q(e, 1, H), n === void 0 ? n = t.rounding : q(n, 0, 8)), p(new t(i), e, n);
};
h.toString = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() && !e.isZero() ? "-" + i : i;
};
h.truncated = h.trunc = function() {
    return p(new this.constructor(this), this.e + 1, 1);
};
h.valueOf = h.toJSON = function() {
    var e = this, n = e.constructor, i = L(e, e.e <= n.toExpNeg || e.e >= n.toExpPos);
    return e.isNeg() ? "-" + i : i;
};
function b(e) {
    var n, i, t, r = e.length - 1, s = "", o = e[0];
    if (r > 0) {
        for(s += o, n = 1; n < r; n++)t = e[n] + "", i = m - t.length, i && (s += U(i)), s += t;
        o = e[n], t = o + "", i = m - t.length, i && (s += U(i));
    } else if (o === 0) return "0";
    for(; o % 10 === 0;)o /= 10;
    return s + o;
}
function q(e, n, i) {
    if (e !== ~~e || e < n || e > i) throw Error($ + e);
}
function Q(e, n, i, t) {
    var r, s, o, u;
    for(s = e[0]; s >= 10; s /= 10)--n;
    return --n < 0 ? (n += m, r = 0) : (r = Math.ceil((n + 1) / m), n %= m), s = C(10, m - n), u = e[r] % s | 0, t == null ? n < 3 ? (n == 0 ? u = u / 100 | 0 : n == 1 && (u = u / 10 | 0), o = i < 4 && u == 99999 || i > 3 && u == 49999 || u == 5e4 || u == 0) : o = (i < 4 && u + 1 == s || i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 100 | 0) == C(10, n - 2) - 1 || (u == s / 2 || u == 0) && (e[r + 1] / s / 100 | 0) == 0 : n < 4 ? (n == 0 ? u = u / 1e3 | 0 : n == 1 ? u = u / 100 | 0 : n == 2 && (u = u / 10 | 0), o = (t || i < 4) && u == 9999 || !t && i > 3 && u == 4999) : o = ((t || i < 4) && u + 1 == s || !t && i > 3 && u + 1 == s / 2) && (e[r + 1] / s / 1e3 | 0) == C(10, n - 3) - 1, o;
}
function re(e, n, i) {
    for(var t, r = [
        0
    ], s, o = 0, u = e.length; o < u;){
        for(s = r.length; s--;)r[s] *= n;
        for(r[0] += ve.indexOf(e.charAt(o++)), t = 0; t < r.length; t++)r[t] > i - 1 && (r[t + 1] === void 0 && (r[t + 1] = 0), r[t + 1] += r[t] / i | 0, r[t] %= i);
    }
    return r.reverse();
}
function an(e, n) {
    var i, t, r;
    if (n.isZero()) return n;
    t = n.d.length, t < 32 ? (i = Math.ceil(t / 3), r = (1 / ae(4, i)).toString()) : (i = 16, r = "2.3283064365386962890625e-10"), e.precision += i, n = j(e, 1, n.times(r), new e(1));
    for(var s = i; s--;){
        var o = n.times(n);
        n = o.times(o).minus(o).times(8).plus(1);
    }
    return e.precision -= i, n;
}
var k = function() {
    function e(t, r, s) {
        var o, u = 0, c = t.length;
        for(t = t.slice(); c--;)o = t[c] * r + u, t[c] = o % s | 0, u = o / s | 0;
        return u && t.unshift(u), t;
    }
    function n(t, r, s, o) {
        var u, c;
        if (s != o) c = s > o ? 1 : -1;
        else for(u = c = 0; u < s; u++)if (t[u] != r[u]) {
            c = t[u] > r[u] ? 1 : -1;
            break;
        }
        return c;
    }
    function i(t, r, s, o) {
        for(var u = 0; s--;)t[s] -= u, u = t[s] < r[s] ? 1 : 0, t[s] = u * o + t[s] - r[s];
        for(; !t[0] && t.length > 1;)t.shift();
    }
    return function(t, r, s, o, u, c) {
        var f, l, a, d, g, v, N, A, M, _, E, P, x, I, de, z, W, he, T, y, ee = t.constructor, pe = t.s == r.s ? 1 : -1, O = t.d, S = r.d;
        if (!O || !O[0] || !S || !S[0]) return new ee(!t.s || !r.s || (O ? S && O[0] == S[0] : !S) ? NaN : O && O[0] == 0 || !S ? pe * 0 : pe / 0);
        for(c ? (g = 1, l = t.e - r.e) : (c = D, g = m, l = R(t.e / g) - R(r.e / g)), T = S.length, W = O.length, M = new ee(pe), _ = M.d = [], a = 0; S[a] == (O[a] || 0); a++);
        if (S[a] > (O[a] || 0) && l--, s == null ? (I = s = ee.precision, o = ee.rounding) : u ? I = s + (t.e - r.e) + 1 : I = s, I < 0) _.push(1), v = !0;
        else {
            if (I = I / g + 2 | 0, a = 0, T == 1) {
                for(d = 0, S = S[0], I++; (a < W || d) && I--; a++)de = d * c + (O[a] || 0), _[a] = de / S | 0, d = de % S | 0;
                v = d || a < W;
            } else {
                for(d = c / (S[0] + 1) | 0, d > 1 && (S = e(S, d, c), O = e(O, d, c), T = S.length, W = O.length), z = T, E = O.slice(0, T), P = E.length; P < T;)E[P++] = 0;
                y = S.slice(), y.unshift(0), he = S[0], S[1] >= c / 2 && ++he;
                do d = 0, f = n(S, E, T, P), f < 0 ? (x = E[0], T != P && (x = x * c + (E[1] || 0)), d = x / he | 0, d > 1 ? (d >= c && (d = c - 1), N = e(S, d, c), A = N.length, P = E.length, f = n(N, E, A, P), f == 1 && (d--, i(N, T < A ? y : S, A, c))) : (d == 0 && (f = d = 1), N = S.slice()), A = N.length, A < P && N.unshift(0), i(E, N, P, c), f == -1 && (P = E.length, f = n(S, E, T, P), f < 1 && (d++, i(E, T < P ? y : S, P, c))), P = E.length) : f === 0 && (d++, E = [
                    0
                ]), _[a++] = d, f && E[0] ? E[P++] = O[z] || 0 : (E = [
                    O[z]
                ], P = 1);
                while ((z++ < W || E[0] !== void 0) && I--)
                v = E[0] !== void 0;
            }
            _[0] || _.shift();
        }
        if (g == 1) M.e = l, Te = v;
        else {
            for(a = 1, d = _[0]; d >= 10; d /= 10)a++;
            M.e = a + l * g - 1, p(M, u ? s + M.e + 1 : s, o, v);
        }
        return M;
    };
}();
function p(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor;
    e: if (n != null) {
        if (a = e.d, !a) return e;
        for(r = 1, u = a[0]; u >= 10; u /= 10)r++;
        if (s = n - r, s < 0) s += m, o = n, l = a[d = 0], c = l / C(10, r - o - 1) % 10 | 0;
        else if (d = Math.ceil((s + 1) / m), u = a.length, d >= u) if (t) {
            for(; u++ <= d;)a.push(0);
            l = c = 0, r = 1, s %= m, o = s - m + 1;
        } else break e;
        else {
            for(l = u = a[d], r = 1; u >= 10; u /= 10)r++;
            s %= m, o = s - m + r, c = o < 0 ? 0 : l / C(10, r - o - 1) % 10 | 0;
        }
        if (t = t || n < 0 || a[d + 1] !== void 0 || (o < 0 ? l : l % C(10, r - o - 1)), f = i < 4 ? (c || t) && (i == 0 || i == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (i == 4 || t || i == 6 && (s > 0 ? o > 0 ? l / C(10, r - o) : 0 : a[d - 1]) % 10 & 1 || i == (e.s < 0 ? 8 : 7)), n < 1 || !a[0]) return a.length = 0, f ? (n -= e.e + 1, a[0] = C(10, (m - n % m) % m), e.e = -n || 0) : a[0] = e.e = 0, e;
        if (s == 0 ? (a.length = d, u = 1, d--) : (a.length = d + 1, u = C(10, m - s), a[d] = o > 0 ? (l / C(10, r - o) % C(10, o) | 0) * u : 0), f) for(;;)if (d == 0) {
            for(s = 1, o = a[0]; o >= 10; o /= 10)s++;
            for(o = a[0] += u, u = 1; o >= 10; o /= 10)u++;
            s != u && (e.e++, a[0] == D && (a[0] = 1));
            break;
        } else {
            if (a[d] += u, a[d] != D) break;
            a[d--] = 0, u = 1;
        }
        for(s = a.length; a[--s] === 0;)a.pop();
    }
    return w && (e.e > g.maxE ? (e.d = null, e.e = NaN) : e.e < g.minE && (e.e = 0, e.d = [
        0
    ])), e;
}
function L(e, n, i) {
    if (!e.isFinite()) return $e(e);
    var t, r = e.e, s = b(e.d), o = s.length;
    return n ? (i && (t = i - o) > 0 ? s = s.charAt(0) + "." + s.slice(1) + U(t) : o > 1 && (s = s.charAt(0) + "." + s.slice(1)), s = s + (e.e < 0 ? "e" : "e+") + e.e) : r < 0 ? (s = "0." + U(-r - 1) + s, i && (t = i - o) > 0 && (s += U(t))) : r >= o ? (s += U(r + 1 - o), i && (t = i - r - 1) > 0 && (s = s + "." + U(t))) : ((t = r + 1) < o && (s = s.slice(0, t) + "." + s.slice(t)), i && (t = i - o) > 0 && (r + 1 === o && (s += "."), s += U(t))), s;
}
function le(e, n) {
    var i = e[0];
    for(n *= m; i >= 10; i /= 10)n++;
    return n;
}
function fe(e, n, i) {
    if (n > ln) throw w = !0, i && (e.precision = i), Error(De);
    return p(new e(oe), n, 1, !0);
}
function F(e, n, i) {
    if (n > ke) throw Error(De);
    return p(new e(ue), n, i, !0);
}
function Ze(e) {
    var n = e.length - 1, i = n * m + 1;
    if (n = e[n], n) {
        for(; n % 10 == 0; n /= 10)i--;
        for(n = e[0]; n >= 10; n /= 10)i++;
    }
    return i;
}
function U(e) {
    for(var n = ""; e--;)n += "0";
    return n;
}
function Ue(e, n, i, t) {
    var r, s = new e(1), o = Math.ceil(t / m + 4);
    for(w = !1;;){
        if (i % 2 && (s = s.times(n), qe(s.d, o) && (r = !0)), i = R(i / 2), i === 0) {
            i = s.d.length - 1, r && s.d[i] === 0 && ++s.d[i];
            break;
        }
        n = n.times(n), qe(n.d, o);
    }
    return w = !0, s;
}
function Ae(e) {
    return e.d[e.d.length - 1] & 1;
}
function Be(e, n, i) {
    for(var t, r, s = new e(n[0]), o = 0; ++o < n.length;){
        if (r = new e(n[o]), !r.s) {
            s = r;
            break;
        }
        t = s.cmp(r), (t === i || t === 0 && s.s === i) && (s = r);
    }
    return s;
}
function Se(e, n) {
    var i, t, r, s, o, u, c, f = 0, l = 0, a = 0, d = e.constructor, g = d.rounding, v = d.precision;
    if (!e.d || !e.d[0] || e.e > 17) return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
    for(n == null ? (w = !1, c = v) : c = n, u = new d(.03125); e.e > -2;)e = e.times(u), a += 5;
    for(t = Math.log(C(2, a)) / Math.LN10 * 2 + 5 | 0, c += t, i = s = o = new d(1), d.precision = c;;){
        if (s = p(s.times(e), c, 1), i = i.times(++l), u = o.plus(k(s, i, c, 1)), b(u.d).slice(0, c) === b(o.d).slice(0, c)) {
            for(r = a; r--;)o = p(o.times(o), c, 1);
            if (n == null) if (f < 3 && Q(o.d, c - t, g, f)) d.precision = c += 10, i = s = u = new d(1), l = 0, f++;
            else return p(o, d.precision = v, g, w = !0);
            else return d.precision = v, o;
        }
        o = u;
    }
}
function B(e, n) {
    var i, t, r, s, o, u, c, f, l, a, d, g = 1, v = 10, N = e, A = N.d, M = N.constructor, _ = M.rounding, E = M.precision;
    if (N.s < 0 || !A || !A[0] || !N.e && A[0] == 1 && A.length == 1) return new M(A && !A[0] ? -1 / 0 : N.s != 1 ? NaN : A ? 0 : N);
    if (n == null ? (w = !1, l = E) : l = n, M.precision = l += v, i = b(A), t = i.charAt(0), Math.abs(s = N.e) < 15e14) {
        for(; t < 7 && t != 1 || t == 1 && i.charAt(1) > 3;)N = N.times(e), i = b(N.d), t = i.charAt(0), g++;
        s = N.e, t > 1 ? (N = new M("0." + i), s++) : N = new M(t + "." + i.slice(1));
    } else return f = fe(M, l + 2, E).times(s + ""), N = B(new M(t + "." + i.slice(1)), l - v).plus(f), M.precision = E, n == null ? p(N, E, _, w = !0) : N;
    for(a = N, c = o = N = k(N.minus(1), N.plus(1), l, 1), d = p(N.times(N), l, 1), r = 3;;){
        if (o = p(o.times(d), l, 1), f = c.plus(k(o, new M(r), l, 1)), b(f.d).slice(0, l) === b(c.d).slice(0, l)) if (c = c.times(2), s !== 0 && (c = c.plus(fe(M, l + 2, E).times(s + ""))), c = k(c, new M(g), l, 1), n == null) if (Q(c.d, l - v, _, u)) M.precision = l += v, f = o = N = k(a.minus(1), a.plus(1), l, 1), d = p(N.times(N), l, 1), r = u = 1;
        else return p(c, M.precision = E, _, w = !0);
        else return M.precision = E, c;
        c = f, r += 2;
    }
}
function $e(e) {
    return String(e.s * e.s / 0);
}
function se(e, n) {
    var i, t, r;
    for((i = n.indexOf(".")) > -1 && (n = n.replace(".", "")), (t = n.search(/e/i)) > 0 ? (i < 0 && (i = t), i += +n.slice(t + 1), n = n.substring(0, t)) : i < 0 && (i = n.length), t = 0; n.charCodeAt(t) === 48; t++);
    for(r = n.length; n.charCodeAt(r - 1) === 48; --r);
    if (n = n.slice(t, r), n) {
        if (r -= t, e.e = i = i - t - 1, e.d = [], t = (i + 1) % m, i < 0 && (t += m), t < r) {
            for(t && e.d.push(+n.slice(0, t)), r -= m; t < r;)e.d.push(+n.slice(t, t += m));
            n = n.slice(t), t = m - n.length;
        } else t -= r;
        for(; t--;)n += "0";
        e.d.push(+n), w && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [
            0
        ]));
    } else e.e = 0, e.d = [
        0
    ];
    return e;
}
function dn(e, n) {
    var i, t, r, s, o, u, c, f, l;
    if (n.indexOf("_") > -1) {
        if (n = n.replace(/(\d)_(?=\d)/g, "$1"), Ie.test(n)) return se(e, n);
    } else if (n === "Infinity" || n === "NaN") return +n || (e.s = NaN), e.e = NaN, e.d = null, e;
    if (un.test(n)) i = 16, n = n.toLowerCase();
    else if (on.test(n)) i = 2;
    else if (fn.test(n)) i = 8;
    else throw Error($ + n);
    for(s = n.search(/p/i), s > 0 ? (c = +n.slice(s + 1), n = n.substring(2, s)) : n = n.slice(2), s = n.indexOf("."), o = s >= 0, t = e.constructor, o && (n = n.replace(".", ""), u = n.length, s = u - s, r = Ue(t, new t(i), s, s * 2)), f = re(n, i, D), l = f.length - 1, s = l; f[s] === 0; --s)f.pop();
    return s < 0 ? new t(e.s * 0) : (e.e = le(f, l), e.d = f, w = !1, o && (e = k(e, r, u * 4)), c && (e = e.times(Math.abs(c) < 54 ? C(2, c) : Y.pow(2, c))), w = !0, e);
}
function hn(e, n) {
    var i, t = n.d.length;
    if (t < 3) return n.isZero() ? n : j(e, 2, n, n);
    i = 1.4 * Math.sqrt(t), i = i > 16 ? 16 : i | 0, n = n.times(1 / ae(5, i)), n = j(e, 2, n, n);
    for(var r, s = new e(5), o = new e(16), u = new e(20); i--;)r = n.times(n), n = n.times(s.plus(r.times(o.times(r).minus(u))));
    return n;
}
function j(e, n, i, t, r) {
    var s, o, u, c, f = 1, l = e.precision, a = Math.ceil(l / m);
    for(w = !1, c = i.times(i), u = new e(t);;){
        if (o = k(u.times(c), new e(n++ * n++), l, 1), u = r ? t.plus(o) : t.minus(o), t = k(o.times(c), new e(n++ * n++), l, 1), o = u.plus(t), o.d[a] !== void 0) {
            for(s = a; o.d[s] === u.d[s] && s--;);
            if (s == -1) break;
        }
        s = u, u = t, t = o, o = s, f++;
    }
    return w = !0, o.d.length = a + 1, o;
}
function ae(e, n) {
    for(var i = e; --n;)i *= e;
    return i;
}
function He(e, n) {
    var i, t = n.s < 0, r = F(e, e.precision, 1), s = r.times(.5);
    if (n = n.abs(), n.lte(s)) return Z = t ? 4 : 1, n;
    if (i = n.divToInt(r), i.isZero()) Z = t ? 3 : 2;
    else {
        if (n = n.minus(i.times(r)), n.lte(s)) return Z = Ae(i) ? t ? 2 : 3 : t ? 4 : 1, n;
        Z = Ae(i) ? t ? 1 : 4 : t ? 3 : 2;
    }
    return n.minus(r).abs();
}
function Me(e, n, i, t) {
    var r, s, o, u, c, f, l, a, d, g = e.constructor, v = i !== void 0;
    if (v ? (q(i, 1, H), t === void 0 ? t = g.rounding : q(t, 0, 8)) : (i = g.precision, t = g.rounding), !e.isFinite()) l = $e(e);
    else {
        for(l = L(e), o = l.indexOf("."), v ? (r = 2, n == 16 ? i = i * 4 - 3 : n == 8 && (i = i * 3 - 2)) : r = n, o >= 0 && (l = l.replace(".", ""), d = new g(1), d.e = l.length - o, d.d = re(L(d), 10, r), d.e = d.d.length), a = re(l, 10, r), s = c = a.length; a[--c] == 0;)a.pop();
        if (!a[0]) l = v ? "0p+0" : "0";
        else {
            if (o < 0 ? s-- : (e = new g(e), e.d = a, e.e = s, e = k(e, d, i, t, 0, r), a = e.d, s = e.e, f = Te), o = a[i], u = r / 2, f = f || a[i + 1] !== void 0, f = t < 4 ? (o !== void 0 || f) && (t === 0 || t === (e.s < 0 ? 3 : 2)) : o > u || o === u && (t === 4 || f || t === 6 && a[i - 1] & 1 || t === (e.s < 0 ? 8 : 7)), a.length = i, f) for(; ++a[--i] > r - 1;)a[i] = 0, i || (++s, a.unshift(1));
            for(c = a.length; !a[c - 1]; --c);
            for(o = 0, l = ""; o < c; o++)l += ve.charAt(a[o]);
            if (v) {
                if (c > 1) if (n == 16 || n == 8) {
                    for(o = n == 16 ? 4 : 3, --c; c % o; c++)l += "0";
                    for(a = re(l, r, n), c = a.length; !a[c - 1]; --c);
                    for(o = 1, l = "1."; o < c; o++)l += ve.charAt(a[o]);
                } else l = l.charAt(0) + "." + l.slice(1);
                l = l + (s < 0 ? "p" : "p+") + s;
            } else if (s < 0) {
                for(; ++s;)l = "0" + l;
                l = "0." + l;
            } else if (++s > c) for(s -= c; s--;)l += "0";
            else s < c && (l = l.slice(0, s) + "." + l.slice(s));
        }
        l = (n == 16 ? "0x" : n == 2 ? "0b" : n == 8 ? "0o" : "") + l;
    }
    return e.s < 0 ? "-" + l : l;
}
function qe(e, n) {
    if (e.length > n) return e.length = n, !0;
}
function pn(e) {
    return new this(e).abs();
}
function gn(e) {
    return new this(e).acos();
}
function mn(e) {
    return new this(e).acosh();
}
function wn(e, n) {
    return new this(e).plus(n);
}
function Nn(e) {
    return new this(e).asin();
}
function vn(e) {
    return new this(e).asinh();
}
function En(e) {
    return new this(e).atan();
}
function kn(e) {
    return new this(e).atanh();
}
function Sn(e, n) {
    e = new this(e), n = new this(n);
    var i, t = this.precision, r = this.rounding, s = t + 4;
    return !e.s || !n.s ? i = new this(NaN) : !e.d && !n.d ? (i = F(this, s, 1).times(n.s > 0 ? .25 : .75), i.s = e.s) : !n.d || e.isZero() ? (i = n.s < 0 ? F(this, t, r) : new this(0), i.s = e.s) : !e.d || n.isZero() ? (i = F(this, s, 1).times(.5), i.s = e.s) : n.s < 0 ? (this.precision = s, this.rounding = 1, i = this.atan(k(e, n, s, 1)), n = F(this, s, 1), this.precision = t, this.rounding = r, i = e.s < 0 ? i.minus(n) : i.plus(n)) : i = this.atan(k(e, n, s, 1)), i;
}
function Mn(e) {
    return new this(e).cbrt();
}
function Cn(e) {
    return p(e = new this(e), e.e + 1, 2);
}
function bn(e, n, i) {
    return new this(e).clamp(n, i);
}
function Pn(e) {
    if (!e || typeof e != "object") throw Error(ce + "Object expected");
    var n, i, t, r = e.defaults === !0, s = [
        "precision",
        1,
        H,
        "rounding",
        0,
        8,
        "toExpNeg",
        -V,
        0,
        "toExpPos",
        0,
        V,
        "maxE",
        0,
        V,
        "minE",
        -V,
        0,
        "modulo",
        0,
        9
    ];
    for(n = 0; n < s.length; n += 3)if (i = s[n], r && (this[i] = Ee[i]), (t = e[i]) !== void 0) if (R(t) === t && t >= s[n + 1] && t <= s[n + 2]) this[i] = t;
    else throw Error($ + i + ": " + t);
    if (i = "crypto", r && (this[i] = Ee[i]), (t = e[i]) !== void 0) if (t === !0 || t === !1 || t === 0 || t === 1) if (t) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[i] = !0;
    else throw Error(Fe);
    else this[i] = !1;
    else throw Error($ + i + ": " + t);
    return this;
}
function On(e) {
    return new this(e).cos();
}
function Rn(e) {
    return new this(e).cosh();
}
function Ve(e) {
    var n, i, t;
    function r(s) {
        var o, u, c, f = this;
        if (!(f instanceof r)) return new r(s);
        if (f.constructor = r, _e(s)) {
            f.s = s.s, w ? !s.d || s.e > r.maxE ? (f.e = NaN, f.d = null) : s.e < r.minE ? (f.e = 0, f.d = [
                0
            ]) : (f.e = s.e, f.d = s.d.slice()) : (f.e = s.e, f.d = s.d ? s.d.slice() : s.d);
            return;
        }
        if (c = typeof s, c === "number") {
            if (s === 0) {
                f.s = 1 / s < 0 ? -1 : 1, f.e = 0, f.d = [
                    0
                ];
                return;
            }
            if (s < 0 ? (s = -s, f.s = -1) : f.s = 1, s === ~~s && s < 1e7) {
                for(o = 0, u = s; u >= 10; u /= 10)o++;
                w ? o > r.maxE ? (f.e = NaN, f.d = null) : o < r.minE ? (f.e = 0, f.d = [
                    0
                ]) : (f.e = o, f.d = [
                    s
                ]) : (f.e = o, f.d = [
                    s
                ]);
                return;
            }
            if (s * 0 !== 0) {
                s || (f.s = NaN), f.e = NaN, f.d = null;
                return;
            }
            return se(f, s.toString());
        }
        if (c === "string") return (u = s.charCodeAt(0)) === 45 ? (s = s.slice(1), f.s = -1) : (u === 43 && (s = s.slice(1)), f.s = 1), Ie.test(s) ? se(f, s) : dn(f, s);
        if (c === "bigint") return s < 0 ? (s = -s, f.s = -1) : f.s = 1, se(f, s.toString());
        throw Error($ + s);
    }
    if (r.prototype = h, r.ROUND_UP = 0, r.ROUND_DOWN = 1, r.ROUND_CEIL = 2, r.ROUND_FLOOR = 3, r.ROUND_HALF_UP = 4, r.ROUND_HALF_DOWN = 5, r.ROUND_HALF_EVEN = 6, r.ROUND_HALF_CEIL = 7, r.ROUND_HALF_FLOOR = 8, r.EUCLID = 9, r.config = r.set = Pn, r.clone = Ve, r.isDecimal = _e, r.abs = pn, r.acos = gn, r.acosh = mn, r.add = wn, r.asin = Nn, r.asinh = vn, r.atan = En, r.atanh = kn, r.atan2 = Sn, r.cbrt = Mn, r.ceil = Cn, r.clamp = bn, r.cos = On, r.cosh = Rn, r.div = An, r.exp = qn, r.floor = _n, r.hypot = Tn, r.ln = Dn, r.log = Fn, r.log10 = In, r.log2 = Ln, r.max = Zn, r.min = Un, r.mod = Bn, r.mul = $n, r.pow = Hn, r.random = Vn, r.round = jn, r.sign = Wn, r.sin = Gn, r.sinh = Jn, r.sqrt = Xn, r.sub = Kn, r.sum = Qn, r.tan = Yn, r.tanh = xn, r.trunc = zn, e === void 0 && (e = {}), e && e.defaults !== !0) for(t = [
        "precision",
        "rounding",
        "toExpNeg",
        "toExpPos",
        "maxE",
        "minE",
        "modulo",
        "crypto"
    ], n = 0; n < t.length;)e.hasOwnProperty(i = t[n++]) || (e[i] = this[i]);
    return r.config(e), r;
}
function An(e, n) {
    return new this(e).div(n);
}
function qn(e) {
    return new this(e).exp();
}
function _n(e) {
    return p(e = new this(e), e.e + 1, 3);
}
function Tn() {
    var e, n, i = new this(0);
    for(w = !1, e = 0; e < arguments.length;)if (n = new this(arguments[e++]), n.d) i.d && (i = i.plus(n.times(n)));
    else {
        if (n.s) return w = !0, new this(1 / 0);
        i = n;
    }
    return w = !0, i.sqrt();
}
function _e(e) {
    return e instanceof Y || e && e.toStringTag === Le || !1;
}
function Dn(e) {
    return new this(e).ln();
}
function Fn(e, n) {
    return new this(e).log(n);
}
function Ln(e) {
    return new this(e).log(2);
}
function In(e) {
    return new this(e).log(10);
}
function Zn() {
    return Be(this, arguments, -1);
}
function Un() {
    return Be(this, arguments, 1);
}
function Bn(e, n) {
    return new this(e).mod(n);
}
function $n(e, n) {
    return new this(e).mul(n);
}
function Hn(e, n) {
    return new this(e).pow(n);
}
function Vn(e) {
    var n, i, t, r, s = 0, o = new this(1), u = [];
    if (e === void 0 ? e = this.precision : q(e, 1, H), t = Math.ceil(e / m), this.crypto) if (crypto.getRandomValues) for(n = crypto.getRandomValues(new Uint32Array(t)); s < t;)r = n[s], r >= 429e7 ? n[s] = crypto.getRandomValues(new Uint32Array(1))[0] : u[s++] = r % 1e7;
    else if (crypto.randomBytes) {
        for(n = crypto.randomBytes(t *= 4); s < t;)r = n[s] + (n[s + 1] << 8) + (n[s + 2] << 16) + ((n[s + 3] & 127) << 24), r >= 214e7 ? crypto.randomBytes(4).copy(n, s) : (u.push(r % 1e7), s += 4);
        s = t / 4;
    } else throw Error(Fe);
    else for(; s < t;)u[s++] = Math.random() * 1e7 | 0;
    for(t = u[--s], e %= m, t && e && (r = C(10, m - e), u[s] = (t / r | 0) * r); u[s] === 0; s--)u.pop();
    if (s < 0) i = 0, u = [
        0
    ];
    else {
        for(i = -1; u[0] === 0; i -= m)u.shift();
        for(t = 1, r = u[0]; r >= 10; r /= 10)t++;
        t < m && (i -= m - t);
    }
    return o.e = i, o.d = u, o;
}
function jn(e) {
    return p(e = new this(e), e.e + 1, this.rounding);
}
function Wn(e) {
    return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
}
function Gn(e) {
    return new this(e).sin();
}
function Jn(e) {
    return new this(e).sinh();
}
function Xn(e) {
    return new this(e).sqrt();
}
function Kn(e, n) {
    return new this(e).sub(n);
}
function Qn() {
    var e = 0, n = arguments, i = new this(n[e]);
    for(w = !1; i.s && ++e < n.length;)i = i.plus(n[e]);
    return w = !0, p(i, this.precision, this.rounding);
}
function Yn(e) {
    return new this(e).tan();
}
function xn(e) {
    return new this(e).tanh();
}
function zn(e) {
    return p(e = new this(e), e.e + 1, 1);
}
h[Symbol.for("nodejs.util.inspect.custom")] = h.toString;
h[Symbol.toStringTag] = "Decimal";
var Y = h.constructor = Ve(Ee);
oe = new Y(oe);
ue = new Y(ue);
var je = Y;
0 && (module.exports = {
    Decimal,
    Public,
    getRuntime,
    makeStrictEnum,
    objectEnumValues
}); /*! Bundled license information:

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/  //# sourceMappingURL=index-browser.js.map
}}),
"[project]/prisma/prisma/generated/client/index-browser.js [middleware-edge] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
Object.defineProperty(exports, "__esModule", {
    value: true
});
const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime, skip } = __turbopack_context__.r("[project]/prisma/prisma/generated/client/runtime/index-browser.js [middleware-edge] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */ Prisma.prismaVersion = {
    client: "6.6.0",
    engine: "f676762280b54cd07c770017ed3711ddde35f37a"
};
Prisma.PrismaClientKnownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;
Prisma.NullTypes = {
    DbNull: objectEnumValues.classes.DbNull,
    JsonNull: objectEnumValues.classes.JsonNull,
    AnyNull: objectEnumValues.classes.AnyNull
};
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.EmailConfigScalarFieldEnum = {
    id: 'id',
    panel: 'panel',
    module: 'module',
    subject: 'subject',
    action: 'action',
    html_template: 'html_template',
    smtp_host: 'smtp_host',
    smtp_secure: 'smtp_secure',
    smtp_port: 'smtp_port',
    smtp_username: 'smtp_username',
    smtp_password: 'smtp_password',
    from_email: 'from_email',
    from_name: 'from_name',
    status: 'status',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole'
};
exports.Prisma.AdminScalarFieldEnum = {
    id: 'id',
    profilePicture: 'profilePicture',
    name: 'name',
    username: 'username',
    website: 'website',
    email: 'email',
    referralCode: 'referralCode',
    password: 'password',
    role: 'role',
    status: 'status',
    dateOfBirth: 'dateOfBirth',
    phoneNumber: 'phoneNumber',
    currentAddress: 'currentAddress',
    permanentAddress: 'permanentAddress',
    permanentPostalCode: 'permanentPostalCode',
    permanentCityId: 'permanentCityId',
    permanentStateId: 'permanentStateId',
    permanentCountryId: 'permanentCountryId',
    pr_token: 'pr_token',
    pr_expires_at: 'pr_expires_at',
    pr_last_reset: 'pr_last_reset',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.CompanyDetailScalarFieldEnum = {
    id: 'id',
    adminId: 'adminId',
    companyName: 'companyName',
    brandName: 'brandName',
    brandShortName: 'brandShortName',
    billingAddress: 'billingAddress',
    billingPincode: 'billingPincode',
    billingState: 'billingState',
    billingCity: 'billingCity',
    businessType: 'businessType',
    clientEntryType: 'clientEntryType',
    gstNumber: 'gstNumber',
    companyPanNumber: 'companyPanNumber',
    aadharNumber: 'aadharNumber',
    gstDocument: 'gstDocument',
    panCardHolderName: 'panCardHolderName',
    aadharCardHolderName: 'aadharCardHolderName',
    panCardImage: 'panCardImage',
    aadharCardImage: 'aadharCardImage',
    additionalDocumentUpload: 'additionalDocumentUpload',
    documentId: 'documentId',
    documentName: 'documentName',
    documentImage: 'documentImage',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.BankAccountScalarFieldEnum = {
    id: 'id',
    adminId: 'adminId',
    accountHolderName: 'accountHolderName',
    accountNumber: 'accountNumber',
    bankName: 'bankName',
    bankBranch: 'bankBranch',
    accountType: 'accountType',
    ifscCode: 'ifscCode',
    cancelledChequeImage: 'cancelledChequeImage',
    paymentMethod: 'paymentMethod',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.AdminStaffScalarFieldEnum = {
    id: 'id',
    admin_id: 'admin_id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    status: 'status',
    pr_token: 'pr_token',
    pr_expires_at: 'pr_expires_at',
    pr_last_reset: 'pr_last_reset',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.LoginLogScalarFieldEnum = {
    id: 'id',
    adminId: 'adminId',
    adminRole: 'adminRole',
    action: 'action',
    response: 'response',
    ipv4: 'ipv4',
    ipv6: 'ipv6',
    internetServiceProvider: 'internetServiceProvider',
    clientInformation: 'clientInformation',
    userAgent: 'userAgent',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.ActivityLogScalarFieldEnum = {
    id: 'id',
    adminId: 'adminId',
    adminRole: 'adminRole',
    module: 'module',
    action: 'action',
    endpoint: 'endpoint',
    method: 'method',
    payload: 'payload',
    response: 'response',
    result: 'result',
    data: 'data',
    ipv4: 'ipv4',
    ipv6: 'ipv6',
    internetServiceProvider: 'internetServiceProvider',
    clientInformation: 'clientInformation',
    userAgent: 'userAgent',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.CountryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    iso3: 'iso3',
    iso2: 'iso2',
    phonecode: 'phonecode',
    currency: 'currency',
    currencyName: 'currencyName',
    currencySymbol: 'currencySymbol',
    nationality: 'nationality',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.StateScalarFieldEnum = {
    id: 'id',
    name: 'name',
    countryId: 'countryId',
    iso2: 'iso2',
    type: 'type',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.CityScalarFieldEnum = {
    id: 'id',
    name: 'name',
    stateId: 'stateId',
    countryId: 'countryId',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.WarehouseScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    gst_number: 'gst_number',
    contact_name: 'contact_name',
    contact_number: 'contact_number',
    address_line_1: 'address_line_1',
    address_line_2: 'address_line_2',
    postal_code: 'postal_code',
    countryId: 'countryId',
    stateId: 'stateId',
    cityId: 'cityId',
    status: 'status',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    image: 'image',
    status: 'status',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.BrandScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    image: 'image',
    status: 'status',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.ProductScalarFieldEnum = {
    id: 'id',
    categoryId: 'categoryId',
    name: 'name',
    slug: 'slug',
    main_sku: 'main_sku',
    description: 'description',
    tags: 'tags',
    brandId: 'brandId',
    originCountryId: 'originCountryId',
    ean: 'ean',
    hsnCode: 'hsnCode',
    taxRate: 'taxRate',
    upc: 'upc',
    rtoAddress: 'rtoAddress',
    pickupAddress: 'pickupAddress',
    shippingCountryId: 'shippingCountryId',
    video_url: 'video_url',
    list_as: 'list_as',
    shipping_time: 'shipping_time',
    weight: 'weight',
    package_length: 'package_length',
    package_width: 'package_width',
    package_height: 'package_height',
    chargeable_weight: 'chargeable_weight',
    package_weight_image: 'package_weight_image',
    package_length_image: 'package_length_image',
    package_width_image: 'package_width_image',
    package_height_image: 'package_height_image',
    product_detail_video: 'product_detail_video',
    training_guidance_video: 'training_guidance_video',
    status: 'status',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.ProductVariantScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    image: 'image',
    color: 'color',
    sku: 'sku',
    qty: 'qty',
    currency: 'currency',
    article_id: 'article_id',
    product_link: 'product_link',
    suggested_price: 'suggested_price',
    shipowl_price: 'shipowl_price',
    rto_suggested_price: 'rto_suggested_price',
    rto_price: 'rto_price',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    createdByRole: 'createdByRole',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    updatedByRole: 'updatedByRole',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.NullableJsonNullValueInput = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.emailConfigOrderByRelevanceFieldEnum = {
    panel: 'panel',
    module: 'module',
    subject: 'subject',
    action: 'action',
    html_template: 'html_template',
    smtp_host: 'smtp_host',
    smtp_username: 'smtp_username',
    smtp_password: 'smtp_password',
    from_email: 'from_email',
    from_name: 'from_name',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole'
};
exports.Prisma.adminOrderByRelevanceFieldEnum = {
    profilePicture: 'profilePicture',
    name: 'name',
    username: 'username',
    website: 'website',
    email: 'email',
    referralCode: 'referralCode',
    password: 'password',
    role: 'role',
    status: 'status',
    phoneNumber: 'phoneNumber',
    currentAddress: 'currentAddress',
    permanentAddress: 'permanentAddress',
    permanentPostalCode: 'permanentPostalCode',
    pr_token: 'pr_token',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.companyDetailOrderByRelevanceFieldEnum = {
    companyName: 'companyName',
    brandName: 'brandName',
    brandShortName: 'brandShortName',
    billingAddress: 'billingAddress',
    billingPincode: 'billingPincode',
    billingState: 'billingState',
    billingCity: 'billingCity',
    businessType: 'businessType',
    clientEntryType: 'clientEntryType',
    gstNumber: 'gstNumber',
    companyPanNumber: 'companyPanNumber',
    aadharNumber: 'aadharNumber',
    gstDocument: 'gstDocument',
    panCardHolderName: 'panCardHolderName',
    aadharCardHolderName: 'aadharCardHolderName',
    panCardImage: 'panCardImage',
    aadharCardImage: 'aadharCardImage',
    additionalDocumentUpload: 'additionalDocumentUpload',
    documentId: 'documentId',
    documentName: 'documentName',
    documentImage: 'documentImage',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.bankAccountOrderByRelevanceFieldEnum = {
    accountHolderName: 'accountHolderName',
    accountNumber: 'accountNumber',
    bankName: 'bankName',
    bankBranch: 'bankBranch',
    accountType: 'accountType',
    ifscCode: 'ifscCode',
    cancelledChequeImage: 'cancelledChequeImage',
    paymentMethod: 'paymentMethod',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.adminStaffOrderByRelevanceFieldEnum = {
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    status: 'status',
    pr_token: 'pr_token',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.loginLogOrderByRelevanceFieldEnum = {
    adminRole: 'adminRole',
    action: 'action',
    response: 'response',
    ipv4: 'ipv4',
    ipv6: 'ipv6',
    internetServiceProvider: 'internetServiceProvider',
    clientInformation: 'clientInformation',
    userAgent: 'userAgent',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.activityLogOrderByRelevanceFieldEnum = {
    adminRole: 'adminRole',
    module: 'module',
    action: 'action',
    endpoint: 'endpoint',
    method: 'method',
    payload: 'payload',
    response: 'response',
    data: 'data',
    ipv4: 'ipv4',
    ipv6: 'ipv6',
    internetServiceProvider: 'internetServiceProvider',
    clientInformation: 'clientInformation',
    userAgent: 'userAgent',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.countryOrderByRelevanceFieldEnum = {
    name: 'name',
    iso3: 'iso3',
    iso2: 'iso2',
    phonecode: 'phonecode',
    currency: 'currency',
    currencyName: 'currencyName',
    currencySymbol: 'currencySymbol',
    nationality: 'nationality',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.stateOrderByRelevanceFieldEnum = {
    name: 'name',
    iso2: 'iso2',
    type: 'type',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.cityOrderByRelevanceFieldEnum = {
    name: 'name',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.warehouseOrderByRelevanceFieldEnum = {
    name: 'name',
    slug: 'slug',
    gst_number: 'gst_number',
    contact_name: 'contact_name',
    contact_number: 'contact_number',
    address_line_1: 'address_line_1',
    address_line_2: 'address_line_2',
    postal_code: 'postal_code',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.categoryOrderByRelevanceFieldEnum = {
    name: 'name',
    slug: 'slug',
    description: 'description',
    image: 'image',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.brandOrderByRelevanceFieldEnum = {
    name: 'name',
    slug: 'slug',
    description: 'description',
    image: 'image',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.JsonNullValueFilter = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull,
    AnyNull: Prisma.AnyNull
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.productOrderByRelevanceFieldEnum = {
    name: 'name',
    slug: 'slug',
    main_sku: 'main_sku',
    description: 'description',
    ean: 'ean',
    hsnCode: 'hsnCode',
    upc: 'upc',
    rtoAddress: 'rtoAddress',
    pickupAddress: 'pickupAddress',
    video_url: 'video_url',
    list_as: 'list_as',
    shipping_time: 'shipping_time',
    package_weight_image: 'package_weight_image',
    package_length_image: 'package_length_image',
    package_width_image: 'package_width_image',
    package_height_image: 'package_height_image',
    product_detail_video: 'product_detail_video',
    training_guidance_video: 'training_guidance_video',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.productVariantOrderByRelevanceFieldEnum = {
    image: 'image',
    color: 'color',
    sku: 'sku',
    currency: 'currency',
    article_id: 'article_id',
    product_link: 'product_link',
    createdByRole: 'createdByRole',
    updatedByRole: 'updatedByRole',
    deletedByRole: 'deletedByRole'
};
exports.Prisma.ModelName = {
    emailConfig: 'emailConfig',
    admin: 'admin',
    companyDetail: 'companyDetail',
    bankAccount: 'bankAccount',
    adminStaff: 'adminStaff',
    loginLog: 'loginLog',
    activityLog: 'activityLog',
    country: 'country',
    state: 'state',
    city: 'city',
    warehouse: 'warehouse',
    category: 'category',
    brand: 'brand',
    product: 'product',
    productVariant: 'productVariant'
};
/**
 * This is a stub Prisma Client that will error at runtime if called.
 */ class PrismaClient {
    constructor(){
        return new Proxy(this, {
            get (target, prop) {
                let message;
                const runtime = getRuntime();
                if (runtime.isEdge) {
                    message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
                } else {
                    message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).';
                }
                message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;
                throw new Error(message);
            }
        });
    }
}
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}}),
"[project]/src/lib/prisma.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$prisma$2f$prisma$2f$generated$2f$client$2f$index$2d$browser$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/prisma/prisma/generated/client/index-browser.js [middleware-edge] (ecmascript)"); // Adjust the import path as necessary
;
const prisma = new __TURBOPACK__imported__module__$5b$project$5d2f$prisma$2f$prisma$2f$generated$2f$client$2f$index$2d$browser$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["PrismaClient"]();
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
"[project]/src/utils/commonUtils.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ActivityLog": (()=>ActivityLog),
    "fetchLogInfo": (()=>fetchLogInfo),
    "logMessage": (()=>logMessage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ua$2d$parser$2d$js$2f$src$2f$main$2f$ua$2d$parser$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/ua-parser-js/src/main/ua-parser.mjs [middleware-edge] (ecmascript)");
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
        const activityLog = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].activityLog.create({
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
        const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ua$2d$parser$2d$js$2f$src$2f$main$2f$ua$2d$parser$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UAParser"](userAgent);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middlewares$2f$adminAuth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/middlewares/adminAuth.ts [middleware-edge] (ecmascript)"); // Import admin middleware
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/commonUtils.ts [middleware-edge] (ecmascript)");
;
;
;
function middleware(req) {
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // Apply CORS headers globally
    res.headers.set("Access-Control-Allow-Origin", "*"); // Change '*' to your frontend URL in production
    // res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Methods", "*");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    console.log(`req.method: ${req.method}`);
    console.log(`req.url: ${req.url}`);
    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: res.headers
        });
    }
    // Apply adminAuthMiddleware to /api/admin/list route
    const adminProtectedRoutes = [
        "/api/admin/list",
        "/api/admin/auth/verify"
    ];
    const dropshipperProtectedRoutes = [
        "/api/dropshipper/list",
        "/api/dropshipper/auth/verify"
    ];
    const supplierProtectedRoutes = [
        "/api/supplier/list",
        "/api/supplier/auth/verify",
        "/api/supplier/profile/:path"
    ];
    const restProtectedRoutes = [
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
        "/api/supplier/:path*",
        "/api/dropshipper",
        "/api/dropshipper/:path*"
    ];
    if (adminProtectedRoutes.some((route)=>req.url.includes(route))) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logMessage"])(`debug`, `URL under AdminProtectedRoutes`);
        const applicableRoles = [
            "admin",
            "admin_staff"
        ];
        const adminRole = "admin";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middlewares$2f$adminAuth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["adminAuthMiddleware"])(req, adminRole, applicableRoles);
    }
    if (dropshipperProtectedRoutes.some((route)=>req.url.includes(route))) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logMessage"])(`debug`, `URL under dropshipperProtectedRoutes`);
        const applicableRoles = [
            "dropshipper",
            "dropshipper_staff"
        ];
        const adminRole = "dropshipper";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middlewares$2f$adminAuth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["adminAuthMiddleware"])(req, adminRole, applicableRoles);
    }
    if (supplierProtectedRoutes.some((route)=>req.url.includes(route))) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logMessage"])(`debug`, `URL under supplierProtectedRoutes`);
        const applicableRoles = [
            "supplier",
            "supplier_staff"
        ];
        const adminRole = "supplier";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middlewares$2f$adminAuth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["adminAuthMiddleware"])(req, adminRole, applicableRoles);
    }
    if (restProtectedRoutes.some((route)=>req.url.includes(route))) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$commonUtils$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["logMessage"])(`debug`, `URL under restProtectedRoutes`);
        const applicableRoles = [
            "admin",
            "admin_staff",
            "dropshipper",
            "dropshipper_staff",
            "supplier",
            "supplier_staff"
        ];
        const adminRole = "admin";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middlewares$2f$adminAuth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["adminAuthMiddleware"])(req, adminRole, applicableRoles);
    }
    return req; // Continue processing for other routes
}
const config = {
    matcher: [
        "/api/admin/list",
        "/api/admin/auth/verify",
        "/api/dropshipper/list",
        "/api/dropshipper/auth/verify",
        "/api/supplier/list",
        "/api/supplier/auth/verify",
        "/api/supplier/profile/:path",
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
        "/api/supplier/:path*",
        "/api/dropshipper",
        "/api/dropshipper/:path*"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__10070c6a._.js.map