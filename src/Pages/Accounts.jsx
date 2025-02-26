import { useNavigate } from "@solidjs/router";
import { createSignal, onCleanup } from "solid-js";
import { supabase } from "../Supabase/Supabase.js"; 

export default function Accounts() {
    const navigate = useNavigate();
    const [data, setData] = createSignal([]);
    const [error, setError] = createSignal(null);
    const [loading, setLoading] = createSignal(true);

    async function handleLoad() {
        setLoading(true);
        const { data: loadedData, error } = await supabase
            .from("AccountData")
            .select("*");

        if (error) {
            setError(error.message);
            console.log(error);
        } else {
            setData(loadedData);
        }
        setLoading(false);
    }

    function handleEdit(id) {
        navigate(`/Home/AccountData/${id}`);
    }

    handleLoad();

    function renderStatus(registered) {
        return registered ? (
            <span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        ) : (
            <span class="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
        );
    }
    
    onCleanup(() => {
        setData([]);
        setError(null);
        setLoading(false);
    });

    return (
        <div class="mt-10 sm:mt-1 container mx-auto">
            <h1 class="text-2xl font-bold mb-4 text-blue-600 uppercase">Accounts</h1>
            <div class="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table class="min-w-full table-auto text-center border-collapse">
                    <thead>
                        <tr class="bg-blue-100">
                            <th class="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
                            <th class="px-6 py-3 text-sm font-semibold text-gray-600">First name</th>
                            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Created At</th>
                            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Registered</th>
                            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading() ? (
                            <tr>
                                <td colSpan="6" class="text-center py-4">Loading...</td>
                            </tr>
                        ) : error() ? (
                            <tr>
                                <td colSpan="6" class="text-center py-4 text-red-600">Error: {error()}</td>
                            </tr>
                        ) : (
                            data()?.map(account => (
                                <tr key={account.id} class="border-b hover:bg-gray-50">
                                    <td class="px-6 py-3 text-sm text-gray-700">{account.id}</td>
                                    <td class="px-6 py-3 text-sm text-gray-700">{account.firstName}</td>
                                    <td class="px-6 py-3 text-sm text-gray-700">{account.email}</td>
                                    <td class="px-6 py-3 text-sm text-gray-700">{new Date(account.created_at).toLocaleString()}</td>
                                    <td class="px-6 py-3 text-sm text-center">
                                        <div class="flex justify-center items-center">
                                            {renderStatus(account.registered)}
                                        </div>
                                    </td>
                                    <td class="px-6 py-3 text-sm text-center">
                                        <div class="flex justify-center items-center">
                                            <button
                                                onClick={() => handleEdit(account.id)}
                                                class="text-blue-500 hover:text-blue-700 transition duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232a3 3 0 114.242 4.242l-8.464 8.464a1.5 1.5 0 01-.41.248l-4.242 1.413a.75.75 0 01-.928-.929l1.413-4.242a1.5 1.5 0 01.248-.41l8.464-8.464z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
