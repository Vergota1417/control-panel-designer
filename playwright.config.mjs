import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',
 testMatch:'**/*.spec.mjs',
 reporter:'list',
 retries:1,
 use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',headless:true},
 webServer:{command:'npm start',url:'http://127.0.0.1:4173',timeout:30000,reuseExistingServer:!process.env.CI}
});
