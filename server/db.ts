import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/bilka_howto";

export const pool = new Pool({
  connectionString,
  max: 10,
});

export async function dbQuery<T = any>(text: string, params: any[] = []) {
  const res = await pool.query<T>(text, params);
  return res;
}
