import { supabase } from "../Supabase/Supabase.js"; // Povezivanje sa Supabaseom
import { createSignal } from "solid-js";

// Funkcija za generiranje nasumičnih imena s brojevima
const generateRandomName = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let name = "";
    for (let i = 0; i < 5; i++) {
        name += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return name;
};

// Funkcija za generiranje nasumičnih podataka
const generateRandomData = () => {
    const firstName = generateRandomName(); // Nasumično ime
    const lastName = generateRandomName(); // Nasumično prezime
    const months = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"];
    const genders = ["Muško", "Žensko"];
    const domain = "gmail.com"; // Domena je uvijek gmail.com

    // Generiranje nasumičnih podataka
    const month = months[Math.floor(Math.random() * months.length)];
    const day = Math.floor(Math.random() * 28) + 1; // Broj dana od 1 do 28
    const year = Math.floor(Math.random() * (2003 - 1980 + 1)) + 1980; // Godine od 1980 do 2003
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;

    // Generiranje nasumične lozinke (8 znakova)
    const generatePassword = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";
        for (let i = 0; i < 8; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    };

    const password = generatePassword(); // Generiranje lozinke
    const registered = false; // Defaultna vrijednost za registraciju

    return {
        firstName,
        lastName,
        month,
        day,
        year,
        gender,
        email,
        password,
        registered,
    };
};

const DataGenerator = () => {
    const [numAccounts, setNumAccounts] = createSignal(1);
    const [generatedData, setGeneratedData] = createSignal([]);
    const [existingData, setExistingData] = createSignal(new Set()); // Za praćenje postojećih podataka

    const handleGenerate = () => {
        const data = [];
        const tempSet = new Set(existingData()); // Kopiramo postojeće podatke
        const tempNameSet = new Set(); // Set za praćenje dupliciranja imena i prezimena

        for (let i = 0; i < numAccounts(); i++) {
            let accountData = generateRandomData();

            // Provjera dupliciranja emaila ili imena i prezimena
            while (tempSet.has(accountData.email) || tempNameSet.has(`${accountData.firstName} ${accountData.lastName}`)) {
                accountData = generateRandomData(); // Ponovno generiraj podatke ako postoji dupliciranje
            }

            tempSet.add(accountData.email); // Dodaj email u set koji prati postojeće podatke
            tempNameSet.add(`${accountData.firstName} ${accountData.lastName}`); // Dodaj ime i prezime u set
            data.push(accountData);
        }

        setExistingData(tempSet); // Ažuriraj set postojećih podataka
        setGeneratedData(data); // Ažuriraj prikazane podatke
    };


    const handleSave = async () => {
        const { data, error } = await supabase
            .from("AccountData") // Pretpostavimo da imamo tabelu 'accounts'
            .insert(generatedData());
        if (error) {
            console.error("Error saving data: ", error);
        } else {
            console.log("Data saved successfully");
        }
    };

    return (
        <div class="mt-3 w-full rounded-2xl justify-start">
            <div class="w-full space-y-8 bg-white shadow-lg rounded-2xl p-8 border-4 border-white">
                {/* Naslov */}
                <h2 class="text-3xl font-bold text-start text-gray-900">
                    Generiraj Račune
                </h2>
                {/* Broj računa */}
                <div>
                    <label for="num-accounts" class="block text-sm font-medium text-gray-700">Broj računa:</label>
                    <input
                        type="number"
                        id="num-accounts"
                        class="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                        min="1"
                        value={numAccounts()}
                        onInput={(e) => setNumAccounts(parseInt(e.target.value, 10))}
                    />
                </div>
                {/* Gumb za generiranje podataka */}
                <button
                    onClick={handleGenerate}
                    class="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                >
                    Generiraj podatke
                </button>

                {/* Gumb za spremanje podataka u bazu */}
                <button
                    onClick={handleSave}
                    class="w-full py-3 px-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                >
                    Spremi u bazu podataka
                </button>

                {/* Prikaz generiranih podataka */}
                {generatedData().length > 0 && (
                    <div class="mt-8 space-y-6">
                        <h3 class="text-xl font-semibold text-center text-gray-900">Generirani Podaci:</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {generatedData().map((data, index) => (
                                <div key={index} class="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                                    <div className="">
                                        <p class="font-bold text-xl">{index + 1}.</p> {/* Dodan redni broj */}
                                        <div>
                                            <p><strong>Ime:</strong> {data.firstName}</p>
                                            <p><strong>Prezime:</strong> {data.lastName}</p>
                                        </div>
                                        <div>
                                            <p><strong>Datum:</strong> {data.day}. {data.month} {data.year}</p>
                                            <p><strong>Spol:</strong> {data.gender}</p>
                                        </div>
                                    </div>
                                    <p><strong>Email:</strong> {data.email}</p>
                                    <p><strong>Lozinka:</strong> {data.password}</p>
                                    <p><strong>Registriran:</strong> {data.registered ? "Da" : "Ne"}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataGenerator;
