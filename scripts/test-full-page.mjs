import puppeteer from 'puppeteer';

async function captureFull() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });

  await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle2' });
  await (await page.$('input[placeholder="Dinner at Pizza Hut"]')).type('Goa Beach Dinner & Drinks');
  await (await page.$('input[placeholder="0.00"]')).type('3000');
  await (await page.$('input[placeholder="e.g. yourname@upi"]')).type('adarsh@okhdfcbank');

  // Add Rohan
  const addPersonInput = await page.$('input[placeholder="Add new person..."]');
  await addPersonInput.type('Rohan');
  const addBtns = await page.$$('button');
  for (const b of addBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Add')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: 'test-screenshots/13-full-split-breakdown.png', fullPage: true });
  console.log('📸 Captured test-screenshots/13-full-split-breakdown.png');

  await browser.close();
}

captureFull().catch(console.error);
