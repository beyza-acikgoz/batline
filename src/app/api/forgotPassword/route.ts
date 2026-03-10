// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";
import { sendResetMail } from "@/lib/mail";


export async function POST(req: Request) {
  const { email } = await req.json();

  const users = await query(
    `SELECT id FROM karluna_mes_members WHERE email = $1`,
    [email]
  );

  if (!users.length) {
    // Güvenlik için yine de OK dön
    return NextResponse.json({ ok: true });
  }


  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 dk
 
  await query(
    `UPDATE karluna_mes_members 
     SET reset_token=$1, reset_token_expires=$2 
     WHERE email=$3`,
    [token, expires, email]
  );

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword?token=${token}`;
  await sendResetMail(email, resetLink);


  //  burada nodemailer / resend / smtp
  console.log("RESET LINK:", resetLink);

  return NextResponse.json({ ok: true });
}
