import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<html><body style="margin:0;background:#0b1f33;color:#eaf7ff;font-family:Arial,sans-serif"><div style="position:absolute;left:64px;top:48px;font-weight:800;font-size:45px;letter-spacing:-3px">moist<span style="color:#7dd3fc">.</span></div><h1 style="position:absolute;left:64px;top:120px;font-size:122px;line-height:.98;letter-spacing:-7px;font-weight:500">Stay Hydrated.</h1><p style="position:absolute;left:68px;top:340px;font-size:26px;color:#b0c8da">Independent software. Experimental AI.</p><div style="position:absolute;bottom:60px;left:68px;right:68px;border-top:1px solid #2d4c64;padding-top:26px;font-size:18px;color:#7dd3fc">getmoist.dev <span style="float:right;color:#b0c8da">Slippery when wet.</span></div></body></html>`,
);
await page.screenshot({ path: "static/assets/social.png" });
await browser.close();
