import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  // Dark theme screenshot
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: '/home/z/my-project/download/preview-dark.png', fullPage: false })
  console.log('Dark theme screenshot saved')

  // Switch to light theme
  // Find the theme toggle button (Sun icon in dark mode)
  const themeToggle = page.locator('button[aria-label="Toggle theme"]')
  await themeToggle.click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: '/home/z/my-project/download/preview-light.png', fullPage: false })
  console.log('Light theme screenshot saved')

  // Open patient card
  // Click on a patient in the dashboard registry widget
  const patientButton = page.locator('text=Открыть').first()
  if (await patientButton.isVisible()) {
    await patientButton.click()
    await page.waitForTimeout(1500)
    await page.screenshot({ path: '/home/z/my-project/download/preview-patient-card.png', fullPage: false })
    console.log('Patient card screenshot saved')
  }

  await browser.close()
  console.log('Done!')
}

main().catch(console.error)
