import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function SeeOffers() {
    const [trips, setTrips] = useState([]); // ✅ aquí defines trips
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState("");
    const [selectedOffer, setSelectedOffer] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
const params = new URLSearchParams(location.search);

const lat = params.get("lat");
const lng = params.get("lng");
const queryName = params.get("query");
const radius = params.get("radius") || 5;

  const fetchTrips = async (minSeats = "") => {
  try {
    setLoading(true);

    let url = `${API_URL}/trips/search?lat=${lat}&lng=${lng}&radius=${radius}`;

    if (minSeats) {
      url += `&seats=${minSeats}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    console.log("🟢 Trips filtered by destination:", data);
    setTrips(data);
  } catch (error) {
    console.error("Error fetching trips:", error);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  if (lat && lng) {
    fetchTrips(selectedSeats);
  }
}, [lat, lng, radius, selectedSeats]);


  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedSeats(value);
    fetchTrips(value); // 🔹 recarga con filtro
  };
  // 🔹 Skeleton component para mostrar mientras carga
const SkeletonCard = () => (
  <div className="p-4 bg-gray-800 rounded-xl mb-3 shadow-md animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>
    <div className="flex justify-between">
      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/6"></div>
      <div className="h-3 bg-gray-700 rounded w-1/5"></div>
    </div>
  </div>
);
// 🔹 Aplica el filtro de asientos al listado
const filteredOffers = selectedSeats
  ? trips.filter((trip) => trip.seats >= parseInt(selectedSeats))
  : trips;



return (
  <div className="p-8 min-h-screen bg-gray-50 flex flex-col gap-4">
    {/* Header */}
    <header className="flex items-center gap-3 mb-2">
      {/* Flecha de retroceso */}
      <button
        className="text-gray-800 text-2xl"
        onClick={() => navigate("/passengerHome")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Título principal */}
      <h1 className="text-4xl font-bold text-gray-900">Offers</h1>

      {/* Filtro de asientos (sin cambios) */}
      <div className="ml-auto flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
        <select
          value={selectedSeats}
          onChange={handleFilterChange}
          className="bg-transparent border-none text-gray-700 font-medium outline-none"
        >
          <option value="">Seats left</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>
    </header>

    {/* Subtítulo encima de las tarjetas */}
    <p className="text-sm text-gray-500 px-1">
      Results near: <span className="font-medium text-gray-700">{trips[0]?.endPoint ?? "Unknown location"}</span>
    </p>



    {/* Contenedor principal */}
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Lista de ofertas */}
      <div className="flex-1 flex flex-col gap-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredOffers.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            No trips available with the selected seats.
          </p>
        ) : (
          <AnimatePresence>
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedOffer(offer)}
                className={`relative flex justify-between items-center p-5 rounded-3xl cursor-pointer shadow-lg text-white ${
                  index % 3 === 0
                    ? "bg-amber-500"
                    : index % 3 === 1
                    ? "bg-gray-800"
                    : "bg-emerald-500"
                }`}
              >
                <div>
                  <p className="font-semibold text-xl">
                    From: {offer.startPoint ?? "Sin origen"}
                  </p>
                  <p className="text-lg opacity-80">
                    🕒{" "}
                    {offer.departureTime
                      ? new Date(offer.departureTime).toLocaleTimeString(
                          "es-CO",
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : "Sin hora"}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-semibold text-xl">
                    Driver {offer.driver?.name ?? "No driver"}
                  </p>
                  <p className="font-bold">${offer.price ?? "N/A"}</p>
                </div>

                {/* Badge de asientos */}
                <div className="absolute right-2 top-2 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow">
                  {offer.seats?.toString().padStart(2, "0") ?? "00"}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Panel lateral */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-gray-800 text-white rounded-3xl p-8 w-full lg:w-1/3 relative shadow-2xl"
          >
            <button
              className="absolute right-4 top-4 hover:scale-110 transition"
              onClick={() => setSelectedOffer(null)}
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Wallet size={30} />
              <h2 className="text-2xl font-bold">Trip Details</h2>
            </div>

            <ul className="space-y-3 text-lg">
              <li>
                <span className="font-semibold text-md">From:</span>{" "}
                {selectedOffer.startPoint ?? "Sin origen"}
              </li>
              <li>
                <span className="font-semibold text-md">Driver:</span>{" "}
                {selectedOffer.driver?.name ?? "No driver"}
              </li>
              <li>
                <span className="font-semibold text-md">Time:</span>{" "}
                {selectedOffer.departureTime
                  ? new Date(selectedOffer.departureTime).toLocaleTimeString(
                      "es-CO",
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : "Sin hora"}
              </li>
            </ul>

            <div className="flex justify-end items-center mt-8">
              <h2 className="text-7xl font-extrabold text-center">
                ${selectedOffer.price ?? 0}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

}