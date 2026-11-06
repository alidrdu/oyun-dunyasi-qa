// @ts-check
const { defineConfig } = require('@playwright/test');

// Uygulama bir Android tablette (yatay) çalışıyor; testleri de tablet boyutunda ve dokunmatik olarak koşuyoruz.
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    viewport: { width: 1280, height: 800 },
    hasTouch: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'tablet-chromium', use: { browserName: 'chromium' } }],
});
