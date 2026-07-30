import { chromium } from 'playwright';

async function main() {
  const { spawn } = await import('child_process');

  // Start Next.js standalone server
  const server = spawn('node', ['server.js'], {
    cwd: '/home/z/my-project/.next/standalone',
    env: { ...process.env, PORT: '3456', HOSTNAME: '0.0.0.0' },
    stdio: 'pipe'
  });

  await new Promise(r => setTimeout(r, 3000));

  const http = await import('http');
  const check = () => new Promise((res) => {
    const req = http.get('http://localhost:3456', (r) => res(r.statusCode === 200));
    req.on('error', () => res(false));
    req.setTimeout(3000, () => { req.destroy(); res(false); });
  });

  if (!(await check())) {
    console.error('Server not responding');
    server.kill();
    process.exit(1);
  }
  console.log('Server OK');

  const browser = await chromium.launch({ headless: true });

  // 1. Dashboard dark (default)
  const p1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p1.goto('http://localhost:3456', { waitUntil: 'networkidle', timeout: 15000 });
  await p1.waitForTimeout(2000);
  await p1.screenshot({ path: '/home/z/my-project/download/altera-dashboard-dark.png', fullPage: true });
  console.log('OK: dashboard dark');

  // 2. Dashboard light
  const themeBtn = await p1.$('button[aria-label="Toggle theme"]');
  if (themeBtn) {
    await themeBtn.click();
    await p1.waitForTimeout(1000);
    await p1.screenshot({ path: '/home/z/my-project/download/altera-dashboard-light.png', fullPage: true });
    console.log('OK: dashboard light');
  }

  // 3. Open patient card
  await p1.goto('http://localhost:3456', { waitUntil: 'networkidle', timeout: 15000 });
  await p1.waitForTimeout(1000);
  const openBtns = await p1.$$('button:has-text("Открыть")');
  if (openBtns.length > 0) {
    await openBtns[0].click();
    await p1.waitForTimeout(2000);
    await p1.screenshot({ path: '/home/z/my-project/download/altera-patientcard-dark.png', fullPage: true });
    console.log('OK: patient card dark');
  }

  // 4. Patient card light
  if (themeBtn) {
    // Need to find theme button again since DOM may have changed
    const tb = await p1.$('button[aria-label="Toggle theme"]');
    if (tb) {
      await tb.click();
      await p1.waitForTimeout(1000);
      await p1.screenshot({ path: '/home/z/my-project/download/altera-patientcard-light.png', fullPage: true });
      console.log('OK: patient card light');
    }
  }

  await browser.close();
  server.kill();
  console.log('All screenshots done');
}

main().catch(e => { console.error(e); process.exit(1); });
