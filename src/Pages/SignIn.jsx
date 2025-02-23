import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from "../Supabase/Supabase.js";

function SignIn(props) {
    const [error, setError] = createSignal('');
    const [loading, setLoading] = createSignal(false);

    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setError('Neispravni podaci za prijavu.');
                console.log(error.message);
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError('Došlo je do pogreške pri prijavi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        handleLogin(email, password);
    };

    return (
        <>
            <form onSubmit={formSubmit}>
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div class="w-full bg-gray-800 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0  border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                                Prijava
                            </h1>
                            <div class="space-y-4 md:space-y-6">
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium text-white">E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        class="rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label for="password" class="block mb-2 text-sm font-medium text-white">Lozinka</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        class="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                class="w-4 h-4 border rounded focus:ring-3 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800"
                                            />
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label class="text-gray-300">Zapamti podatke</label>
                                        </div>
                                    </div>
                                    <a href="#" class="text-white hover:text-info text-sm font-medium hover:underline text-primary-500">Zaboravljena lozinka?</a>
                                </div>

                                {error() && (
                                    <div class="text-red-500 text-sm">{error()}</div>
                                )}

                                <button
                                    type="submit"
                                    class="w-full bg-indigo-700 hover:bg-indigo-600 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                                    disabled={loading()}
                                >
                                    {loading() ? 'Prijava...' : 'Prijava'}
                                </button>

                                <p class="text-sm font-light text-gray-400">
                                    Nemate račun? <a href="/" class="font-medium hover:underline text-primary-500 text-white hover:text-info">Registracija</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default SignIn;
