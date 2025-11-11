import { useState } from "react";
import SearchRideMap from "../components/SearchRideMap";

export default function SearchRide() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // sugerencias
  const [selectedLocation, setSelectedLocation] = useState(null); // punto elegido

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) return setResults([]);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_URL}/maps/geocode?place=${text}`);
      const data = await res.json();

      // Guardar sugerencias
      setResults(data.features || []);
    } catch (err) {
      console.error("Error buscando lugares:", err);
    }
  };

  const handleSelect = (place) => {
    setSelectedLocation({
      name: place.place_name,
      longitude: place.center[0],
      latitude: place.center[1],
    });
    setQuery(place.place_name);
    setResults([]); // ocultar lista
  };

  return (
    <div className="relative w-full h-screen bg-white font-[Plus Jakarta Sans]">
      {/* Header */}
      <div className="absolute top-10 left-10 text-gray-800 font-bold text-4xl">
        Search a Ride
      </div>

      {/* Mapa */}
      <div className="absolute top-36 left-0 w-full h-[70%]">
        <SearchRideMap
            selectedLocation={selectedLocation}
            onMapClick={(coords) =>
            setSelectedLocation({
            longitude: coords.longitude,
            latitude: coords.latitude,
            })
            }
        />
      </div>

      {/* Panel inferior */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-5xl">
        <div className="flex flex-col w-full md:w-2/3 relative">
          <span className="text-gray-700 font-semibold text-lg">
            Edificio K, Universidad de La Sabana
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter your destination"
            className="mt-3 border border-gray-300 rounded-xl p-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {/* Lista de sugerencias */}
          {results.length > 0 && (
            <ul className="absolute top-[100%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-md mt-1 max-h-60 overflow-auto z-20">
              {results.map((r) => (
                <li
                  key={r.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => handleSelect(r)}
                >
                  {r.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-10 py-4 rounded-xl flex items-center justify-center gap-2"
          onClick={() => console.log("Destino seleccionado:", selectedLocation)}
        >
          Search →
        </button>
      </div>
    </div>
  );
}
