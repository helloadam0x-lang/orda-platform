const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const body = document.body;
    const cs = getComputedStyle(body);
    const mainEl = document.querySelector('main');
    const mainCs = mainEl ? getComputedStyle(mainEl) : null;
    return {
      bodyBg: cs.backgroundColor,
      bodyColor: cs.color,
      mainBg: mainCs ? mainCs.backgroundColor : 'n/a',
      cssVar: getComputedStyle(document.documentElement).getPropertyValue('--bg-void').trim(),
      bodyClass: body.className,
      mainClass: mainEl ? mainEl.className : 'n/a',
      contentLength: document.body.innerText.length,
      h1: document.querySelector('h1')?.innerText?.substring(0, 80) || 'no h1',
    };
  });

  console.log('Page info:', JSON.stringify(info, null, 2));
  console.log('Console errors:', errors.slice(0, 5));

  await page.screenshot({ path: 'debug-screenshot.png' });
  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
