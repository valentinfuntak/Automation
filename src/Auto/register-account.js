import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import { createSignal } from 'solid-js';
import readline from 'readline';

// Supabase klijent
const supabase = createClient("https://zwlnmgzochrpsrchtzse.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bG5tZ3pvY2hycHNyY2h0enNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzEzMTIsImV4cCI6MjA1NTc0NzMxMn0.zy3xpi7HVpQqrRdXuoPt6ZymK9s9ioAF5OiJIYzf3OM");

const [pendingAccounts, setPendingAccounts] = createSignal([]);

// Dohvati račune koji još nisu registrirani
async function getPendingAccounts() {
    console.log("Pokušavam dohvatiti račune iz Supabase...");
    const { data, error } = await supabase
        .from('AccountData')
        .select('*')
        .eq('registered', false);
    if (error) {
        console.error('⚠️ Greška pri dohvaćanju računa:', error);
    } else {
        setPendingAccounts(data);
        console.log(`Dohvaćeni računi: ${data.length}`);
        return data;
    }
}

// Registracija računa pomoću Puppeteera
async function registerAccount(account) {
    try {
        console.log(`Započinjem registraciju računa: ${account.firstName} ${account.lastName}`);

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        });

        const page = await browser.newPage();
        await page.goto('https://accounts.google.com/signup');
        await page.setViewport({ width: 1080, height: 1024 });

        // Popunjavanje podataka
        await page.type('#firstName', account.firstName, { delay: 100 });
        await page.type('#lastName', account.lastName, { delay: 100 });
        await page.click('#collectNameNext > div > button > span');

        // Daljnje popunjavanje (prema vašim uputama za inpute)
        await page.type('#month', account.month, { delay: 100 });
        await page.type('#day', account.day, { delay: 100 });
        await page.type('#year', account.year, { delay: 100 });
        await page.select('#gender', account.gender);

        await page.click('#birthdaygenderNext > div > button > span');

        // Nastavite s popunjavanjem ostalih podataka (koristite slične metode za unos)

        console.log(`Račun ${account.firstName} ${account.lastName} uspješno registriran.`);

        await browser.close();

        // Ažuriraj status u bazi podataka
        const { error } = await supabase
            .from('AccountData')
            .update({ registered: true })
            .eq('id', account.id);

        if (error) {
            console.error(`⚠️ Greška pri ažuriranju statusa za ${account.firstName}:`, error);
        } else {
            console.log(`Status za račun ${account.firstName} ažuriran na 'registered'.`);
        }
    } catch (err) {
        console.error('❌ Greška pri registraciji računa:', err);
    }
}

// Funkcija za unos broja računa koji korisnik želi registrirati
function askForAccountCount() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question("Koliko računa želite registrirati? ", (count) => {
            rl.close();
            resolve(parseInt(count));
        });
    });
}

// Glavna funkcija
async function main() {
    try {
        console.log("Započinjem dohvat računa koji čekaju registraciju...");

        const accounts = await getPendingAccounts();

        if (accounts.length > 0) {
            const numberOfAccountsToRegister = await askForAccountCount();

            // Ako je broj računa manji od ukupnog broja, uzmi samo toliko računa
            const accountsToRegister = accounts.slice(0, numberOfAccountsToRegister);

            if (accountsToRegister.length > 0) {
                for (const account of accountsToRegister) {
                    await registerAccount(account);
                }
            } else {
                console.log("Nema dovoljno računa koji čekaju registraciju.");
            }
        } else {
            console.log("Nema računa koji čekaju registraciju.");
        }
    } catch (err) {
        console.error("❌ Greška u glavnoj funkciji:", err);
    }
}

main().catch(console.error);
