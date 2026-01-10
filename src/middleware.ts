import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SUPER_ROLES = ["admin", "qualified"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  /* =====================
     PUBLIC ROUTES
  ====================== */
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/image") ||
    pathname.startsWith("/unauthorized")
  ) {
    return NextResponse.next();
  }

  /* =====================
     ROOT → LOGIN
  ====================== */
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* =====================
     TOKEN ZORUNLU
  ====================== */
  if (!token) {
    console.log("[MIDDLEWARE] TOKEN YOK:", pathname);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* =====================
     TOKEN VERIFY
  ====================== */
  let role: string;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    role = String(payload.role)
      .toLowerCase()
      .replace(/\s+/g, "_");
  } catch (err) {
    console.log("[MIDDLEWARE] TOKEN GEÇERSİZ");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("[MIDDLEWARE] ROLE =", role, "| PATH =", pathname);

  /* =====================
     ADMIN & YETKİLİ
  ====================== */
  if (SUPER_ROLES.includes(role)) {
    return NextResponse.next();
  }

  /* =====================
     FORMS / FC
  ====================== */
  if (pathname.startsWith("/forms/fc")) {
    if (role === "operator" || role === "test_engineer") {
      return NextResponse.next();
    }

    console.log("[MIDDLEWARE] FC YETKİ YOK:", role);
    return NextResponse.redirect(
      new URL(`/unauthorized?role=${role}`, req.url)
    );
  }

  /* =====================
     FORMS / QC
  ====================== */
  if (pathname.startsWith("/forms/qc")) {
    if (role === "quality_engineer") {
      return NextResponse.next();
    }

    console.log("[MIDDLEWARE] QC YETKİ YOK:", role);
    return NextResponse.redirect(
      new URL(`/unauthorized?role=${role}`, req.url)
    );
  }

  /* =====================
     DİĞER ROUTES
  ====================== */
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/public/image/pages/auth-v2-login-illustration-dark.png", "/public/image/pages/auth-v2-login-illustration-light.png", "/public"],
};
