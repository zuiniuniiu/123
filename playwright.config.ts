import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results.json' }]],
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'msedge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        launchOptions: { args: ['--no-sandbox', '--disable-gpu'] },
      },
    },
  ],
  webServer: {
    command: 'dotnet run --project src/LibrarySeatReservation.Web/LibrarySeatReservation.Web.csproj --urls http://localhost:5000',
    port: 5000,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
