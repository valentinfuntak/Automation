import { A } from "@solidjs/router"; // Koristi A za navigaciju
import DataGenerator from "../Programs/DataGenerator";

export default function Programs() {
  return (
    <>
      <div className="max-h-screen bg-gray-700 rounded-xl p-4 flex flex-col items-start text-start">
        <h1 className="text-4xl text-white sm:text-5xl font-bold item-center mb-6">Programs</h1>
        {/* Kartica za DataGenerator */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white w-full max-w-sm">
          <h2 className="align-start text-xl font-semibold">Data Generator</h2>
          <p className="text-gray-300">Generiraj nasumične podatke za testiranje.</p>
          <A href="/Home/Programs/DataGenerator" className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Otvori
          </A>
        </div>
      </div>
    </>
  );
}
