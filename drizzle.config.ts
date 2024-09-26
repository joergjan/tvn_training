import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "src/lib/server/db/schema/schema.ts",
  out: "src/lib/server/db/migrations",
  dbCredentials: {
    url: process.env.DB_URL || "",
  },
});
