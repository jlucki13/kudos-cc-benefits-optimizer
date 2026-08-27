import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Some CI images ship prebuilt browsers at a shared path (chromium build 1194,
// which is what @playwright/test@1.56.0 expects). Point at it only when it is
// really there — hardcoding it breaks every machine that has its own browsers
// installed the normal way, via `npx playwright install`.
const E2E_PORT = 3100;
const E2E_URL = `http://localhost:${E2E_PORT}`;

const SHARED_BROWSERS = '/opt/pw-browsers';
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(SHARED_BROWSERS)) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = SHARED_BROWSERS;
}

export default defineConfig({
  testDir: 'tests/e2e',
  // The suite shares one SQLite database and mutates it (adding a card, claiming
  // a credit), so tests must not race each other.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: E2E_URL,
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    // Its own port and database: the suite asserts exact figures, so reusing a
    // dev server (with a different date override or a wallet someone has been
    // clicking around in) would make failures meaningless.
    command: `npm run dev -- --port ${E2E_PORT}`,
    url: E2E_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: 'file:./e2e.db',
      // Frozen so assertions about days-remaining and expired periods stay
      // true tomorrow. Without this the suite rots as real time passes.
      KUDOS_AS_OF: '2026-08-24',
    },
  },
});
