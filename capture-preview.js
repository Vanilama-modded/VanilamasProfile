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
  const backgroundPath = path.join(__dirname, 'background.webp');
  
  const backgroundBuffer = fs.readFileSync(backgroundPath);
  const backgroundBase64 = backgroundBuffer.toString('base64');
  const backgroundDataUrl = `data:image/webp;base64,${backgroundBase64}`;

  await page.goto(pathToFileURL(filePath).href, { waitUntil: 'networkidle0' });

  await page.evaluate((bgUrl) => {
    document.documentElement.style.setProperty('--bg-image', `url('${bgUrl}')`);
    document.body.classList.add('has-bg');
    
    const style = document.createElement('style');
    style.textContent = `
      body::before {
        opacity: 1 !important;
        background-image: url('${bgUrl}') !important;
      }
    `;
    document.head.appendChild(style);
  }, backgroundDataUrl);

  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'preview.png' });

  await browser.close();
  console.log('Preview image generated: preview.png');
})();
