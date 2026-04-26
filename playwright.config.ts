import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  // workers: process.env.CI ? 1 : 1,
  reporter: [['html'], ['list']],
  use: {
    trace: 'retain-on-failure',
  },
  // use: {
  //   extraHTTPHeaders: {
  //   },
  //   httpCredentials: {
  //     username: '',
  //     password: ''
  //   }
  // },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-testing',
      testMatch: 'example*',
      dependencies: ['smoke-test'] // run smoke-tests before api-testing
    },
    {
      name: 'api-smoke-test',
      testDir: './tests/api-tests',
      testMatch: 'example*'
    },
    {
      name: 'ui-tests',
      testDir: './tests/ui-tests',
      use: {
        defaultBrowserType: 'chromium',
      }
    }
  ]
});

