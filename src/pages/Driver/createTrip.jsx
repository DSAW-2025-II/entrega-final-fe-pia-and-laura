import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo2 from "../../../assets/logo2.png";
import AutocompleteInput from "./AutocompleteInput";


const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateTrip() {
  const { user, token } = useAuth();
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
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [tripData, setTripData] = useState(null);



  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFullUser(data);
        }
      } catch (err) {
        console.error("Error connecting to server:", err);
      }
    };
    fetchUser();
  }, [token]);

const handleChange = (e) => {
  const { name, value, coords } = e.target;
  
  setTrip((prev) => ({
    ...prev,
    [name]: value,
    ...(coords && name === "startPoint" && { startCoords: coords }),
    ...(coords && name === "endPoint" && { endCoords: coords }),
  }));
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({}); // limpia errores anteriores

  const newErrors = {};
    if (!trip.startPoint) newErrors.startPoint = "Required field *";
    if (!trip.endPoint) newErrors.endPoint = "Required field *";
    if (!trip.route) newErrors.route = "Required field *";
    if (!trip.departureTime) {
      newErrors.departureTime = "Required field *";
    } else {
      const selectedDate = new Date(trip.departureTime);

      // Ajustar ambas fechas a horario Colombia (UTC-5)
      const selectedCol = new Date(selectedDate.getTime() - 5 * 60 * 60 * 1000);
      const nowCol = new Date(Date.now() - 5 * 60 * 60 * 1000);

      if (selectedCol < nowCol) {
        newErrors.departureTime = "Date and time must be in the future.*";
      }
    }


    if (!trip.seats) newErrors.seats = "Required field *";
    else if (trip.seats <= 0) newErrors.seats = "Number of seats must be greater than 0.";

    if (!trip.price) newErrors.price = "Required field *";
    else if (trip.price < 1400) newErrors.price = "Price per passenger must be at least $1,400.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  if (!token) {
    setMessage("❌ No token found. Please log in.");
    return;
  }
  console.log("Trip being sent:", trip);
  const selectedDate = new Date(trip.departureTime);
  const departureCol = new Date(selectedDate.getTime() - 5 * 60 * 60 * 1000);

  try {
  const res = await fetch(`${API_URL}/trips`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },

body: JSON.stringify({
  ...trip,
  departureTime: departureCol.toISOString(),
  startCoords: trip.startCoords,
  endCoords: trip.endCoords,
  seats: Number(trip.seats),
  price: Number(trip.price),
  driver: fullUser?._id || fullUser?.id,
})

});
  const data = await res.json();

  if (res.ok) {
    // 🟢 Mostrar popup con datos del viaje
    setTripData({
      destination: data.endPoint,
      time: new Date(
      new Date(data.departureTime).getTime() - 5 * 3600 * 1000
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),

      price: data.price,
      driver: fullUser?.name || "Driver Name",
    });

    setShowSuccessPopup(true);

      // Limpia los campos
    setTrip({
      startPoint: "",
      endPoint: "",
      route: "",
      departureTime: "",
      seats: "",
      price: "",
    });
  } else {
    setMessage(`❌ ${data.message || "Error creating trip"}`);
  }
} catch (err) {
  console.error("Error creating trip:", err);
  setMessage("❌ Error connecting to server.");
}

  };
const reverseGeocodeZone = async (coords) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?types=address,neighborhood,locality,place&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features || data.features.length === 0) return "Unknown";

  const f = data.features[0];

  // 1. Intentar barrio (neighborhood)
  const neighborhood = f.context?.find(c => c.id.includes("neighborhood"));
  if (neighborhood) return neighborhood.text;

  // 2. Intentar localidad (locality)
  const locality = f.context?.find(c => c.id.includes("locality"));
  if (locality) return locality.text;

  // 3. Intentar dirección corta (calle)
  if (f.place_type.includes("address")) {
    return f.text; // Ej: "Calle 13"
  }

  // 4. Ciudad (fallback)
  const city = f.context?.find(c => c.id.includes("place"));
  if (city) return city.text;

  return f.text || "Unknown";
};


const generateRoute = async () => {
  let newErrors = {};

  if (!trip.startCoords) {
    newErrors.startPoint = "Selecciona un punto válido en el mapa.";
  }

  if (!trip.endCoords) {
    newErrors.endPoint = "Selecciona un punto válido en el mapa.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(prev => ({ ...prev, ...newErrors }));
    return;
  }

  const originZone = await reverseGeocodeZone(trip.startCoords);
  const destZone = await reverseGeocodeZone(trip.endCoords);

  const routeName = `${originZone} → ${destZone}`;

  setTrip(prev => ({ ...prev, route: routeName }));
};



  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-white p-6 font-[Plus Jakarta Sans]">
      {/* Header */}
      <header className="flex justify-between items-center w-full max-w-6xl mt-6">
        <button className="absolute top-6 left-6" onClick={() => navigate(-1)}>
          <ArrowLeft size={32} className="text-black" />
        </button>

        {/* 🔹 Título principal grande */}
        <h1 className="font-extrabold text-5xl md:text-6xl text-gray-900">
          Create Trip
        </h1>

        {/* 🔹 Foto y nombre alineados */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg text-gray-800">
            {fullUser?.name || "Wheeler"}
          </span>
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
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
          
        </div>
      </header>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white mt-16 rounded-2xl shadow-lg p-8 w-full max-w-4xl space-y-6"
      >

      {/* Campo: Start Point */}
      <div>
        <AutocompleteInput
          label="Start Point"
          name="startPoint"

          value={trip.startPoint}
          onChange={handleChange}
        />

        {errors.startPoint && (
          <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
            {errors.startPoint}
          </p>
        )}
      </div>



        {/* Campo: End Point */}
        <div>
          <AutocompleteInput
            label="End Point"
            name="endPoint"
            value={trip.endPoint}
            onChange={handleChange}
          />

          {errors.endPoint && (
            <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
              {errors.endPoint}
            </p>
          )}
        </div>

{/* Campo: Route */}
<div>
  <label className="block font-bold text-gray-700">Route</label>

  <div className="flex gap-3">
    <input
      type="text"
      name="route"
      value={trip.route}
      onChange={handleChange}
      placeholder="Auto-generated based on directions"
      className="w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0]"
      disabled
    />

    <button
      type="button"
      onClick={generateRoute}
      className="bg-gray-800 text-white px-4 py-2 rounded-xl mt-2 hover:bg-gray-700"
    >
      Auto
    </button>
  </div>

  {errors.route && (
    <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
      {errors.route}
    </p>
  )}
</div>


        {/* Departure Time y Seats */}
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
              className={`w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0] placeholder-gray-400 focus:outline-none ${
                errors.departureTime ? "border-orange-400" : "border-gray-200"
              }`}
            />
            {errors.departureTime && (
              <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
                {errors.departureTime}
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700">
              Seats 
            </label>
            <input
              type="number"
              name="seats"
              min="1"
              value={trip.seats}
              onChange={handleChange}
              className={`w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0] placeholder-gray-400 focus:outline-none ${
                errors.seats ? "border-orange-400" : "border-gray-200"
              }`}
            />
            {errors.seats && (
              <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
                {errors.seats}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
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
            className={`w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0] placeholder-gray-400 focus:outline-none ${
              errors.price ? "border-orange-400" : "border-gray-200"
            }`}
          />
          {errors.price && (
            <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
              {errors.price}
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="bg-gray-800 text-white font-bold text-xl px-6 py-3 rounded-xl mt-4 flex items-center justify-center w-full hover:bg-gray-700 transition"
        >
          Create →
        </button>

{showSuccessPopup && tripData && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md relative shadow-xl animate-fadeIn">

      {/* 🔹 Logo arriba centrado */}
      <div className="flex justify-center mb-4">
        <img
          src={logo2}
          alt="Wheels Unisabana Logo"
          className="w-32 h-auto object-contain"
        />
      </div>

      {/* 🔹 Botón de cierre (ya no se cierra por tiempo) */}
      <button
        onClick={() => {
          setShowSuccessPopup(false);
          navigate("/driverHome");
        }}className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
      >
        ✕
      </button>

      {/* 🔹 Contenido principal */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your ride is published
        </h2>
        <p className="text-base text-gray-700 mb-6">
          You can see details on activity
        </p>

        {/* 🔹 Tarjeta del viaje */}
        <div className="bg-gray-800 text-white rounded-2xl p-5 flex justify-between items-center">
          <div className="text-left">
            <p className="text-lg font-normal">To: {tripData.destination}</p>
            <p className="text-2xl font-bold">{tripData.time}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{tripData.driver}</p>
            <p className="text-2xl font-bold">${tripData.price}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



        {/* Mensaje */}
        {message && (
          <p
            className={`text-center mt-4 font-semibold text-sm ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-orange-500 bg-[#f5f0f0] p-3 rounded-lg"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
