import { useState, useEffect } from "react";
import { ArrowLeft, Star, Home, Activity, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CarModel() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [car, setCar] = useState({
    licensePlate: "",
    make: "",
    model: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // ✅ para mostrar mensajes
  const [messageType, setMessageType] = useState(""); // "error" o "success"

  // 🔹 Obtener info del carro del usuario (driver)
useEffect(() => {
  const fetchCar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const res = await fetch(`${API_URL}/car/myCar`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error fetching car data");
      const data = await res.json();

      const carData = data.car || {};

      setCar({
        licensePlate: carData.licensePlate || "",
        make: carData.make || "",
        model: carData.model || "",
        capacity: carData.capacity?.toString() || "",
        carPhotoUrl: carData.carPhotoUrl || "",
      });
    } catch (err) {
      console.error("❌ Error al obtener datos del carro:", err);
    }
  };

  fetchCar();
}, [API_URL]);


  // 🔹 Manejar cambios en los campos
  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  // 🔹 Guardar cambios del carro
  const handleSave = async () => {
  try {
    setLoading(true);
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("licensePlate", car.licensePlate);
    formData.append("make", car.make);
    formData.append("model", car.model);
    formData.append("capacity", car.capacity);

    // 📸 Si el usuario selecciona nuevas imágenes, agrégalas al FormData
    if (car.newCarPhoto) formData.append("carPhoto", car.newCarPhoto);
    if (car.newSoat) formData.append("soat", car.newSoat);

    const res = await fetch(`${API_URL}/car/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Error updating car");
      setMessageType("error");
    } else {
      setMessage("✅ Car information updated successfully!");
      setMessageType("success");

      // 🧩 Actualiza el estado local del carro con la nueva info del backend
      setCar({
        ...car,
        licensePlate: data.car.licensePlate,
        make: data.car.make,
        model: data.car.model,
        capacity: data.car.capacity?.toString(),
        carPhotoUrl: data.car.carPhotoUrl,
        soatUrl: data.car.soatUrl,
        newCarPhoto: null,
        newSoat: null,
      });
    }
    } catch (err) {
    console.error(err);
    setMessage("Error updating car data");
    setMessageType("error");
    } finally {
    setLoading(false);
    setTimeout(() => setMessage(null), 4000);
    }
  };


  return (
    <div className="min-h-screen bg-white rounded-2xl flex flex-col items-center relative p-8">
      {/* Botón atrás */}
      <button className="absolute top-6 left-6" onClick={() => navigate(-1)}>
        <ArrowLeft size={32} className="text-black" />
      </button>

      {/* Barra superior */}
      <div className="absolute top-6 right-8 flex items-center gap-12 text-gray-600 text-lg">
        <div className="flex flex-col items-center">
          <Home size={28} className="text-gray-400" />
          <span>Home</span>
        </div>
        <div className="flex flex-col items-center">
          <Activity size={28} className="text-gray-400" />
          <span>Activity</span>
        </div>
        <div className="flex flex-col items-center">
          <User size={28} className="text-black" />
          <span className="text-black font-medium">Account</span>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col items-center mt-28">
        <div className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center mb-6 bg-gray-200">
          {car.carPhotoUrl ? (
            <img
              src={car.carPhotoUrl}
              alt="Car photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={96} className="text-gray-400" />
          )}
        </div>

        <div className="flex flex-col items-center mb-6">
          <label className="text-gray-500 text-xl mb-2 font-semibold">
            Change Car Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCar({ ...car, newCarPhoto: e.target.files[0] })}
            className="text-gray-600"
          />

          <label className="text-gray-500 text-xl mt-4 mb-2 font-semibold">
            Change SOAT
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setCar({ ...car, newSoat: e.target.files[0] })}
            className="text-gray-600"
          />
        </div>


        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-6xl font-bold text-gray-800">
            {car.model || "Your Car"}
          </h1>
          <div className="flex items-center bg-gray-200 rounded-xl px-4 py-2">
            <Star fill="black" className="text-black mr-2" />
            <span className="text-2xl font-medium text-black">Frequent</span>
          </div>
        </div>


        {/* Mensaje dinámico */}
        {message && (
          <p
            className={`mb-6 text-2xl font-semibold ${
              messageType === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Formulario */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              License Plate
            </label>
            <input
              type="text"
              name="licensePlate"
              value={car.licensePlate}
              onChange={handleChange}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              Make
            </label>
            <select
              name="make"
              value={car.make}
              onChange={handleChange}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            >
              <option value="">Select your car make</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              Vehicle capacity
            </label>
            <select
              name="capacity"
              value={car.capacity}
              onChange={handleChange}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            >
              <option value="">Select vehicle capacity</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500 text-2xl mb-2 font-semibold">
              Model
            </label>
            <select
              name="model"
              value={car.model}
              onChange={handleChange}
              className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            >
              <option value="">Select your car model</option>
              <option value="Corolla">Corolla</option>
              <option value="Civic">Civic</option>
              <option value="Focus">Focus</option>
            </select>
          </div>
        </div>

        {/* Botón Done */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-3xl px-20 py-3 rounded-xl shadow-md"
        >
          {loading ? "Saving..." : "Done"}
        </button>
      </div>
    </div>
  );
}
