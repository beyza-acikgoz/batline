import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await import("next/headers").then(m => m.cookies());
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // JWT payload'ı hızlı decode (verify middleware'de yapılmalı)
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    return NextResponse.json({
      success: true,
      user: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        rework: payload.rework,
        roleDescription: payload.roleDescription,
      },
    });
  } catch (err) {
    console.error("ME API ERROR:", err);
    return NextResponse.json({ success: false }, { status: 401 });
  }
}