import { Pool } from "pg";

let pool: Pool;

if (!global._postgresPool) {
  global._postgresPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  })
}

pool = global._postgresPool;

export default pool;
