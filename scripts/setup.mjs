/**
 * One-command local setup: env file, database schema, catalog.
 *
 * Written in Node rather than shell so it works the same on Windows, and made
 * idempotent so re-running after a `git pull` is safe — it never overwrites an
 * existing .env and migrations/seeding are both upserts.
 */
import { existsSync, copyFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const run = (cmd) => {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

if (existsSync('.env')) {
  console.log('.env already exists — leaving it alone');
} else {
  copyFileSync('.env.example', '.env');
  console.log('created .env from .env.example');
}

// `migrate deploy` applies committed migrations without prompting, which is the
// right verb for someone setting up rather than authoring schema changes.
run('npx prisma migrate deploy');
run('npx tsx prisma/seed.ts');

console.log('\nSetup complete. Start the app with:\n\n  npm run dev\n');
