import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { emptiedStation } = await req.json();

  await pool.query(
    "SELECT move_qr_after_delay($1)",
    [emptiedStation]
  );

  return Response.json({ status: "OK" });
}
