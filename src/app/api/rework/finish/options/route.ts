import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();

  try {
    const res = await client.query(`
      SELECT r.product_qr, r.rework_target_station, s.qr_text, s.has_qr, s.product_id
      FROM karluna_mes_batline_rework_products r
      JOIN karluna_mes_batline_stations_moments s
        ON s.station_id = r.rework_target_station
      WHERE (s.qr_text IS NULL OR s.qr_text = '')
        AND s.has_qr = FALSE
        AND s.product_id = FALSE
      ORDER BY r.id DESC
    `);

    // Sadece seçilebilir olanlar
    const options = res.rows.map((row) => ({
      product_qr: row.product_qr,
      rework_target_station: row.rework_target_station,
    }));

    return NextResponse.json(options);
  } finally {
    client.release();
  }
}
