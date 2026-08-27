// IMPORTANT: dotenv must load before anything else — prisma.config.ts does NOT auto-load .env.
import 'dotenv/config';

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Falls back rather than using env('DATABASE_URL'), which throws when the
    // variable is missing. `prisma generate` runs from postinstall on a fresh
    // clone, before setup has written .env, and generating the client needs no
    // real connection — failing there would break `npm install` itself.
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
});
