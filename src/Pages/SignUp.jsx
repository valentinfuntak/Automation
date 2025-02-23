import { useNavigate, A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { supabase } from "../Supabase/Supabase.js";

function SignUp(props) {
  const navigate = useNavigate();

  const [result, setResult] = createSignal({
    error: "",
    loading: false,
    success: false,
  });

  const handleRegistration = async (e) => {
    e.preventDefault();
    setResult({ ...result(), loading: true, error: "", success: false });

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    if (password !== confirmPassword) {
      setResult({
        ...result(),
        error: "Lozinke se ne poklapaju!",
        loading: false,
      });
      return;
    }

    try {
      const { user, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        setResult({
          ...result(),
          error: `Greška prilikom registracije: ${signupError.message}`,
          loading: false,
        });
      } else {
        setResult({ ...result(), success: true, loading: false });
        console.log("Korisnik uspješno registriran:", user);

        navigate("/signin");
      }
    } catch (err) {
      setResult({
        ...result(),
        error: "Došlo je do pogreške pri registraciji.",
        loading: false,
      });
    }
  };

  return (
    <>
      <section className=" bg-base-200">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                Registracija
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleRegistration}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Lozinka
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Potvrdite lozinku
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {result().error && (
                  <div className="text-red-500 text-sm">{result().error}</div>
                )}

                {result().success && (
                  <div className="text-green-500 text-sm">
                    Račun uspješno registriran! Preusmjeravam na prijavu...
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-700 hover:bg-indigo-600 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                  disabled={result().loading}
                >
                  {result().loading ? "Registracija..." : "Registracija"}
                </button>

                <p className="text-sm font-light text-white">
                  Već imate račun?{" "}
                  <A
                    href="/signin"
                    className="text-white hover:text-info font-medium hover:underline text-primary-500"
                  >
                    Prijavite se ovdje.
                  </A>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUp;
