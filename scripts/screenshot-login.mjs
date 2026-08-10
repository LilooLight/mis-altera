import puppeteer from 'puppeteer';

// Serve static export from out/ directory
const url = 'http://localhost:8888/login/';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

try {
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
} catch (e) {
  console.log('Navigation timeout (acceptable for SPA):', e.message);
}

// Wait a bit for the progress animation to be visible
await new Promise(r => setTimeout(r, 2000));

await page.screenshot({
  path: '/home/z/my-project/download/login-splash.png',
  fullPage: false
});

// Wait for progress to finish and form to appear (10s + 1s buffer)
console.log('Waiting 12s for progress bar to complete...');
await new Promise(r => setTimeout(r, 12000));

await page.screenshot({
  path: '/home/z/my-project/download/login-form.png',
  fullPage: false
});

// Also take a mobile screenshot
await page.setViewport({ width: 375, height: 812 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({
  path: '/home/z/my-project/download/login-mobile.png',
  fullPage: false
});

console.log('Screenshots saved to /home/z/my-project/download/');
await browser.close();
