import { useNavigate } from "@solidjs/router";
import { createSignal, onCleanup } from "solid-js";
import { supabase } from "../Supabase/Supabase.js";

export default function Accounts() {
    const navigate = useNavigate();
    const [data, setData] = createSignal([]);
    const [error, setError] = createSignal(null);
    const [loading, setLoading] = createSignal(true);
    const [page, setPage] = createSignal(1);
    const pageSize = 10;

    async function handleLoad() {
        setLoading(true);
        const from = (page() - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data: loadedData, error } = await supabase
            .from("AccountData")
            .select("*")
            .range(from, to);

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

    function handleNextPage() {
        setPage(page() + 1);
        handleLoad();
    }

    function handlePrevPage() {
        if (page() > 1) {
            setPage(page() - 1);
            handleLoad();
        }
    }

    handleLoad();

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
                            <th class="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading() ? (
                            <tr>
                                <td colSpan="5" class="text-center py-4">Loading...</td>
                            </tr>
                        ) : error() ? (
                            <tr>
                                <td colSpan="5" class="text-center py-4 text-red-600">Error: {error()}</td>
                            </tr>
                        ) : (
                            data()?.map(account => (
                                <tr key={account.id} class="border-b hover:bg-gray-50">
                                    <td class="px-6 py-3 text-sm text-gray-700">{account.id}</td>
                                    <td class="px-6 py-3 text-sm text-gray-700">{account.firstName}</td>
                                    <td class="px-6 py-3 text-sm text-gray-700">{account.email}</td>
                                    <td class="px-6 py-3 text-sm text-gray-700">{new Date(account.created_at).toLocaleString()}</td>
                                    <td class="px-6 py-3 text-sm text-center">
                                        <button
                                            onClick={() => handleEdit(account.id)}
                                            class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div class="flex justify-between items-center mt-6">
                <button 
                    onClick={handlePrevPage} 
                    disabled={page() === 1} 
                    class="px-5 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg disabled:opacity-50 shadow-md hover:bg-gray-400 transition duration-200"
                >
                    ← Previous
                </button>
                <span class="text-gray-700 font-semibold">Page {page()}</span>
                <button 
                    onClick={handleNextPage} 
                    class="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};