import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ALLOWED_STATIONS = [
  "PackLoad",
  "M2P",
  "BMS",
  "Wiring",
  "CD",
  "QC",
];

export async function POST(req: Request) {
  const { productQr, station, type, data } = await req.json();
  // type = "FC" | "QC"

  /* ================= VALIDATION ================= */
  if (!productQr || !station || !type || !data) {
    return NextResponse.json(
      { error: "productQr, station, type ve data zorunlu" },
      { status: 400 }
    );
  }

  if (!ALLOWED_STATIONS.includes(station)) {
    return NextResponse.json(
      { error: "Geçersiz istasyon" },
      { status: 400 }
    );
  }

  if (type !== "FC" && type !== "QC") {
    return NextResponse.json(
      { error: "type FC veya QC olmalı" },
      { status: 400 }
    );
  }

  /* ================= COLUMN PREP ================= */
  const momentColumn = type === "FC" ? "fc" : "qc";

  const stationLc = station.toLowerCase();
  const typeLc = type.toLowerCase();
  const conveyorDataColumn = `${stationLc}_${typeLc}_data`;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =====================================================
        CONVEYOR'DA ÜRÜNÜ BAŞLAT (YOKSA EKLE)
    ===================================================== */
    await client.query(
      `
      INSERT INTO karluna_mes_batline_conveyor_products
        (product_qr, current_station)
      VALUES ($1, $2)
      ON CONFLICT (product_qr) DO NOTHING
      `,
      [productQr, station]
    );

    /* =====================================================
       STATION MOMENT GÜNCELLE
    ===================================================== */
    await client.query(
      `
      UPDATE karluna_mes_batline_stations_moments
      SET
        product_id = TRUE,
        qr_text = $2,
        ${momentColumn} = TRUE,
        last_update = NOW()
      WHERE station_id = $1
      `,
      [station, productQr]
    );

    /* =====================================================
       CONVEYOR FORM DATA YAZ
    ===================================================== */
    const updateResult = await client.query(
      `
      UPDATE karluna_mes_batline_conveyor_products
      SET
        ${conveyorDataColumn} = $1,
        current_station = $3,
        updated_at = NOW()
      WHERE product_qr = $2
      RETURNING *
      `,
      [data, productQr, station]
    );

    if (updateResult.rowCount === 0) {
      throw new Error("Ürün conveyor tablosunda bulunamadı");
    }

    const productRow = updateResult.rows[0];

    /* =====================================================
       FINAL QC KONTROLÜ
       QC → QC datası yazıldıysa ÜRÜN TAMAMLANDI
    ===================================================== */
    const isFinalQc =
      station === "QC" &&
      type === "QC" &&
      productRow.qc_qc_data != null;

    if (isFinalQc) {
      /* ================= COMPLETED'E KOPYALA ================= */
      await client.query(
        `
        INSERT INTO karluna_mes_batline_completed_product (
          product_qr,

          PackLoad_FC_Data, PackLoad_QC_Data,
          M2P_FC_Data, M2P_QC_Data,
          BMS_FC_Data, BMS_QC_Data,
          Wiring_FC_Data, Wiring_QC_Data,
          CD_FC_Data, CD_QC_Data,
          QC_FC_Data, QC_QC_Data
        )
        VALUES (
          $1,
          $2, $3,
          $4, $5,
          $6, $7,
          $8, $9,
          $10, $11,
          $12, $13
        )
        ON CONFLICT (product_qr) DO NOTHING
        `,
        [
          productRow.product_qr,

          productRow.packload_fc_data,
          productRow.packload_qc_data,

          productRow.m2p_fc_data,
          productRow.m2p_qc_data,

          productRow.bms_fc_data,
          productRow.bms_qc_data,

          productRow.wiring_fc_data,
          productRow.wiring_qc_data,

          productRow.cd_fc_data,
          productRow.cd_qc_data,

          productRow.qc_fc_data,
          productRow.qc_qc_data,
        ]
      );

      /* ================= CONVEYOR'DAN SİL ================= */
      await client.query(
        `
        DELETE FROM karluna_mes_batline_conveyor_products
        WHERE product_qr = $1
        `,
        [productQr]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      completed: isFinalQc,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Station flag error:", err);

    return NextResponse.json(
      { error: err.message || "DB hatası" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
