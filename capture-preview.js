const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630 });

  const filePath = path.join(__dirname, 'index.html');
  await page.goto(pathToFileURL(filePath).href, { waitUntil: 'networkidle0' });

  await page.screenshot({ path: 'preview.png' });

  await browser.close();
  console.log('Preview image generated: preview.png');
})();
