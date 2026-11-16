import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:5191",
    browserName: "chromium",
    reducedMotion: "reduce",
  },
  webServer: {
    command: "node scripts/serve.mjs",
    port: 5191,
    env: { PORT: "5191" },
    reuseExistingServer: false,
  },
  reporter: "list",
});
