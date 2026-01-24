import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT DISTINCT
        c.product_qr,
        c.current_station
      FROM karluna_mes_batline_conveyor_products c
      JOIN karluna_mes_batline_stations_moments s
        ON s.qr_text = c.product_qr
      WHERE
        s.station_id NOT LIKE '%_Buffer%'
        AND s.station_id NOT LIKE 'QC_Buffer%'
      ORDER BY c.product_qr
      `
    );

    return NextResponse.json(result.rows);
  } finally {
    client.release();
  }
}
