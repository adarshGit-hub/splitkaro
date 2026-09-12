import puppeteer from 'puppeteer';
import fs from 'fs';

async function runTests() {
  console.log('🚀 Launching Chrome to test SplitKaro...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('1️⃣ Visiting Landing Page (http://localhost:3000)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'test-screenshots/01-landing.png' });
  console.log('   📸 Captured test-screenshots/01-landing.png');

  console.log('2️⃣ Visiting /login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'test-screenshots/02-login.png' });
  console.log('   📸 Captured test-screenshots/02-login.png');

  console.log('3️⃣ Testing redirect from /create...');
  await page.goto('http://localhost:3000/create', { waitUntil: 'networkidle2' });
  const currentUrl = page.url();
  console.log(`   🔗 Redirected to: ${currentUrl}`);
  await page.screenshot({ path: 'test-screenshots/03-after-create-redirect.png' });
  console.log('   📸 Captured test-screenshots/03-after-create-redirect.png');

  console.log('4️⃣ Testing Public Settlement Page structure...');
  // Check that public settlement page renders cleanly without crashing
  await page.goto('http://localhost:3000/s/demo-test', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'test-screenshots/04-public-settlement.png' });
  console.log('   📸 Captured test-screenshots/04-public-settlement.png');

  console.log('5️⃣ Testing Mobile Viewport...');
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'test-screenshots/05-mobile-landing.png' });
  console.log('   📸 Captured test-screenshots/05-mobile-landing.png');

  await browser.close();
  console.log('\n✨ Automated test suite completed successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
