import { useEffect, useState } from "react";
import { Wallet, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function SeeOffers() {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [filterSeats, setFilterSeats] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_URL}/trips`);
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const filteredOffers = filterSeats
    ? offers.filter((offer) => offer.seatsLeft === filterSeats)
    : offers;

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Offers</h1>

        <div className="flex items-center gap-2">
          <select
            onChange={(e) => setFilterSeats(Number(e.target.value) || null)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Filter by seats left</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} seat{n > 1 && "s"} left
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-gray-500 mb-4">From: <span className="font-medium text-gray-700">Location</span></p>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Offers List */}
        <div className="flex-1 flex flex-col gap-3">
          {console.log("Offers from backend:", offers)}
          {filteredOffers.map((offer) => (
            <div
    key={offer._id}
    className="p-4 bg-gray-800 rounded-xl mb-3 shadow-md hover:shadow-lg transition"
  >
    <h3 className="text-lg font-semibold text-white mb-1">
      {offer.startPoint ?? "Sin origen"} ➜ {offer.endPoint ?? "Sin destino"}
    </h3>

    <p className="text-gray-400 text-sm mb-2">
      Ruta: {offer.route || "No especificada"}
    </p>

    <div className="flex justify-between text-sm text-gray-300">
      <span>
        🕒{" "}
        {offer.departureTime
          ? new Date(offer.departureTime).toLocaleString("es-CO", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "Sin hora"}
      </span>

      <span>
        💺 {offer.seats != null ? offer.seats.toString().padStart(2, "0") : "00"}
      </span>

      <span>
        💰 {offer.price != null ? `$${offer.price}` : "N/A"}
      </span>
    </div>
  </div>
))}
        </div>

        {/* Detail panel */}
        {selectedOffer && (
          <div className="bg-amber-400 text-white rounded-2xl p-6 w-full lg:w-1/2 relative shadow-xl">
            <button
              className="absolute right-4 top-4"
              onClick={() => setSelectedOffer(null)}
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Wallet size={30} />
              <h2 className="text-2xl font-bold">Trip Details</h2>
            </div>

            <ul className="space-y-2">
              <li><span className="font-semibold">To:</span> {selectedOffer.destination}</li>
              <li><span className="font-semibold">Driver:</span> {selectedOffer.driverName}</li>
              <li><span className="font-semibold">Time:</span> {selectedOffer.time}</li>
            </ul>

            <h2 className="text-5xl font-extrabold mt-6">${selectedOffer.price}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
