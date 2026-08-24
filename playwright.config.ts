import { defineConfig, devices } from '@playwright/test';

// Preinstalled browsers (chromium build 1194) live here — matches @playwright/test@1.56.0.
// The npm script also sets this before the CLI loads; keep both in sync.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '/opt/pw-browsers';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3000',
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
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
