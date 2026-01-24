import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
const {
  productQr,
  authorizedUsers,
  location,
  reasons,
  description,
  user,
  formStartedAt,
  completedTime,
  formDurationSeconds,
} = await req.json();


  if (!productQr || !authorizedUsers?.length || !location) {
    return NextResponse.json(
      { error: "Zorunlu alanlar eksik" },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =====================================================
       BUFFER KONTROLÜ
    ===================================================== */
    const bufferCheck = await client.query(
      `
      SELECT station_id
      FROM karluna_mes_batline_stations_moments
      WHERE qr_text = $1
        AND (station_id LIKE '%_Buffer%' OR station_id LIKE 'QC_Buffer%')
      `,
      [productQr]
    );

    if ((bufferCheck.rowCount ?? 0) > 0) {
      throw new Error(
        "Ürün buffer istasyonunda. Buffer'daki ürüne rework başlatılamaz."
      );
    }

    /* =====================================================
       CONVEYOR ÜRÜNÜ AL
    ===================================================== */
    const productRes = await client.query(
      `SELECT * FROM karluna_mes_batline_conveyor_products WHERE product_qr = $1`,
      [productQr]
    );

    if (productRes.rowCount === 0) {
      throw new Error("Ürün conveyor hattında bulunamadı");
    }

    const product = productRes.rows[0];
    const fromStation = product.current_station;

    /* =====================================================
       REWORK START DATA
    ===================================================== */
    const reworkStartData = {
      productQr,
      authorizedUsers,
      reasons,
      description,
      location,

      user,
      formStartedAt,
      completedTime,
      formDurationSeconds,
    };


    /* =====================================================
       HAT ÜZERİNDE REWORK
    ===================================================== */
    if (location === "line") {
      // PostgreSQL kolon isimleri küçük harf → güvenli kullanım
      const reworkFlagColumn = `"${fromStation.toLowerCase()}_rework"`;
      const reworkDataColumn = `"${fromStation.toLowerCase()}_rework_data"`;

      await client.query(
        `
        UPDATE karluna_mes_batline_conveyor_products
        SET
          ${reworkFlagColumn} = TRUE,
          ${reworkDataColumn} = $1,
          updated_at = NOW()
        WHERE product_qr = $2
        `,
        [reworkStartData, productQr]
      );
    }

    /* =====================================================
       HAT DIŞI REWORK
    ===================================================== */
    if (location === "offline") {
      const snapshot = { ...product }; // shallow copy, JSON safe

      await client.query(
        `
        INSERT INTO karluna_mes_batline_rework_products (
          product_qr,
          rework_from_station,
          rework_target_station,
          rework_start_data,
          product_snapshot
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [productQr, fromStation, fromStation, reworkStartData, snapshot]
      );

      // Conveyor'dan sil
      await client.query(
        `DELETE FROM karluna_mes_batline_conveyor_products WHERE product_qr = $1`,
        [productQr]
      );

      // Station moment reset
      await client.query(
        `
        UPDATE karluna_mes_batline_stations_moments
        SET
          qr_text = NULL,
          fc = FALSE,
          qc = FALSE,
          done = FALSE,
          has_qr = FALSE,
          product_id = FALSE
        WHERE qr_text = $1
        `,
        [productQr]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("REWORK START ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
