import sql from "mssql";
import "dotenv/config";

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
const poolPromise = new sql.ConnectionPool(config).connect();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qr = searchParams.get("qr");

    if (!qr) {
      return Response.json({
        success: false,
        error: "qr parametresi gerekli",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Battery_Pack_QR_Code", sql.NVarChar, qr)
      .output("Process_Status", sql.BigInt)
      .execute("dbo.Battery_Module_Load_01");

    return Response.json({
      success: true,
      data: result.recordset,
      processStatus: result.output.Process_Status,
    });
  } catch (err: any) {
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}