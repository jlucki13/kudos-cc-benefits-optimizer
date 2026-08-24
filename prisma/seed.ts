// Seed entrypoint (stub). Catalog data and full seeding logic are filled in by W1/W2.
// This stub only guarantees the singleton local User row exists.
import 'dotenv/config';

import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';

import { cards, issuers, pointsCurrencies } from '../src/catalog';
import { PrismaClient } from '../src/generated/prisma/client';

async function main() {
  const adapter = new PrismaBetterSQLite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.user.upsert({ where: { id: 'local' }, update: {}, create: { id: 'local' } });
    console.log(
      `Seeded local user. Catalog: ${issuers.length} issuers, ${pointsCurrencies.length} currencies, ${cards.length} cards.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
