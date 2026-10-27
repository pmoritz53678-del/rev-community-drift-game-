import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'./e2e',
  testMatch:'*.spec.mjs',
  timeout:60000,
  retries:process.env.CI?1:0,
  workers:1,
  reporter:[['list'],['html',{open:'never'}]],
  use:{
    ...devices['Desktop Chrome'],
    baseURL:'http://127.0.0.1:5173',
    trace:'retain-on-failure',
    screenshot:'only-on-failure',
    launchOptions:{args:[
      '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader',
      '--disable-dev-shm-usage'
    ]}
  },
  webServer:{
    command:'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
    url:'http://127.0.0.1:5173',
    reuseExistingServer:!process.env.CI,
    timeout:120000
  }
});