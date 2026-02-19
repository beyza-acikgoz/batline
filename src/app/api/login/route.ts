import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    /* MEMBERS API */
    const memberRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/members`
    );

    if (!memberRes.ok) {
      return NextResponse.json(
        { success: false, message: "Members API erişilemedi" },
        { status: 500 }
      );
    }

    const members = await memberRes.json();

    const member = members.find(
      (m: any) => m.E_Mail === email
    );

    if (!member || member.password !== password) {
      return NextResponse.json(
        { success: false, message: "Geçersiz kullanıcı" },
        { status: 401 }
      );
    }

    /* ROLE + REWORK */
    const roleQuery = `
      SELECT 
        r.RoleName,
        COALESCE(rp.IsAllowed, false) AS rework
      FROM Karluna_Mes_UserRoles ur
      JOIN Karluna_Mes_Roles r
        ON r.RoleId = ur.RoleId
      LEFT JOIN Karluna_Mes_ReworkPermissions rp
        ON rp.MemberId = ur.MemberId
      WHERE ur.MemberId = $1
    `;

    const roleResult = await pool.query(roleQuery, [member.id]);

    if (roleResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Kullanıcıya rol atanmadı" },
        { status: 403 }
      );
    }

    const { rolename, rework } = roleResult.rows[0];

    /* JWT */
    const token = jwt.sign(
      {
        sub: member.id,
        memberCode: member.Member_Code,
        firstName: member.Name,
        lastName: member.Surname,
        email: member.E_Mail,
        role: rolename,
        rework,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    /* RESPONSE + COOKIE */
    const res = NextResponse.json({
      success: true,
      firstName: member.Name,
      lastName: member.Surname,
      role: rolename,
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
