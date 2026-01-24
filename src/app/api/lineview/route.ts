import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM karluna_mes_batline_stations_moments
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("LINEVIEW API ERROR:", error);

    return NextResponse.json(
      { error: "Lineview data alınamadı" },
      { status: 500 }
    );
  }
}
