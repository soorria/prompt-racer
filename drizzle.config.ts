import { defineConfig } from "drizzle-kit"

import { env } from "~/env"

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
  entities: {
    roles: {
      provider: "supabase",
    },
  },
})
