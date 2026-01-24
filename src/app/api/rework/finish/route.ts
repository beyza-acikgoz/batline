import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  const {
    productQr,
    result, // success | fail
    actions,
    changedParts,
    returnStatus, // line | buffer | scrap
    description,
    user,
    formStartedAt,
    completedTime,
    formDurationSeconds,
    finishedAt,
  } = await req.json();

  if (!productQr || !finishedAt) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //  Rework ürünü al
    const reworkRes = await client.query(
      `SELECT * FROM karluna_mes_batline_rework_products WHERE product_qr = $1 ORDER BY id DESC LIMIT 1`,
      [productQr]
    );
    if (reworkRes.rowCount === 0) throw new Error("Rework ürünü bulunamadı");
    const reworkProduct = reworkRes.rows[0];
    const snapshot = reworkProduct.product_snapshot;
    const targetStation = reworkProduct.rework_target_station;

    //  İstasyon kontrol
    const stationRes = await client.query(
      `SELECT * FROM karluna_mes_batline_stations_moments WHERE station_id = $1 LIMIT 1`,
      [targetStation]
    );
    if (stationRes.rowCount === 0) throw new Error(`İstasyon bulunamadı: ${targetStation}`);
    const station = stationRes.rows[0];
    if (station.product_id || station.has_qr || station.qr_text) {
      throw new Error("İstasyon dolu, rework bitirilemez");
    }

    //  Snapshot’ı conveyor_products tablosuna ekle
    await client.query(
      `
      INSERT INTO karluna_mes_batline_conveyor_products (
          product_qr,
          current_station,

          packload_fc, packload_fc_data,
          packload_qc, packload_qc_data,

          m2p_fc, m2p_fc_data,
          m2p_qc, m2p_qc_data,

          bms_fc, bms_fc_data,
          bms_qc, bms_qc_data,

          wiring_fc, wiring_fc_data,
          wiring_qc, wiring_qc_data,

          cd_fc, cd_fc_data,
          cd_qc, cd_qc_data,

          qc_fc, qc_fc_data,
          qc_qc, qc_qc_data,

          packload_rework_data,
          m2p_rework_data,
          bms_rework_data,
          wiring_rework_data,
          cd_rework_data,
          qc_rework_data,

          created_at,
          updated_at
      ) VALUES (
          $1, $2,

          $3, $4,
          $5, $6,

          $7, $8,
          $9, $10,

          $11, $12,
          $13, $14,

          $15, $16,
          $17, $18,

          $19, $20,
          $21, $22,

          $23, $24,
          $25, $26,

          $27, $28,
          $29, $30,
          $31, $32,
          NOW(),
          NOW()
      )
      `,
      [
        productQr,
        targetStation,

        snapshot.packload_fc,
        snapshot.packload_fc_data,
        snapshot.packload_qc,
        snapshot.packload_qc_data,

        snapshot.m2p_fc,
        snapshot.m2p_fc_data,
        snapshot.m2p_qc,
        snapshot.m2p_qc_data,

        snapshot.bms_fc,
        snapshot.bms_fc_data,
        snapshot.bms_qc,
        snapshot.bms_qc_data,

        snapshot.wiring_fc,
        snapshot.wiring_fc_data,
        snapshot.wiring_qc,
        snapshot.wiring_qc_data,

        snapshot.cd_fc,
        snapshot.cd_fc_data,
        snapshot.cd_qc,
        snapshot.cd_qc_data,

        snapshot.qc_fc,
        snapshot.qc_fc_data,
        snapshot.qc_qc,
        snapshot.qc_qc_data,

        snapshot.packload_rework_data,
        snapshot.m2p_rework_data,
        snapshot.bms_rework_data,
        snapshot.wiring_rework_data,
        snapshot.cd_rework_data,
        snapshot.qc_rework_data,
      ]
    );

    //  Rework start & finish datasını istasyonun Rework_Data kolonuna ekle
    const reworkColumn = `"${targetStation.toLowerCase()}_rework_data"`;

    const existingReworkRes = await client.query(
      `SELECT ${reworkColumn} FROM karluna_mes_batline_conveyor_products WHERE product_qr = $1`,
      [productQr]
    );
    const existingReworkData = (existingReworkRes.rowCount ?? 0) > 0
    ? existingReworkRes.rows[0][reworkColumn]
    : null;

    const reworkData = {
      start: reworkProduct.rework_start_data || {},
      finish: {
        productQr,
        result,
        actions,
        changedParts,
        returnStatus,
        description,
        user,
        formStartedAt,
        completedTime,
        formDurationSeconds,
        finishedAt,
      },
      station: targetStation,
    };

    const updatedReworkData = existingReworkData
      ? { ...existingReworkData, ...reworkData }
      : reworkData;

    await client.query(
      `UPDATE karluna_mes_batline_conveyor_products
       SET ${reworkColumn} = $1
       WHERE product_qr = $2`,
      [updatedReworkData, productQr]
    );

    //  İstasyonu update et
    await client.query(
      `UPDATE karluna_mes_batline_stations_moments
       SET qr_text = $1, has_qr = TRUE, product_id = TRUE
       WHERE station_id = $2`,
      [productQr, targetStation]
    );

    //  Rework ürününü sil
    await client.query(
      `DELETE FROM karluna_mes_batline_rework_products WHERE id = $1`,
      [reworkProduct.id]
    );

    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("REWORK FINISH ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
