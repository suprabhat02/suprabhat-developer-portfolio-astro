import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 1 : 0,
  // In CI, also emit annotations so failing tests are named on the check run.
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'on-first-retry' },
  // Tests run against the production build; run `npm run build` first.
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
  projects:
    process.env.DEVICE_MATRIX === '1'
      ? [
          { name: 'iphone-small', use: { ...devices['iPhone SE'] } },
          { name: 'iphone', use: { ...devices['iPhone 13'] } },
          { name: 'iphone-large', use: { ...devices['iPhone 13 Pro Max'] } },
          { name: 'android-small', use: { ...devices['Galaxy S9+'] } },
          { name: 'android', use: { ...devices['Pixel 7'] } },
          { name: 'ipad', use: { ...devices['iPad Mini'] } },
          {
            name: 'ipad-landscape',
            use: {
              ...devices['iPad Pro 11'],
              viewport: { width: 1194, height: 834 },
            },
          },
          {
            name: 'android-tablet',
            use: {
              ...devices['Pixel 7'],
              viewport: { width: 800, height: 1280 },
            },
          },
          {
            name: 'laptop',
            use: {
              ...devices['Desktop Chrome'],
              viewport: { width: 1366, height: 768 },
            },
          },
          {
            name: 'wide-desktop',
            use: {
              ...devices['Desktop Chrome'],
              viewport: { width: 1920, height: 1080 },
            },
          },
          {
            name: 'firefox',
            use: {
              ...devices['Desktop Firefox'],
              viewport: { width: 1440, height: 900 },
            },
          },
          {
            name: 'webkit-desktop',
            use: {
              ...devices['Desktop Safari'],
              viewport: { width: 1440, height: 900 },
            },
          },
        ]
      : [
          { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
          { name: 'mobile', use: { ...devices['Pixel 7'] } },
        ],
});
