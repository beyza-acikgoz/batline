import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  const { station, type } = await req.json();
  // type = "FC" | "QC"

  if (!station || !type) {
    return NextResponse.json(
      { error: "station ve type zorunlu" },
      { status: 400 }
    );
  }

  const column = type === "FC" ? "fc" : "qc";

  await pool.query(
    `
    UPDATE karluna_mes_batline_stations_moments
    SET ${column} = TRUE,
        last_update = NOW()
    WHERE station_id = $1
    `,
    [station]
  );

  return NextResponse.json({ success: true });
}
