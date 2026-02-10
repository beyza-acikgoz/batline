import sql from "mssql";
import 'dotenv/config';

const config: sql.config = {
  user: process.env.DB_USER ?? "default_user",
  password: process.env.DB_PASS ?? "default_password",
  server: process.env.DB_SERVER ?? "localhost",
  database: process.env.DB_NAME ?? "default_db",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Connection pool (tek sefer oluşturulur)
const poolPromise = new sql.ConnectionPool(config).connect();

// Burada parametreye tip ekleyerek noImplicitAny hatasını önlüyoruz
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qr = searchParams.get("qr");

    // QR kontrolü
    if (!qr) {
      return Response.json({
        success: false,
        error: "qr parametresi gerekli",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      // NVARCHAR(50)
      .input("Battery_Pack_QR_Code", sql.NVarChar(50), qr)
      // OUTPUT parametre
      .output("Process_Status", sql.BigInt)
      .execute("Battery_Module_Load_01");

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
