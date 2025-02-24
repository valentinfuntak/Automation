import DataGenerator from "../Programs/DataGenerator";

export default function Programs() {
    return (
      <>
      <div className="max-h-screen bg-gray-700 rounded-xl p-2 flex flex-col items-start justify-start text-center">
        <h1 className="text-4xl text-white sm:text-5xl font-bold">Programs</h1>
      </div>
      <DataGenerator/>  
      </>
    );
  }