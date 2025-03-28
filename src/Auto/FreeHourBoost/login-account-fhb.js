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

async function LoginAccountFHB(account) {
    try {
 
    } catch (err) {
        
    }
}

async function main() {
    try {
        console.log("Započinjem dohvat računa koji čekaju registraciju...");
        const account = await getPendingAccounts();
        if (account) {
            await LoginAccountFHB(account);
        } else {
            console.log("Nema dostupnih računa za registraciju.");
        }
    } catch (err) {
        console.error("❌ Greška u glavnoj funkciji:", err);
    }
}

main().catch(console.error);