import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    javaScriptEnabled: false,
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node dist/api/apps/codex-poc-api/src/main.js',
      url: 'http://localhost:3001/api/health',
      reuseExistingServer: false,
    },
    {
      command: 'pnpm exec next start apps/codex-poc-frontend --port 3000',
      url: 'http://localhost:3000',
      env: { API_BASE_URL: 'http://localhost:3001' },
      reuseExistingServer: false,
    },
    {
      command: 'pnpm exec next start apps/codex-poc-frontend --port 3002',
      url: 'http://localhost:3002',
      env: { API_BASE_URL: 'http://127.0.0.1:3999' },
      reuseExistingServer: false,
    },
  ],
});
