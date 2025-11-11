import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    setTrip({ ...trip, [e.target.name]: e.target.value });
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
  const now = new Date();

  if (selectedDate < now) {
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
      setMessage(`❌ ${data.message || "Error creating trip"}`);
    }
  } catch (err) {
    console.error("Error creating trip:", err);
    setMessage("❌ Error connecting to server.");
  }
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
          <label className="block font-bold text-gray-700">Start Point</label>
          <input
            type="text"
            name="startPoint"
            value={trip.startPoint}
            onChange={handleChange}
            placeholder="Edificio K, Universidad de La Sabana"
            className={`w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0] placeholder-gray-400 focus:outline-none ${
              errors.startPoint ? "border-orange-400" : "border-gray-200"
            }`}
          />
            {errors.startPoint && (
            <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
              {errors.startPoint}
            </p>
          )}
        </div>


        {/* Campo: End Point */}
        <div>
          <label className="block font-bold text-gray-700">
            End Point 
          </label>
          <input
            type="text"
            name="endPoint"
            value={trip.endPoint}
            onChange={handleChange}
            placeholder="Enter your destination"
            className={`w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0] placeholder-gray-400 focus:outline-none ${
              errors.endPoint ? "border-orange-400" : "border-gray-200"
            }`}
          />
          {errors.endPoint && (
            <p className="text-orange-500 text-sm font-semibold mt-1 bg-[#f5f0f0] inline-block px-2 py-1 rounded-lg">
              {errors.endPoint}
            </p>
          )}
        </div>

        {/* Campo: Route */}
        <div>
          <label className="block font-bold text-gray-700">
            Route 
          </label>
          <input
            type="text"
            name="route"
            value={trip.route}
            onChange={handleChange}
            placeholder="Example: Via Chía - Puente del Común"
            className={`w-full p-3 mt-2 border rounded-xl bg-[#f5f0f0] placeholder-gray-400 focus:outline-none ${
              errors.route ? "border-orange-400" : "border-gray-200"
            }`}
          />
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
