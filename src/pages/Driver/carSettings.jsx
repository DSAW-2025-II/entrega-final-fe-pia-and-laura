import { useState } from "react";
import { ArrowLeft, Star, Settings, Home, Activity, User } from "lucide-react";

export default function CarModel() {
  const [licensePlate, setLicensePlate] = useState("ABC 123");
  const [capacity, setCapacity] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  return (
    <div className="min-h-screen bg-white rounded-2xl flex flex-col items-center relative p-8">
      {/* Botón atrás */}
      <button className="absolute top-6 left-6">
        <ArrowLeft size={32} className="text-black" />
      </button>

      {/* Barra superior */}
      <div className="absolute top-6 right-8 flex items-center gap-12 text-gray-600 text-lg">
        <div className="flex flex-col items-center">
          <Home size={28} className="text-gray-400" />
          <span>Home</span>
        </div>
        <div className="flex flex-col items-center">
          <Activity size={28} className="text-gray-400" />
          <span>Activity</span>
        </div>
        <div className="flex flex-col items-center">
          <User size={28} className="text-black" />
          <span className="text-black font-medium">Account</span>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col items-center mt-28">
        {/* Icono usuario */}
        <div className="w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <User size={96} className="text-white" />
        </div>

        {/* Título y etiqueta */}
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-6xl font-bold text-gray-800">Car Model</h1>
          <div className="flex items-center bg-gray-200 rounded-xl px-4 py-2">
            <Star fill="black" className="text-black mr-2" />
            <span className="text-2xl font-medium text-black">Frecuent</span>
          </div>
        </div>

        {/* Icono configuración */}
        <button className="absolute right-20 top-1/2">
          <Settings size={28} className="text-gray-600" />
        </button>

        {/* Campos de entrada */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              License Plate
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              Make
            </label>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            >
              <option value="">Select your car make</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              Vehicle capacity
            </label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            >
              <option value="">Select vehicle capacity</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            >
              <option value="">Select your car model</option>
              <option value="Corolla">Corolla</option>
              <option value="Civic">Civic</option>
              <option value="Focus">Focus</option>
            </select>
          </div>
        </div>

        {/* Botón Done */}
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-3xl px-20 py-3 rounded-xl shadow-md">
          Done
        </button>
      </div>
    </div>
  );
}
