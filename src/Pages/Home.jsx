import {useNavigate} from "@solidjs/router";
import { useAuth } from "../Auth/AuthProvider.jsx";



export default function Home() {
  const session = useAuth();
  const navigate = useNavigate();

  const handleCheck = (data) => {
    navigate(`/Home/Programs/`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-4xl text-center p-6 rounded-2xl shadow-lg bg-gray-800 bg-opacity-90">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in">Welcome Home</h1>
        <p className="text-lg opacity-80 mb-6">
          {session() ? `Welcome back, ${session().user.email}!` : "Sign in to access more features."}
        </p>
        <button onClick={handleCheck} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition duration-300">
          {session() ? "Go to programs" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
