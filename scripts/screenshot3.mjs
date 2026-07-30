import { chromium } from 'playwright';

async function main() {
  const { spawn } = await import('child_process');

  const server = spawn('node', ['server.js'], {
    cwd: '/home/z/my-project/.next/standalone',
    env: { ...process.env, PORT: '3456', HOSTNAME: '0.0.0.0' },
    stdio: 'pipe'
  });

  await new Promise(r => setTimeout(r, 3000));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Go to page (dark mode)
  await page.goto('http://localhost:3456', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Click on "Реестр" tab
  const registryTab = await page.$('text=Реестр');
  if (registryTab) {
    await registryTab.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/z/my-project/download/altera-registry-dark.png', fullPage: true });
    console.log('OK: registry dark');
  }

  // Open a patient from registry
  const openBtns = await page.$$('button:has-text("Открыть")');
  console.log(`Found ${openBtns.length} buttons`);
  
  // Try clicking a patient row/card
  const patientCards = await page.$$('[class*="rounded-xl"][class*="border"]');
  console.log(`Found ${patientCards.length} potential patient cards`);
  
  // Click the first patient card to open the patient card tab
  if (patientCards.length > 0) {
    await patientCards[0].click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/z/my-project/download/altera-patientcard-from-registry-dark.png', fullPage: true });
    console.log('OK: patient card from registry');
  }

  // Now try to click on different tabs within the patient card
  // Click "История" tab
  const historyTab = await page.$('text=История');
  if (historyTab) {
    await historyTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/z/my-project/download/altera-patientcard-history-dark.png', fullPage: true });
    console.log('OK: patient card history tab');
  }

  await browser.close();
  server.kill();
  console.log('Done');
}

main().catch(e => { console.error(e); process.exit(1); });
