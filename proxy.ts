import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

  /* PUBLIC ROUTES */
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/image")
  ) {
    return NextResponse.next();
  }


  /*  PAGE ROUTES (REDIRECT OK) */

  // dashboard auth
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // FORMS → sadece qualified
  // if (pathname.startsWith("/dashboard/forms")) {
  //   if (role !== "qualified") {
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }
  // }

  // // USERS & ROLES → admin + qualified
  // if (
  //   pathname.startsWith("/dashboard/users") ||
  //   pathname.startsWith("/dashboard/roles")
  // ) {
  //   if (role !== "admin" && role !== "qualified") {
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/logout).*)"],
};
