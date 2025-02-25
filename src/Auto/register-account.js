import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import { createSignal } from 'solid-js';

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
            args: ['--start-maximized'],
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        });

        const page = await browser.newPage();
        await page.goto('https://accounts.google.com/signup');
        await page.setViewport({ width: 1920, height: 1080 });

        // Popunjavanje podataka
        await page.type('#firstName', account.firstName, { delay: 100 });
        await page.type('#lastName', account.lastName, { delay: 100 });
        await page.click('#collectNameNext > div > button > span');

        // Daljnje popunjavanje (prema vašim uputama za inpute)
        await page.waitForSelector('#month');
        await page.select('#month', account.month.toString());

        await page.locator('#day').fill(account.day.toString(), { delay: 100 });
        await page.locator('#year').fill(account.year.toString(), { delay: 100 });

        await page.waitForSelector('#gender');
        await page.select('#gender', account.gender.toString());

        await page.click('#birthdaygenderNext > div > button > div.VfPpkd-RLmnJb');

        const gmailOption = await page.waitForSelector('xpath=//*[@id="selectionc1"]', { visible: true });
        await page.evaluate(element => element.click(), gmailOption);

        const next = await page.waitForSelector('xpath=//*[@id="yDmH0d"]/c-wiz/div/div[3]/div/div/div/div/button/span', { visible: true });
        await page.evaluate(element => element.click(), next);

        const select = await page.waitForSelector('xpath=//*[@id="yDmH0d"]/c-wiz/div/div[2]/div/div/div/form/span/section/div/div/div[1]/div[1]/div/span/div[3]/div/div[1]/div/div[3]/div', { visible: true });
        await page.evaluate(element => element.click(), select);

        // Unesi firstname.lastname kao email
        const email = `${account.firstName}.${account.lastName}`; // Prilagodi domen u skladu sa stvarnim email formatom

        await page.type('#yDmH0d > c-wiz > div > div.UXFQgc > div > div > div > form > span > section > div > div > div.BvCjxe > div.AFTWye > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input', email, { delay: 100 });

        const sumbit = await page.waitForSelector('xpath=//*[@id="next"]/div/button/span', { visible: true });
        await page.evaluate(element => element.click(), sumbit);




        // Nastavite s popunjavanjem ostalih podataka (koristite slične metode za unos)

        console.log(`Račun ${account.firstName} ${account.lastName} uspješno registriran.`);

        //await browser.close();

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

// Glavna funkcija
async function main() {
    try {
        console.log("Započinjem dohvat računa koji čekaju registraciju...");

        const accounts = await getPendingAccounts();

        if (accounts.length > 0) {
            // Registriraj sve račune koji čekaju
            for (const account of accounts) {
                await registerAccount(account);
            }
        } else {
            console.log("Nema računa koji čekaju registraciju.");
        }
    } catch (err) {
        console.error("❌ Greška u glavnoj funkciji:", err);
    }
}

main().catch(console.error);
