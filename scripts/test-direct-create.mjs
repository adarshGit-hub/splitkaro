import puppeteer from 'puppeteer';

async function testDirectCreate() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Visiting Landing Page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  console.log('Clicking Create Split button...');
  await page.click('a[href="/create"]');
  await new Promise(r => setTimeout(r, 1500));

  console.log(`Current URL: ${page.url()}`);
  await page.screenshot({ path: 'test-screenshots/11-create-split-direct.png' });
  console.log('📸 Captured test-screenshots/11-create-split-direct.png');

  await browser.close();
}

testDirectCreate().catch(console.error);
