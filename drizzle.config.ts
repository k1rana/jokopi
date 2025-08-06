import type { Config } from "drizzle-kit";

export default {
  schema: "./src/infra/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: String(process.env.DATABASE_URL),
  },
  dialect: "postgresql",
  verbose: true,
  strict: true,
} satisfies Config;
