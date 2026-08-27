/**
 * Build the throwaway database the end-to-end suite runs against.
 *
 * This runs from the npm script rather than Playwright's globalSetup because
 * Playwright starts the web server first: by the time globalSetup ran, the app
 * had already opened an empty file and was failing every request with
 * TableDoesNotExist.
 *
 * Kept separate from dev.db so running the tests never disturbs whatever the
 * developer was looking at.
 */
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const env = { ...process.env, DATABASE_URL: 'file:./e2e.db' };
for (const suffix of ['', '-journal', '-wal', '-shm']) {
  rmSync(`e2e.db${suffix}`, { force: true });
}
execSync('npx prisma migrate deploy', { stdio: 'inherit', env });
execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env });
