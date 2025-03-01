//node src/Auto/register-account.js

import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import { createSignal } from 'solid-js';

const supabase = createClient("https://zwlnmgzochrpsrchtzse.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bG5tZ3pvY2hycHNyY2h0enNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzEzMTIsImV4cCI6MjA1NTc0NzMxMn0.zy3xpi7HVpQqrRdXuoPt6ZymK9s9ioAF5OiJIYzf3OM");

const [pendingAccounts, setPendingAccounts] = createSignal([]);

// Funkcija za nasumične pauze
const randomDelay = (min = 300, max = 1200) => new Promise(res => setTimeout(res, Math.floor(Math.random() * (max - min) + min)));

async function getPendingAccounts() {
    console.log("Pokušavam dohvatiti račune iz Supabase...");
    const { data, error } = await supabase.from('AccountData').select('*').eq('registered', false).limit(1).single();
    if (error) {
        console.error('⚠️ Greška pri dohvaćanju računa:', error);
    } else {
        setPendingAccounts(data);
        console.log(`Dohvaćen račun:`, pendingAccounts());
        return data;
    }
}

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

        // Popunjavanje podataka s odgodama
        await randomDelay();
        await page.type('#firstName', account.firstName, { delay: 200 });
        await randomDelay();
        await page.type('#lastName', account.lastName, { delay: 200 });
        await randomDelay();
        await page.click('#collectNameNext > div > button > span');

        await page.waitForSelector('#month');
        await randomDelay();
        await page.select('#month', account.month.toString());
        await randomDelay();

        await page.type('#day', account.day.toString(), { delay: 200 });
        await randomDelay();
        await page.type('#year', account.year.toString(), { delay: 200 });

        await page.waitForSelector('#gender');
        await randomDelay();
        await page.select('#gender', account.gender.toString());
        await randomDelay();

        await page.click('#birthdaygenderNext > div > button > div.VfPpkd-RLmnJb');
        await randomDelay(1000, 2000);

        const gmailOption = await page.waitForSelector('xpath=//*[@id="selectionc1"]', { visible: true });
        await randomDelay();
        await page.evaluate(element => element.click(), gmailOption);

        const next = await page.waitForSelector('xpath=//*[@id="yDmH0d"]/c-wiz/div/div[3]/div/div/div/div/button/span', { visible: true });
        await randomDelay();
        await page.evaluate(element => element.click(), next);

        const select = await page.waitForSelector('xpath=//*[@id="yDmH0d"]/c-wiz/div/div[2]/div/div/div/form/span/section/div/div/div[1]/div[1]/div/span/div[3]/div/div[1]/div/div[3]/div', { visible: true });
        await page.evaluate(element => element.click(), select);

        // Unesi firstname.lastname kao email
        const email = `${account.firstName}.${account.lastName}`;

        await page.type('#yDmH0d > c-wiz > div > div.UXFQgc > div > div > div > form > span > section > div > div > div.BvCjxe > div.AFTWye > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input', email, { delay: 100 });

        const sumbit = await page.waitForSelector('xpath=//*[@id="next"]/div/button/span', { visible: true });
        await page.evaluate(element => element.click(), sumbit);
        await randomDelay(1000, 2000);

        await page.locator('#passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input').fill(account.password, { delay: 100 });
        await page.locator('#confirm-passwd > div.aCsJod.oJeWuf > div > div.Xb9hP > input').fill(account.password, { delay: 100 });

        const sumbitpass = await page.waitForSelector('xpath=//*[@id="createpasswordNext"]/div/button/span', { visible: true });
        await page.evaluate(element => element.click(), sumbitpass);
        await randomDelay(2000, 3000);



        console.log(`Račun ${account.firstName} ${account.lastName} uspješno registriran.`);

        // Ažuriranje statusa u bazi
        await supabase.from('AccountData').update({ registered: true }).eq('id', account.id);
    } catch (err) {
        console.error('❌ Greška pri registraciji računa:', err);
    }
}

async function main() {
    try {
        console.log("Započinjem dohvat računa koji čekaju registraciju...");
        const account = await getPendingAccounts();
        if (account) {
            await registerAccount(account);
        } else {
            console.log("Nema dostupnih računa za registraciju.");
        }
    } catch (err) {
        console.error("❌ Greška u glavnoj funkciji:", err);
    }
}

main().catch(console.error);