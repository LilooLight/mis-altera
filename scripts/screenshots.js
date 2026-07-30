const { chromium } = require('playwright');
const http = require('http');

function waitForServer(maxWait = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const req = http.get('http://127.0.0.1:3000', (res) => {
        resolve(true);
        res.destroy();
      });
      req.on('error', () => {
        if (Date.now() - start > maxWait) reject(new Error('Server not ready'));
        else setTimeout(check, 500);
      });
      req.setTimeout(2000, () => { req.destroy(); setTimeout(check, 500); });
    };
    check();
  });
}

(async () => {
  await waitForServer();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to app...');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/home/z/my-project/download/preview-dark.png' });
  console.log('Dark theme OK');

  const btn = page.locator('button[aria-label="Toggle theme"]');
  await btn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/home/z/my-project/download/preview-light.png' });
  console.log('Light theme OK');

  await browser.close();
  console.log('All done!');
})();
