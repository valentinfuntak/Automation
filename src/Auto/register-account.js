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


{/*
PRIMJENITI OVAJ KOD 

const { createClient } = require('@supabase/supabase-js');
const puppeteer = require('puppeteer');

// Povezivanje s Supabase
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

// Funkcija za dohvat računa koji još nisu registrirani
async function getPendingAccounts() {
    const { data, error } = await supabase
        .from('accounts') // Naziv vaše tablice
        .select('*')
        .eq('Registriran', false); // Filtriraj samo one koji nisu registrirani

    if (error) {
        console.error('Error fetching accounts:', error);
        return [];
    }
    return data;
}

// Funkcija za registraciju računa pomoću Puppeteera
async function registerAccount(account) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Pristupite stranici za registraciju
    await page.goto('https://example.com/register'); // Zamijenite s pravom URL adresom za registraciju

    // Popunite formu s podacima o računu
    await page.type('#username', account.username);
    await page.type('#email', account.email);
    await page.type('#password', account.password);

    // Pošaljite formu
    await page.click('#registerButton');
    await page.waitForNavigation();

    console.log(`Account ${account.username} registered`);

    await browser.close();
}

// Funkcija za ažuriranje statusa računa u Supabase nakon uspješne registracije
async function updateAccountStatus(accountId) {
    const { error } = await supabase
        .from('accounts')
        .update({ Registriran: true }) // Postavljanje samo vrijednosti Registriran na true
        .eq('id', accountId); // Filtriramo prema id-u računa

    if (error) {
        console.error('Error updating account status:', error);
    } else {
        console.log(`Account with id ${accountId} marked as registered`);
    }
}

// Glavna funkcija koja povezuje sve
async function main() {
    const accounts = await getPendingAccounts(); // Dohvati nepodignute račune

    for (let account of accounts) {
        await registerAccount(account); // Registriraj račun
        await updateAccountStatus(account.id); // Ažuriraj status na "registriran"
    }
}

main().catch(console.error);

*/}