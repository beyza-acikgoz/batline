// src/app/api/forms/[stationCode]/[category]/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ stationCode: string; category: string }> }
) {
  const { stationCode, category } = await params;

  const categoryMap: Record<string, string> = {
    fc: "PROCESS",
    qc: "QUALITY",
  };

  const categoryCode = categoryMap[category.toLowerCase()];
  if (!categoryCode) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const query = `
      SELECT t.formtitle, t.jsonschema
      FROM karluna_mes_forms_templates t
      JOIN karluna_mes_stations s ON s.stationid = t.stationid
      JOIN karluna_mes_form_categories c ON c.categoryid = t.categoryid
      WHERE LOWER(s.stationcode) = LOWER($1)
        AND c.categorycode = $2
        AND t.isactive = true
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [stationCode, categoryCode]);

    if (!rows.length) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const schema =
      typeof rows[0].jsonschema === "string"
        ? JSON.parse(rows[0].jsonschema)
        : rows[0].jsonschema;

    return NextResponse.json({
      title: rows[0].formtitle,
      schema,
    });
  } catch (err) {
    console.error("GET /api/forms error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
