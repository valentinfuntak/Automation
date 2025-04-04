import { createEffect, createSignal, Show, For } from "solid-js";
import { useParams } from "@solidjs/router";
import { useAuth } from "../Auth/AuthProvider.jsx";
import { supabase } from "../Supabase/Supabase.js";

export default function AccountData() {
    const id = useParams().id;
    const session = useAuth();

    const [data, setData] = createSignal([]);
    const [editing, setEditing] = createSignal(false);
    const [formData, setFormData] = createSignal({
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        password: '',
        countryOfResidence: '',
        day: '',
        month: '',
        year: '',
        registered: false,
    });
    const [showPassword, setShowPassword] = createSignal(false); // New signal for showing/hiding password

    createEffect(async () => {
        await handleLoad();
    });

    async function handleLoad() {
        const { data: loadedData, error } = await supabase
            .from("AccountData")
            .select("*")
            .eq("id", id);
        if (error) {
            alert("Operacija nije uspjela.");
            console.log(error);
        } else {
            setData(loadedData);
            setFormData({
                firstName: loadedData[0].firstName,
                lastName: loadedData[0].lastName,
                gender: loadedData[0].gender,
                email: loadedData[0].email,
                password: loadedData[0].password,
                countryOfResidence: loadedData[0].countryOfResidence,
                day: loadedData[0].day,
                month: loadedData[0].month,
                year: loadedData[0].year,
                registered: loadedData[0].registered,
            });
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSave = async () => {
        const { firstName, lastName, gender, email, password, countryOfResidence, day, month, year, registered } = formData();
        const { error } = await supabase
            .from("AccountData")
            .update({
                firstName,
                lastName,
                gender,
                email,
                password,
                countryOfResidence,
                day,
                month,
                year,
                registered,
            })
            .eq("id", id);

        if (error) {
            alert("Ažuriranje nije uspjelo.");
            console.log(error);
        } else {
            alert("Podaci su uspješno ažurirani.");
            setEditing(false);
            handleLoad(); // Reload data after update
        }
    };

    const handleDeleteAccount = async (id) => {
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
        <Show when={data()}>
            <For each={data()} fallback={<div class="text-red-600 text-xl">Nema podataka.</div>}>
                {(item) => {
                    return (
                        <div class="mt-10 sm:mt-1 flex flex-col gap-3 bg-white text-black p-6 rounded-lg shadow-lg relative">
                            <h2 class="text-3xl font-bold text-start text-black">Account {item.id}</h2>
                            {!editing() ? (
                                <>
                                    <p><span class="font-semibold text-blue-600">FirstName:</span> {item.firstName}</p>
                                    <p><span class="font-semibold text-blue-600">LastName:</span> {item.lastName}</p>
                                    <p><span class="font-semibold text-blue-600">Gender:</span> {item.gender}</p>
                                    <p><span class="font-semibold text-blue-600">Email:</span> {item.email}</p>
                                    <p><span class="font-semibold text-blue-600">Password:</span> {item.password}</p>
                                    <p><span class="font-semibold text-blue-600">Country of residence:</span> {item.countryOfResidence}</p>
                                    <p><span class="font-semibold text-blue-600">Date:</span> {item.day}.{item.month}.{item.year}.</p>
                                    <p><span class="font-semibold text-blue-600">Registered:</span> {item.registered ? "True" : "False"}</p>
                                    <button onClick={() => setEditing(true)} class="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200">Edit</button>
                                    <button
                                        class="w-full bg-red-500 text-white py-2 px-2 rounded-md hover:bg-red-600 h-12 flex items-center justify-center"
                                        onClick={() => handleDeleteAccount(item.id)}
                                    >
                                        <svg class="h-8 w-8" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M891.985346 118.062169H132.453901c-21.242549 0 7.385285 95.748636 7.385285 95.748636l81.566801 673.649991c1.372006 11.37127 9.543635 22.025821 20.586238 24.967444 4.380181 1.174396 537.768122 0.324572 542.279361-0.849825 11.176732-2.941623 19.411842-12.746348 20.783848-24.184171l79.60606-673.583439c0.002048 0.001024 28.629881-95.748636 7.323852-95.748636z" fill="#27323A"></path>
                                                <path d="M882.18062 244.530437H142.355896c-36.960212 0-66.927288-29.967076-66.927288-66.927289s29.966052-66.927288 66.927288-66.927288h739.824724c36.960212 0 66.927288 29.966052 66.927288 66.927288-0.001024 36.961236-29.967076 66.927288-66.927288 66.927289z" fill="#27323A"></path>
                                            </g>
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div class="flex flex-col gap-4">
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700">First Name:</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData().firstName}
                                                onInput={handleInputChange}
                                                class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700">Last Name:</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData().lastName}
                                                onInput={handleInputChange}
                                                class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700">Gender:</label>
                                            <input
                                                type="text"
                                                name="gender"
                                                value={formData().gender}
                                                onInput={handleInputChange}
                                                class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700">Email:</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData().email}
                                                onInput={handleInputChange}
                                                class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700">Password:</label>
                                            <div class="flex items-center">
                                                <input
                                                    type={showPassword() ? "text" : "password"}
                                                    name="password"
                                                    value={formData().password}
                                                    onInput={handleInputChange}
                                                    class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword())}
                                                    class="ml-2 text-blue-500 hover:underline"
                                                >
                                                    {showPassword() ? "Sakrij" : "Prikaži"}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700">Country of Residence:</label>
                                            <input
                                                type="text"
                                                name="countryOfResidence"
                                                value={formData().countryOfResidence}
                                                onInput={handleInputChange}
                                                class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div class="flex space-x-2">
                                            <div>
                                                <label class="block text-sm font-semibold text-gray-700">Day:</label>
                                                <input
                                                    type="number"
                                                    name="day"
                                                    value={formData().day}
                                                    onInput={handleInputChange}
                                                    class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-semibold text-gray-700">Month:</label>
                                                <input
                                                    type="number"
                                                    name="month"
                                                    value={formData().month}
                                                    onInput={handleInputChange}
                                                    class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-semibold text-gray-700">Year:</label>
                                                <input
                                                    type="number"
                                                    name="year"
                                                    value={formData().year}
                                                    onInput={handleInputChange}
                                                    class="input px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label class="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name="registered"
                                                    checked={formData().registered}
                                                    onChange={handleCheckboxChange}
                                                    class="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span class="text-sm font-semibold text-gray-700">Račun registriran</span>
                                            </label>
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            class="mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                                        >
                                            Spremi
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                }}
            </For>
        </Show>
    );
}
