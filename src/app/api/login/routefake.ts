import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const users = [
  { email: "operator@test.com", password: "1234", role: "Operatör", firstName: "Ali", lastName: "Veli" },
  { email: "quality@test.com", password: "1234", role: "Kalite Mühendisi", firstName: "Ayşe", lastName: "Fatma" },
  { email: "test@test.com", password: "1234", role: "Test Mühendisi", firstName: "Ömer", lastName: "Can" },
  { email: "admin@test.com", password: "1234", role: "Yetkin", firstName: "Beyza", lastName: "Açıkgöz" },
];

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Geçersiz kullanıcı" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
    { email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
    );



    const res = NextResponse.json({
      success: true,
      token,
      role: user.role, // frontend’de yönlendirme için işine yarar
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 saat
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" , error: (err as Error).message},
      { status: 500 }
    );
  }
}
