const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to http://127.0.0.1:3002 ...');
  await page.goto('http://127.0.0.1:3002', { waitUntil: 'networkidle', timeout: 60000 });
  console.log('Loaded. Waiting 4s for animations...');
  await page.waitForFunction(() => document.body.style.backgroundColor !== '' || getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)').catch(() => {});
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'screenshot-01-hero.png' });
  console.log('hero done');

  await page.evaluate(() => window.scrollTo({ top: 950, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshot-02-ticker-stats.png' });
  console.log('ticker+stats done');

  await page.evaluate(() => window.scrollTo({ top: 2100, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshot-03-whatsapp.png' });
  console.log('whatsapp done');

  await page.evaluate(() => window.scrollTo({ top: 4600, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshot-04-features.png' });
  console.log('features done');

  await page.evaluate(() => window.scrollTo({ top: 6300, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshot-05-pricing.png' });
  console.log('pricing done');

  await browser.close();
  console.log('all screenshots complete');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
