import { useState } from "react";
import SearchRideMap from "../components/SearchRideMap";
import { useNavigate } from "react-router-dom";

export default function SearchRide() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // sugerencias
  const [selectedLocation, setSelectedLocation] = useState(null); // punto elegido
  const [selectedSeats, setSelectedSeats] = useState("");

  const handleFilterChange = (e) => {
    setSelectedSeats(e.target.value);
  };
  const navigate = useNavigate();

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

  const handleMapClick = (location) => {
    setSelectedLocation(location);
    setQuery(location.name);
  };

const handleSearchClick = () => {
  if (!selectedLocation) {
    alert("Selecciona un destino antes de continuar.");
    return;
  }

  navigate(
    `/seeOffers?to=${encodeURIComponent(selectedLocation.name)}&lat=${selectedLocation.latitude}&lng=${selectedLocation.longitude}&radius=5`
  );
};


  return (
    <div className="relative w-full h-screen bg-white font-[Plus Jakarta Sans]">
     <header className="sticky top-0 left-0 right-0 z-30 bg-white w-full h-16 border-b border-gray-200">
  <div className="flex items-center justify-between h-full px-4">
    <button
      onClick={() => navigate("/passengerHome")}
      className="p-2 flex items-center justify-center h-10 w-10"
      aria-label="Back"
    >
      <BackIcon className="w-6 h-6 text-gray-800" />
    </button>

    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1">
      Reservations
    </h1>

    <div className="w-10 h-10" aria-hidden="true" />
  </div>
</header>

      {/* Mapa */}
      <div className="absolute top-36 left-0 w-full h-[70%]">
        <SearchRideMap
          selectedLocation={selectedLocation}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Panel inferior */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-5xl">
        <div className="flex flex-col w-full md:w-2/3 relative">
          <span className="text-gray-700 font-semibold text-lg">
            Enter your destination as an address or click on the map:
          </span>

          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Kilometro 7 Autopista Norte costado Occidental , Chía, Cundinamarca"
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
          onClick={handleSearchClick}
        >
          Search →
        </button>
      </div>
    </div>
  );
}
