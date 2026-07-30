import { chromium } from 'playwright';

async function main() {
  const { spawn } = await import('child_process');

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
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Go to page (dark mode by default)
  await page.goto('http://localhost:3456', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Click "Открыть" on first patient in the registry widget
  const openBtns = await page.$$('button:has-text("Открыть")');
  console.log(`Found ${openBtns.length} "Открыть" buttons`);

  if (openBtns.length > 0) {
    await openBtns[0].click();
    await page.waitForTimeout(3000);
    
    // Screenshot patient card in dark mode
    await page.screenshot({ path: '/home/z/my-project/download/altera-patientcard-dark.png', fullPage: true });
    console.log('OK: patient card dark');
  } else {
    console.log('No open buttons found, trying alternative selector...');
    // Try clicking on a patient card directly
    const cards = await page.$$('text=Петрова');
    if (cards.length > 0) {
      await cards[0].click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/home/z/my-project/download/altera-patientcard-dark.png', fullPage: true });
      console.log('OK: patient card dark (via patient name click)');
    }
  }

  await browser.close();
  server.kill();
  console.log('Done');
}

main().catch(e => { console.error(e); process.exit(1); });
