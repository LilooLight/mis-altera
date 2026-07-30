const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Use hostnameOverride or just try direct
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/home/z/my-project/download/preview-dark.png' });
    console.log('dark ok');
    const btn = page.locator('button[aria-label="Toggle theme"]');
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: '/home/z/my-project/download/preview-light.png' });
      console.log('light ok');
    }
  } catch(e) { console.error('Nav error:', e.message.substring(0,100)); }
  await browser.close();
})();
