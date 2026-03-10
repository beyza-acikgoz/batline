import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pkg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email ve şifre gerekli" },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    /*  KULLANICIYI DB'DEN ÇEK */
    const memberQuery = `
      SELECT id, name, surname, email, password
      FROM karluna_mes_members
      WHERE email = $1
    `;

    const memberResult = await pool.query(memberQuery, [emailNormalized]);

    if (memberResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Geçersiz kullanıcı" },
        { status: 401 }
      );
    }

    const member = memberResult.rows[0];

    /*  HASH KONTROL */
    const passwordMatch = await bcrypt.compare(password, member.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Geçersiz kullanıcı" },
        { status: 401 }
      );
    }

    /* ROLE + REWORK */
    const roleQuery = `
      SELECT 
        r.rolename AS role,
        r.description AS role_description,
        COALESCE(rp.isallowed, false) AS rework
      FROM karluna_mes_userroles ur
      JOIN karluna_mes_roles r
        ON r.roleid = ur.roleid
      LEFT JOIN karluna_mes_reworkpermissions rp
        ON rp.memberid = ur.memberid
      WHERE ur.memberid = $1
    `;

    const roleResult = await pool.query(roleQuery, [member.id]);

    if (roleResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Kullanıcıya rol atanmadı" },
        { status: 403 }
      );
    }

    const { role, role_description, rework } = roleResult.rows[0];

    console.log("LOGIN ROLE:", role); // debug için

    /* =====================
       JWT OLUŞTUR
    ====================== */
    const token = jwt.sign(
      {
        sub: member.id,
        firstName: member.name,
        lastName: member.surname,
        email: member.email,
        role: role,
        rework: rework,
        roleDescription: role_description
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({
      success: true,
      firstName: member.name,
      lastName: member.surname,
      role,
      rework,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return res;

  } catch (err) {
    console.error("LOGIN ERROR", err);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası" },
      { status: 500 }
    );
  }
}