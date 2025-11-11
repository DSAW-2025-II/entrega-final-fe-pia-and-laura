import SearchRideMap from "../components/SearchRideMap";
const handleSearch = async (query) => {
  if (!query.trim()) return;

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${API_URL}/maps/geocode?place=${query}`);
  const data = await res.json();
  console.log(data.features); // resultados sugeridos
};

export default function SearchRide() {
  return (
    <div className="relative w-full h-screen bg-white font-[Plus Jakarta Sans]">
      {/* Header */}
      <div className="absolute top-10 left-10 text-gray-800 font-bold text-4xl">
        Search a Ride
      </div>

      {/* Mapa */}
      <div className="absolute top-36 left-0 w-full h-[70%]">
        <SearchRideMap />
      </div>

      {/* Panel inferior */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-5xl">
        <div className="flex flex-col w-full md:w-2/3">
          <span className="text-gray-700 font-semibold text-lg">
            Edificio K, Universidad de La Sabana
          </span>
          <input
            type="text"
            placeholder="Enter your destination"
            className="mt-3 border border-gray-300 rounded-xl p-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-10 py-4 rounded-xl flex items-center justify-center gap-2">
          Search →
        </button>
      </div>
    </div>
  );
}
