import puppeteer from 'puppeteer';

async function testFormInteractions() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  console.log('Navigating to http://localhost:3000/create...');
  await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle2' });

  console.log('Typing description & amount...');
  await (await page.$('input[placeholder="Dinner at Pizza Hut"]')).type('Goa Beach Dinner & Drinks');
  await (await page.$('input[placeholder="0.00"]')).type('3000');
  await (await page.$('input[placeholder="e.g. yourname@upi"]')).type('adarsh@okhdfcbank');
  await (await page.$('input[placeholder="Your name"]')).type('Adarsh');

  console.log('Adding friend Rohan...');
  const addPersonInput = await page.$('input[placeholder="Add new person..."]');
  await addPersonInput.type('Rohan');
  const addBtn = await page.$('button[type="button"].bg-indigo-600');
  // Click the purple Add button next to input
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Add')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));

  console.log('Adding friend Priya...');
  await addPersonInput.type('Priya');
  for (const b of allBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Add')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));

  console.log('Capturing interactive form calculation screenshot...');
  await page.screenshot({ path: 'test-screenshots/12-form-calculated.png' });
  console.log('📸 Captured test-screenshots/12-form-calculated.png');

  await browser.close();
  console.log('Done testing form calculations!');
}

testFormInteractions().catch(console.error);
