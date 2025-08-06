import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db: NodePgDatabase = drizzle(pool);

  console.log("[migrate] Running migrations ...");

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("[migrate] All migrations have been ran, exiting.");

  await pool.end();
}

main();
