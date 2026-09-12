import puppeteer from 'puppeteer';

async function testFullFlow() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  console.log('Navigating to http://localhost:3000/login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

  // Switch to sign up
  console.log('Clicking Sign up switch...');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Sign up')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 500));

  const testEmail = `adarsh.split${Math.floor(Math.random()*10000)}@gmail.com`;
  console.log(`Filling credentials with ${testEmail}...`);

  const nameInput = await page.$('input[placeholder="e.g. Adarsh"]');
  if (nameInput) await nameInput.type('Adarsh');

  const emailInput = await page.$('input[placeholder="you@example.com"]');
  if (emailInput) await emailInput.type(testEmail);

  const passInput = await page.$('input[type="password"]');
  if (passInput) await passInput.type('SplitKaro@2026');

  console.log('Submitting form...');
  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();

  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'test-screenshots/06-after-signup.png' });
  console.log(`Current URL after submit: ${page.url()}`);

  const pageContent = await page.evaluate(() => document.body.innerText);
  console.log('Page response preview:', pageContent.slice(0, 300));

  await browser.close();
}

testFullFlow().catch(console.error);
