import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();

  try {
    const res = await client.query(text, params);
    return res.rows;
  } catch (error) {
    console.error("DB QUERY ERROR:", error);
    throw error;
  } finally {
    client.release();
  }
}