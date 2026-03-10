import { query } from "@/lib/db";

const ORDER = [
  "PackLoad",
  "M2P_Buffer",
  "M2P",
  "BMS_Buffer",
  "BMS",
  "Wiring_Buffer",
  "Wiring",
  "CD_Buffer",
  "CD",
  "QC_Buffer1",
  "QC_Buffer2",
  "QC"
];

export async function POST(req: Request) {
  const { station } = await req.json();

  const idx = ORDER.indexOf(station);
  if (idx <= 0) return Response.json({ ok: true });

  const prev = ORDER[idx - 1];

  const rows = await query(
    `SELECT qr_text 
     FROM karluna_mes_batline_stations_moments
     WHERE station_id=$1 AND product_id=true`,
    [prev]
  );

  if (!rows[0]?.qr_text) {
    return Response.json({ ok: true });
  }

  await query(
    `UPDATE karluna_mes_batline_stations_moments
     SET qr_text=$1, product_id=true
     WHERE station_id=$2 AND product_id=false`,
    [rows[0].qr_text, station]
  );

  await query(
    `UPDATE karluna_mes_batline_stations_moments
     SET qr_text=NULL, product_id=false, fc=false, qc=false, done=false
     WHERE station_id=$1`,
    [prev]
  );

  return Response.json({ moved: true });
}