import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, rework_reason FROM karluna_mes_forms_rework_reasons ORDER BY id'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    client.release(); 
  }
}


// export async function POST(req: NextRequest) {
//   try {
//     const { rework_reason } = await req.json();

//     if (!rework_reason?.trim()) {
//       return NextResponse.json(
//         { error: 'Rework reason boş olamaz' },
//         { status: 400 }
//       );
//     }

//     const result = await query(
//       'INSERT INTO karluna_mes_forms_rework_reasons (rework_reason) VALUES ($1) RETURNING *',
//       [rework_reason.trim()]
//     );

//     return NextResponse.json(result[0]);
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json();

//     await query(
//       'DELETE FROM karluna_mes_forms_rework_reasons WHERE id = $1',
//       [id]
//     );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
