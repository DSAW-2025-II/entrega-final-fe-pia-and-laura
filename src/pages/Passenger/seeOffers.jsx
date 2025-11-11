import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function SeeOffers() {
  const [trips, setTrips] = useState([]); // ✅ aquí defines trips
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);

  const fetchTrips = async (minSeats = "") => {
    try {
      setLoading(true);

      let url = `${API_URL}/trips`;
      if (minSeats) {
        url += `?seats=${minSeats}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      console.log("🟢 Trips from backend:", data);
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(); // 🔹 carga inicial sin filtro
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedSeats(value);
    fetchTrips(value); // 🔹 recarga con filtro
  };

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4 text-gray-800">Ver Ofertas de Viajes</h1>

    {/* 🔹 Filtro por asientos */}
    <div className="mb-4">
      <label className="mr-2 font-semibold text-gray-700">Filtrar por asientos:</label>
      <select
        value={selectedSeats}
        onChange={handleFilterChange}
        className="border rounded-md p-2 bg-white shadow-sm"
      >
        <option value="">Todos</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
    </div>

    <p className="text-gray-500 mb-4">
      Desde: <span className="font-medium text-gray-700">Ubicación actual</span>
    </p>

    {/* 🔹 Contenido principal */}
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 🔸 Lista de viajes */}
      <div className="flex-1 flex flex-col gap-3">
        {loading ? (
          <p className="text-gray-400">Cargando ofertas...</p>
        ) : trips.length === 0 ? (
          <p className="text-gray-400">No hay viajes disponibles.</p>
        ) : (
          <AnimatePresence>
            {trips.map((trip) => (
              <motion.div
                key={trip._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedOffer(trip)}
                className="p-4 bg-gray-800 rounded-xl shadow-md hover:shadow-xl cursor-pointer border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-1">
                  {trip.startPoint ?? "Sin origen"} ➜ {trip.endPoint ?? "Sin destino"}
                </h3>

                <p className="text-gray-400 text-sm mb-2">
                  Ruta: {trip.route || "No especificada"}
                </p>

                <div className="flex justify-between text-sm text-gray-300">
                  <span>
                    🕒{" "}
                    {trip.departureTime
                      ? new Date(trip.departureTime).toLocaleString("es-CO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "Sin hora"}
                  </span>

                  <span>💺 {trip.seats ?? 0}</span>
                  <span>💰 ${trip.price ?? "N/A"}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 🔸 Panel de detalle con animación */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="bg-amber-400 text-gray-900 rounded-2xl p-6 w-full lg:w-1/2 relative shadow-2xl"
          >
            <button
              className="absolute right-4 top-4 text-gray-800 hover:text-gray-600"
              onClick={() => setSelectedOffer(null)}
            >
              ✕
            </button>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Detalles del viaje</h2>
              <ul className="space-y-2">
                <li><span className="font-semibold">Origen:</span> {selectedOffer.startPoint}</li>
                <li><span className="font-semibold">Destino:</span> {selectedOffer.endPoint}</li>
                <li><span className="font-semibold">Ruta:</span> {selectedOffer.route || "No especificada"}</li>
                <li>
                  <span className="font-semibold">Fecha:</span>{" "}
                  {new Date(selectedOffer.departureTime).toLocaleString("es-CO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </li>
                <li><span className="font-semibold">Asientos:</span> {selectedOffer.seats}</li>
              </ul>

              <motion.h2
                className="text-5xl font-extrabold mt-6 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ${selectedOffer.price}
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
}