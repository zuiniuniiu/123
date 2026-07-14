const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [['html', { outputFolder: 'test-reports' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'msedge',
      use: { channel: 'msedge', browserName: 'chromium', headless: true },
    },
    {
      name: 'chromium',
      use: { browserName: 'chromium', headless: true },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox', headless: true },
    },
  ],
});
