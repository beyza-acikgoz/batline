import { query } from "@/lib/db";

// QR'ya göre kayıt getir
export async function getByQr(qr: string) {
  const rows = await query(
    `
    SELECT *
    FROM karluna_mes_batline_stations_moments
    WHERE qr_text = $1
    `,
    [qr]
  );

  return rows[0] ?? null;
}

// Station ID'ye göre kayıt getir
export async function getStation(stationId: string) {
  const rows = await query(
    `
    SELECT *
    FROM karluna_mes_batline_stations_moments
    WHERE station_id = $1
    `,
    [stationId]
  );

  return rows[0] ?? null;
}

// PackLoad'a QR ata
export async function assignQrToPackLoad(qr: string) {
  await query(
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