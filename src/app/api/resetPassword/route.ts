import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const users = await query(
    `
    SELECT id FROM karluna_mes_members
    WHERE reset_token = $1
    AND reset_token_expires > NOW()
    `,
    [token]
  );

  if (!users.length) {
    return NextResponse.json(
      { error: "Link geçersiz veya süresi dolmuş" },
      { status: 400 }
    );
  }

  const hashed = await hashPassword(password);

  await query(
    `
    UPDATE karluna_mes_members
    SET password=$1, reset_token=NULL, reset_token_expires=NULL
    WHERE id=$2
    `,
    [hashed, users[0].id]
  );

  return NextResponse.json({ ok: true });
}
