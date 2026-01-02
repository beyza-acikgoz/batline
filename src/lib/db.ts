import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL .env içinde tanımlı değil!");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
