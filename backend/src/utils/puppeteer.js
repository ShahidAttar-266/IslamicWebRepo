const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

/**
 * Get a puppeteer browser instance compatible with Vercel/Serverless
 */
async function getBrowser() {
  const isProd = process.env.NODE_ENV === 'production';
  
  const options = {
    args: isProd ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: chromium.defaultViewport,
    executablePath: isProd ? await chromium.executablePath() : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Fallback for local dev on Windows
    headless: isProd ? chromium.headless : true,
    ignoreHTTPSErrors: true,
  };

  return await puppeteer.launch(options);
}

module.exports = { getBrowser };
