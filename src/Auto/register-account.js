import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']  // Dodaj ove argumente
});

const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('https://accounts.google.com/signup');

// Set screen size.
await page.setViewport({ width: 1080, height: 1024 });

// Simuliraj tipkanje za "Ime" s kašnjenjem između svakog slova
await page.type('#firstName', 'Ime', { delay: 100 });
await page.type('#lastName', 'Prezime', { delay: 100 });

console.log('Ime i Prezime su upisani.');

await page.click('#collectNameNext > div > button > span');

await browser.close();