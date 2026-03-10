export const revalidate = 3600;
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ stationCode: string; category: string }> }
) {

  const { stationCode, category } = await context.params;

  const categoryMap: Record<string, string> = {
    fc: "PROCESS",
    qc: "QUALITY",
  };

  const categoryCode = categoryMap[category.toLowerCase()];

  if (!categoryCode) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  try {
    const sql = `
      SELECT t.formtitle, t.jsonschema,  s.modulecount AS module_count
      FROM karluna_mes_forms_templates t
      JOIN karluna_mes_stations s ON s.stationid = t.stationid
      JOIN karluna_mes_form_categories c ON c.categoryid = t.categoryid
      WHERE LOWER(s.stationcode) = LOWER($1)
        AND c.categorycode = $2
        AND t.isactive = true
      LIMIT 1
    `;

    const rows = await query(sql, [stationCode, categoryCode]);

    if (!rows.length) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }


    const schema =
      typeof rows[0].jsonschema === "string"
        ? JSON.parse(rows[0].jsonschema)
        : rows[0].jsonschema;


    // PACKLOAD ÖZEL EK ALANLAR
    const moduleCount = rows[0].module_count ?? 0;

    if (stationCode.toLowerCase() === "packload" && moduleCount > 0) {

      const preFields = Array.from({ length: moduleCount }, (_, i) => ({
        name: `module_qr_${i + 1}`,
        label: `Modül QR ${i + 1}`,
        type: "text",
        required: true
      }));

      schema.fields = [...preFields, ...schema.fields];
    }

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