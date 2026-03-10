import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SUPER_ROLES = ["admin", "qualified"];

// Public yollar (login sayfası, API, _next, görseller vs.)
const PUBLIC_PATHS = [
  "/login",
  "/forgotPassword",
  "/resetPassword",
  "/unauthorized",
  "/api",
  "/_next",
  "/favicon.ico",
  "/batline.png",
  "/logowrite.png",
  "/logicanlogo.png",
  "/batteryqr.png",
  "/image/pages/auth-v2-login-illustration-dark.png",
  "/image/pages/auth-v2-login-illustration-light.png",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Public route ise direkt geç
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Token yoksa login sayfasına yönlendir
  if (!token) {
    console.log("[MIDDLEWARE] TOKEN YOK:", pathname);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Token verify
  let role: string;
  let rework: boolean;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    role = String(payload.role).toLowerCase().replace(/\s+/g, "_");
    rework = Boolean(payload.rework);
  } catch (err) {
    console.log("[MIDDLEWARE] TOKEN GEÇERSİZ");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("[MIDDLEWARE] ROLE =", role, "| PATH =", pathname, "REWORK =", rework);

  // SUPER_ROLES direkt geçebilir
  if (SUPER_ROLES.includes(role)) return NextResponse.next();

  // FC form yetkisi
  if (pathname.startsWith("/forms/fc")) {
    if (role === "operator" || role === "test_engineer") return NextResponse.next();
    console.log("[MIDDLEWARE] FC YETKİ YOK:", role);
    return NextResponse.redirect(new URL(`/unauthorized?role=${role}`, req.url));
  }

  // QC form yetkisi
  if (pathname.startsWith("/forms/qc")) {
    if (role === "quality_engineer") return NextResponse.next();
    console.log("[MIDDLEWARE] QC YETKİ YOK:", role);
    return NextResponse.redirect(new URL(`/unauthorized?role=${role}`, req.url));
  }

  // Rework sayfaları
  if (pathname.startsWith("/rework/start") || pathname.startsWith("/rework/finish")) {
    if (rework) return NextResponse.next();
    console.log("[MIDDLEWARE] REWORK DURUMU UYGUN DEĞİL:", rework);
    return NextResponse.redirect(new URL(`/unauthorized?role=${role}`, req.url));
  }

  // Diğer tüm route’lar
  return NextResponse.next();
}

// Matcher: tüm sayfalar, public asset’ler hariç
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|batline.png|logowrite.png|logicanlogo.png|batteryqr.png|image/pages/auth-v2-login-illustration-dark.png|image/pages/auth-v2-login-illustration-light.png).*)"],
};