import puppeteer from 'puppeteer';

async function testFullJourney() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const testEmail = `adarsh.split${Math.floor(Math.random()*10000)}@gmail.com`;
  const testPassword = 'Password@123';

  console.log(`1️⃣ Signing up new user: ${testEmail}...`);
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

  // Switch to sign up
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Sign up')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));

  await (await page.$('input[placeholder="e.g. Adarsh"]')).type('Adarsh');
  await (await page.$('input[placeholder="you@example.com"]')).type(testEmail);
  await (await page.$('input[type="password"]')).type(testPassword);
  await (await page.$('button[type="submit"]')).click();
  await new Promise(r => setTimeout(r, 2000));

  console.log('2️⃣ Signing in...');
  const emailInput = await page.$('input[placeholder="you@example.com"]');
  if (emailInput) {
    await emailInput.click({ clickCount: 3 });
    await emailInput.type(testEmail);
  }
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.click({ clickCount: 3 });
    await passInput.type(testPassword);
  }

  await (await page.$('button[type="submit"]')).click();
  await new Promise(r => setTimeout(r, 3000));

  console.log(`Current URL: ${page.url()}`);
  await page.screenshot({ path: 'test-screenshots/07-dashboard.png' });
  console.log('   📸 Captured test-screenshots/07-dashboard.png');

  console.log('3️⃣ Navigating to /create...');
  await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test-screenshots/08-create-split-form.png' });
  console.log('   📸 Captured test-screenshots/08-create-split-form.png');

  // Fill in split details
  console.log('4️⃣ Filling Split Form (Dinner with Rahul & Priya)...');
  const titleInput = await page.$('input[placeholder="Dinner at Pizza Hut"]');
  if (titleInput) await titleInput.type('Biryani Party at Paradise');

  const amountInput = await page.$('input[placeholder="0.00"]');
  if (amountInput) await amountInput.type('1200');

  const upiInput = await page.$('input[placeholder="e.g. yourname@upi"]');
  if (upiInput) await upiInput.type('adarsh@okhdfcbank');

  // Add friend: Rahul
  const friendNameInput = await page.$('input[placeholder="Enter name (e.g. Rahul)"]');
  if (friendNameInput) {
    await friendNameInput.type('Rahul');
    const addBtns = await page.$$('button');
    for (const b of addBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt && txt.trim() === 'Add') {
        await b.click();
        break;
      }
    }
  }
  await new Promise(r => setTimeout(r, 500));

  // Add friend: Priya
  if (friendNameInput) {
    await friendNameInput.click({ clickCount: 3 });
    await friendNameInput.type('Priya');
    const addBtns = await page.$$('button');
    for (const b of addBtns) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt && txt.trim() === 'Add') {
        await b.click();
        break;
      }
    }
  }
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'test-screenshots/09-split-form-filled.png' });
  console.log('   📸 Captured test-screenshots/09-split-form-filled.png');

  console.log('5️⃣ Submitting Create Split...');
  const createBtns = await page.$$('button');
  for (const b of createBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Create Split')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 3500));
  console.log(`Current URL after split creation: ${page.url()}`);
  await page.screenshot({ path: 'test-screenshots/10-split-detail-page.png' });
  console.log('   📸 Captured test-screenshots/10-split-detail-page.png');

  await browser.close();
  console.log('🎉 Full user journey completed!');
}

testFullJourney().catch(console.error);
