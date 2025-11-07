import { useState } from "react";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateTrip() {
  const [trip, setTrip] = useState({
    startPoint: "",
    endPoint: "",
    route: "",
    departureTime: "",
    seats: "",
    price: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No se encontró token. Inicia sesión.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ necesario para obtener el driver
        },
        // ✅ aseguramos que los números no se envíen como strings
        body: JSON.stringify({
          ...trip,
          seats: Number(trip.seats),
          price: Number(trip.price),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Trip created successfully!");
        console.log("Nuevo viaje guardado:", data);

        // ✅ Limpia el formulario tras guardar
        setTrip({
          startPoint: "",
          endPoint: "",
          route: "",
          departureTime: "",
          seats: "",
          price: "",
        });
      } else {
        setMessage(`❌ ${data.message || "Error al crear el viaje"}`);
      }
    } catch (err) {
      console.error("Error al crear viaje:", err);
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-white p-6 font-[Plus Jakarta Sans]">
      {/* Header */}
      <header className="flex justify-between items-center w-full max-w-6xl mt-6">
        <button className="text-2xl font-bold text-gray-700">←</button>
        <h1 className="text-4xl font-extrabold text-gray-800">Wheeler</h1>
        <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
      </header>

      {/* Info banner */}
      <div className="bg-emerald-500 text-white rounded-lg px-6 py-4 mt-10 flex justify-between items-center max-w-xl w-full shadow">
        <div>
          <h2 className="text-xl font-bold">Enter your destination</h2>
          <p className="text-sm font-medium">Tell us wherever you go.</p>
        </div>
        <button className="bg-emerald-600 px-3 py-1 rounded-md">✕</button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white mt-16 rounded-2xl shadow-lg p-8 w-full max-w-4xl space-y-6"
      >
        <div>
          <label className="block font-bold text-gray-700">Start Point</label>
          <input
            type="text"
            name="startPoint"
            value={trip.startPoint}
            onChange={handleChange}
            placeholder="Edificio K, Universidad de La Sabana"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700">End Point</label>
          <input
            type="text"
            name="endPoint"
            value={trip.endPoint}
            onChange={handleChange}
            placeholder="Enter your destination"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700">Route</label>
          <input
            type="text"
            name="route"
            value={trip.route}
            onChange={handleChange}
            placeholder="Example: Via Chía - Puente del Común"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-gray-700">Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={trip.departureTime}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700">Seats</label>
            <input
              type="number"
              name="seats"
              value={trip.seats}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700">Price (per passenger)</label>
          <input
            type="number"
            name="price"
            value={trip.price}
            onChange={handleChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gray-800 text-white font-bold text-xl px-6 py-3 rounded-xl mt-4 flex items-center justify-center w-full hover:bg-gray-700 transition"
        >
          Create →
        </button>

        {message && (
          <p className="text-center mt-4 font-semibold text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
