import { pool } from "@/lib/db";

export async function getByQr(qr: string) {
  const res = await pool.query(
    `SELECT * FROM karluna_mes_batline_stations_moments WHERE qr_text = $1`,
    [qr]
  );
  return res.rows[0] ?? null;
}

export async function getStation(stationId: string) {
  const res = await pool.query(
    `SELECT * FROM karluna_mes_batline_stations_moments WHERE station_id = $1`,
    [stationId]
  );
  return res.rows[0];
}
 
export async function assignQrToPackLoad(qr: string) {
  await pool.query(
    `
    UPDATE karluna_mes_batline_stations_moments
    SET
      qr_text = $1,
      has_qr = true,
      product_id = true,
      fc = false,
      done = false,
      qc = false,
      last_update = NOW()
    WHERE station_id = 'PackLoad'
    `,
    [qr]
  );
}
