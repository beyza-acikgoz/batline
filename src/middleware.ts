import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // Login değilse dashboard'a giremez
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Login olmuş kullanıcı login'e giremesin
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login"
  ]
}
