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
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/unauthorized")
  ) {
    return NextResponse.next();
  }

  /* =====================
     FORMS → TOKEN ŞART
  ====================== */
  if (pathname.startsWith("/forms") && !token) {
    console.log("[MIDDLEWARE] TOKEN YOK");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token) {
    return NextResponse.next();
  }

  /* =====================
     TOKEN VERIFY (EDGE SAFE)
  ====================== */
  let role: string;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const { payload } = await jwtVerify(token, secret);

    role = String(payload.role)
      .toLowerCase()
      .replace(/\s+/g, "_");

  } catch (err) {
    console.log("[MIDDLEWARE] TOKEN GEÇERSİZ (EDGE)");
    return NextResponse.rewrite(
      new URL("/unauthorized", req.url)
    );
  }

  console.log("[MIDDLEWARE] ROLE =", role, "| PATH =", pathname);

  /* =====================
     ADMIN & YETKİN
  ====================== */
  if (SUPER_ROLES.includes(role)) {
    return NextResponse.next();
  }

  /* =====================
     FC
  ====================== */
  if (pathname.startsWith("/forms/fc")) {
    if (role === "operator" || role === "test_engineer") {
      return NextResponse.next();
    }

    console.log("[MIDDLEWARE] FC YETKİ YOK:", role);
    return NextResponse.rewrite(
      new URL(`/unauthorized?role=${role}`, req.url)
    );
  }

  /* =====================
     QC
  ====================== */
  if (pathname.startsWith("/forms/qc")) {
    if (role === "quality_engineer") {
      return NextResponse.next();
    }

    console.log("[MIDDLEWARE] QC YETKİ YOK:", role);
    return NextResponse.rewrite(
      new URL(`/unauthorized?role=${role}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
