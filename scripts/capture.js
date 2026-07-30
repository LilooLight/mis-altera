const { spawn } = require('child_process');
const { chromium } = require('playwright');

async function main() {
  // Start server
  const server = spawn('npx', ['next', 'dev', '-p', '3000'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for "Ready" output
  let ready = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const resp = await fetch('http://localhost:3000');
      if (resp.ok) { ready = true; break; }
    } catch {}
  }

  if (!ready) {
    console.error('Server never became ready');
    server.kill();
    process.exit(1);
  }
  console.log('Server ready, taking screenshots...');

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/home/z/my-project/download/preview-dark.png' });
  console.log('Dark theme saved');

  const btn = page.locator('button[aria-label="Toggle theme"]');
  await btn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/z/my-project/download/preview-light.png' });
  console.log('Light theme saved');

  await browser.close();
  server.kill();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
