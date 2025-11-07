import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateTrip() {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const [fullUser, setFullUser] = useState(user);
  const [trip, setTrip] = useState({
    startPoint: "",
    endPoint: "",
    route: "",
    departureTime: "",
    seats: "",
    price: "",
  });
  const [message, setMessage] = useState("");

  // 🔹 Al montar el componente, obtenemos los datos completos del usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return; // No token => no llamada
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFullUser(data);
        } else {
          console.error("Error al obtener usuario:", await res.text());
        }
      } catch (err) {
        console.error("Error de conexión:", err);
      }
    };
    fetchUser();
  }, [token]);

  // 🔹 Manejadores de formulario
  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("No se encontró token. Inicia sesión.");
      return;
    }

    // 🔹 Validaciones
    if (trip.seats <= 0) {  
        setMessage("❌ El número de asientos debe ser mayor que 0.");
        return;
    }

    if (trip.price < 1400) {
        setMessage("❌ El precio por pasajero debe ser al menos $1.400.");
        return;
    }

    try {
      const res = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...trip,
          seats: Number(trip.seats),
          price: Number(trip.price),
          driver: fullUser?._id || fullUser?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Trip created successfully!");
        console.log("Nuevo viaje guardado:", data);
          setTimeout(() => navigate("/driverHome"), 1000);
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

  console.log("👤 Usuario desde contexto:", fullUser);

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-white p-6 font-[Plus Jakarta Sans]">
      {/* Header */}
      <header className="flex justify-between items-center w-full max-w-6xl mt-6">
        <button className="absolute top-6 left-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={32} className="text-black" />
        </button>

        {/* 🔹 Mostrar nombre real del usuario */}
        <h1 className="font-extrabold text-5xl md:text-6xl">
          {fullUser?.name || "Wheeler"}
        </h1>

        {/* 🔹 Mostrar foto si existe */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          {fullUser?.photo ? (
            <img
              src={fullUser.photo}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400" />
          )}
        </div>
      </header>

      {/* Formulario */}
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
            <label className="block font-bold text-gray-700">
              Departure Time
            </label>
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
              min="1"
              value={trip.seats}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700">
            Price (per passenger)
          </label>
          <input
            type="number"
            name="price"
            min="1400"
            step="100"
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
          <p className="text-center mt-4 font-semibold text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
