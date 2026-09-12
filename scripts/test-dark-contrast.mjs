import puppeteer from 'puppeteer';

async function testDarkContrast() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  // Emulate OS dark mode to verify high contrast fix
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

  console.log('Navigating to http://localhost:3000/create with OS Dark Mode emulated...');
  await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle2' });

  // Type some text to test input visibility
  const descInput = await page.$('input[placeholder*="Dinner at Social"]');
  if (descInput) await descInput.type('Biryani Party with Friends');

  const amtInput = await page.$('input[placeholder="0.00"]');
  if (amtInput) await amtInput.type('1800');

  const upiInput = await page.$('input[placeholder*="name@okhdfcbank"]');
  if (upiInput) await upiInput.type('adarsh@okhdfcbank');

  await page.screenshot({ path: 'test-screenshots/14-high-contrast-verified.png' });
  console.log('📸 Captured test-screenshots/14-high-contrast-verified.png');

  await browser.close();
  console.log('High contrast test complete!');
}

testDarkContrast().catch(console.error);
