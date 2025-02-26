import { useAuth } from "../Auth/AuthProvider.jsx";

export default function Home() {

  const session = useAuth();

  console.log(session());

  return (
    <>
      <div className="mt-10 sm:mt-1 max-h-screen bg-gray-700 rounded-xl p-2 flex flex-col items-start justify-start text-center">
        <h1 className="text-4xl text-white sm:text-5xl font-bold">Home</h1>
        
      </div>
    </>
  );
}