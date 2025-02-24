import { supabase } from "../Supabase/Supabase.js"; // Povezivanje sa Supabaseom
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

export default function DataGenerator() {

    const [numAccounts, setNumAccounts] = createSignal(1);
    const [generatedData, setGeneratedData] = createSignal([]);
    const [existingData, setExistingData] = createSignal(new Set()); // Za praćenje postojećih podataka
    const [currentPage, setCurrentPage] = createSignal(1);
    const itemsPerPage = 12; // Broj računa po stranici

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


    return (
        <div class="mt-3 w-full rounded-2xl justify-start">
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
                                            <p><strong>First Name:</strong> {data.firstName}</p>
                                            <p><strong>Last Name:</strong> {data.lastName}</p>
                                        </div>
                                        <div>
                                            <p><strong>Date:</strong> {data.day}. {data.month} {data.year}</p>
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

                                        {/* Gumb za brisanje */}
                                        <button
                                            class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 absolute bottom-4 right-4"
                                            onClick={() => handleDelete(item.id)} // Pozivanje funkcije s ID-jem
                                        >
                                            {/* Ikona kante za smeće */}
                                            <svg
                                                viewBox="0 0 1024 1024"
                                                class="icon h-6 w-6" // Manja veličina ikone
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="#000000"
                                            >
                                                <g id="SVGRepo_iconCarrier">
                                                    <path d="M891.985346 118.062169H132.453901c-21.242549 0 7.385285 95.748636 7.385285 95.748636l81.566801 673.649991c1.372006 11.37127 9.543635 22.025821 20.586238 24.967444 4.380181 1.174396 537.768122 0.324572 542.279361-0.849825 11.176732-2.941623 19.411842-12.746348 20.783848-24.184171l79.60606-673.583439c0.002048 0.001024 28.629881-95.748636 7.323852-95.748636z" fill="#27323A"></path>
                                                    <path d="M484.995025 613.806966v150.780424h-96.729519l-10.129297-150.780424h75.751132zM332.384917 764.58739h-67.254932l-18.625498-150.780424h75.751132zM318.527653 558.053338h-78.886269l-19.345289-157.25138h87.64356zM484.995025 400.801958v157.25138H374.412338l-10.524517-157.25138zM659.701601 400.801958L649.177084 558.053338H540.748652V400.801958zM645.453213 613.806966l-10.133393 150.780424h-94.571168V613.806966zM691.204505 764.58739l10.129298-150.780424h79.476026L762.705489 764.58739zM705.057674 558.053338l10.587998-157.25138h90.783816l-18.887613 157.25138z" fill="#F4CE73"></path>
                                                    <path d="M882.18062 244.530437H142.355896c-36.960212 0-66.927288-29.967076-66.927288-66.927289s29.966052-66.927288 66.927288-66.927288h739.824724c36.960212 0 66.927288 29.966052 66.927288 66.927288-0.001024 36.961236-29.967076 66.927288-66.927288 66.927289z" fill="#27323A"></path>
                                                    <path d="M142.355896 194.335482c-9.215992 0-16.73131-7.516342-16.73131-16.73131s7.516342-16.73131 16.73131-16.73131h739.824724c9.215992 0 16.73131 7.516342 16.73131 16.73131s-7.516342 16.73131-16.73131 16.73131H142.355896z" fill="#79CCBF"></path>
                                                    <path d="M484.995025 227.799126v117.252276H360.096373l-7.873678-117.252276zM663.489977 345.051402H540.748652V227.799126h131.565169zM296.341082 227.799126l7.874702 117.252276H213.431968l-14.475691-117.252276zM813.161534 345.051402h-93.787896l7.873678-117.252276h100.032573z" fill="#FFFFFF"></path>
                                                </g>
                                            </svg>
                                        </button>
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
