import { supabase } from "../Supabase/Supabase.js"; // Povezivanje sa Supabaseom
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../Auth/AuthProvider.jsx";
import { createEffect, createSignal, Show, For } from "solid-js";

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
    const domain = "gmail.com"; // Domena je uvijek gmail.com

    // Generiranje nasumičnih podataka
    const month = Math.floor(Math.random() * 12) + 1; // Nasumični broj između 1 i 12
    const day = Math.floor(Math.random() * 28) + 1; // Broj dana od 1 do 28
    const year = Math.floor(Math.random() * (2003 - 1980 + 1)) + 1980; // Godine od 1980 do 2003
    const gender = Math.floor(Math.random() * 2) + 1; // Nasumični broj 1 (Muško) ili 2 (Žensko)
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



export default function DataGenerator() {

    const navigate = useNavigate();
    const session = useAuth();

    const itemsPerPage = 12;
    const [numAccounts, setNumAccounts] = createSignal(1);
    const [generatedData, setGeneratedData] = createSignal([]);
    const [existingData, setExistingData] = createSignal(new Set()); // Za praćenje postojećih podataka
    const [currentPage, setCurrentPage] = createSignal(1);
    const startIndex = () => (currentPage() - 1) * itemsPerPage;
    const endIndex = () => currentPage() * itemsPerPage;

    const [data, setData] = createSignal([]);

    createEffect(async () => {
        await handleLoad();
    });

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
        if (Array.isArray(generatedData())) {
            const { data, error } = await supabase
                .from("AccountData")
                .insert(generatedData());

            if (error) {
                console.error("Error saving data: ", error);
            } else {
                console.log("Data saved successfully");
                // After saving, reload the data to reflect in UI
                await handleLoad();
            }
        } else {
            console.error("Generated data is not an array:", generatedData());
        }
    };

    async function handleLoad() {
        const { data: loadedData, error } = await supabase
            .from("AccountData")
            .select("*");
        if (error) {
            alert("Operacija nije uspjela.");
            console.log(error);
        } else {
            setData(loadedData);
        }
    }

    const handleDelete = async (id) => {
        try {
            const { data, error } = await supabase
                .from("AccountData")
                .delete()
                .eq("id", id); // Pretpostavljamo da je 'id' jedinstveni identifikator za svaki račun

            if (error) {
                console.error("Error deleting data: ", error);
            } else {
                console.log("Data deleted successfully");
                // After deleting, reload the data to reflect in UI
                await handleLoad();
            }
        } catch (error) {
            console.error("Error during delete operation: ", error.message);
        }
    };

    const handleCheck = (data) => {
        navigate(`/Home/AccountData/${data.id}`);
    };

    return (
        <div class=" mt-10 sm:mt-1 w-full rounded-2xl justify-start">
            <div class="w-full space-y-8 bg-white shadow-lg rounded-2xl p-8 border-4 border-white">
                {/* Naslov */}
                <h2 class="text-3xl font-bold text-start text-gray-900">
                    Generiraj Račune
                </h2>
                {/* Broj računa */}
                <div>
                    <label for="num-accounts" class="block text-xl font-medium text-gray-700">Broj računa:</label>
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
                        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {generatedData().slice(startIndex(), endIndex()).map((data, index) => (
                                <div key={index} class="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                                    <div className="">
                                        <p class="font-bold text-xl">{startIndex() + index + 1}.</p> {/* Dodan redni broj */}
                                        <div>
                                            <p><strong>First Name:</strong> {data.id}</p>
                                            <p><strong>First Name:</strong> {data.firstName}</p>
                                            <p><strong>Last Name:</strong> {data.lastName}</p>
                                        </div>
                                        <div>
                                            <p><strong>Date:</strong> {data.day}.{data.month}.{data.year}</p>
                                            <p><strong>Gender:</strong> {data.gender}</p>
                                        </div>
                                    </div>
                                    <p><strong>Email:</strong> {data.email}</p>
                                    <p><strong>Password:</strong> {data.password}</p>
                                    <p><strong>Registered:</strong> {data.registered ? "True" : "False"}</p>
                                </div>
                            ))}
                        </div>

                        {/* Dodavanje navigacije za stranicu */}
                        <div class="flex justify-center space-x-4 mt-6">
                            <button
                                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                disabled={currentPage() === 1}
                                onClick={() => setCurrentPage(currentPage() - 1)}
                            >
                                Prethodna
                            </button>
                            <span class="self-center">{`Stranica ${currentPage()} od ${Math.ceil(generatedData().length / itemsPerPage)}`}</span>
                            <button
                                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                disabled={currentPage() === Math.ceil(generatedData().length / itemsPerPage)}
                                onClick={() => setCurrentPage(currentPage() + 1)}
                            >
                                Sljedeća
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div class="mt-3 w-full space-y-8 bg-white shadow-lg rounded-2xl p-8 border-4 border-white">
                <h2 class="text-3xl font-bold text-start text-gray-900">Spremljeni računi</h2>
                <Show when={data()}>
                    <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4">
                        <For each={data().slice(startIndex(), endIndex())} fallback={<div class="text-red-600 text-xl">Nema podataka.</div>}>
                            {(item) => {
                                return (
                                    <div class="mt-1 flex flex-col gap-3 bg-gray-800 text-white p-6 rounded-lg shadow-lg relative">
                                        <p><span class="font-semibold text-indigo-200">FirstName:</span> {item.firstName}</p>
                                        <p><span class="font-semibold text-indigo-200">LastName:</span> {item.lastName}</p>
                                        <p><span class="font-semibold text-indigo-200">Gender:</span> {item.gender}</p>
                                        <p><span class="font-semibold text-indigo-200">Email:</span> {item.email}</p>
                                        <p><span class="font-semibold text-indigo-200">Password:</span> {item.password}</p>
                                        <p><span class="font-semibold text-indigo-200">Date:</span> {item.day}. {item.month}. {item.year}</p>
                                        <p><span class="font-semibold text-indigo-200">Registered:</span> {item.registered ? "True" : "False"}</p>

                                        {/* Omot za gumbe koji ih stavlja u donji desni kut */}
                                        <div class="absolute bottom-3 right-3 flex flex-col gap-2">
                                            <button
                                                class="bg-red-500 text-white py-2 px-2 rounded-md hover:bg-red-600 w-12 h-12 flex items-center justify-center"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <svg class="h-8 w-8" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path d="M891.985346 118.062169H132.453901c-21.242549 0 7.385285 95.748636 7.385285 95.748636l81.566801 673.649991c1.372006 11.37127 9.543635 22.025821 20.586238 24.967444 4.380181 1.174396 537.768122 0.324572 542.279361-0.849825 11.176732-2.941623 19.411842-12.746348 20.783848-24.184171l79.60606-673.583439c0.002048 0.001024 28.629881-95.748636 7.323852-95.748636z" fill="#27323A"></path>
                                                        <path d="M882.18062 244.530437H142.355896c-36.960212 0-66.927288-29.967076-66.927288-66.927289s29.966052-66.927288 66.927288-66.927288h739.824724c36.960212 0 66.927288 29.966052 66.927288 66.927288-0.001024 36.961236-29.967076 66.927288-66.927288 66.927289z" fill="#27323A"></path>
                                                    </g>
                                                </svg>
                                            </button>

                                            <button
                                                class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md w-12 h-12 flex items-center justify-center"
                                                onClick={() => handleCheck(item)}
                                            >
                                                <svg class="h-9 w-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                                    <path fill="#2196f3" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path>
                                                    <path fill="#fff" d="M22 22h4v11h-4V22zM26.5 16.5c0 1.379-1.121 2.5-2.5 2.5s-2.5-1.121-2.5-2.5S22.621 14 24 14 26.5 15.121 26.5 16.5z"></path>
                                                </svg>
                                            </button>
                                        </div>

                                    </div>

                                );
                            }}
                        </For>
                    </div>

                    {/* Dodavanje navigacije za stranicu */}
                    <div class="flex justify-center space-x-4 mt-6">
                        <button
                            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            disabled={currentPage() === 1}
                            onClick={() => setCurrentPage(currentPage() - 1)}
                        >
                            Prethodna
                        </button>
                        <span class="self-center">{`Stranica ${currentPage()} od ${Math.ceil(data().length / itemsPerPage)}`}</span>
                        <button
                            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            disabled={currentPage() === Math.ceil(data().length / itemsPerPage)}
                            onClick={() => setCurrentPage(currentPage() + 1)}
                        >
                            Sljedeća
                        </button>
                    </div>
                </Show>
            </div>
        </div>
    );
};
