import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Home, Activity, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CarModel() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null); // 🔹 Para previsualizar
  const [car, setCar] = useState({
    licensePlate: "",
    make: "",
    model: "",
    capacity: "",
    carPhotoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

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

        setCar({
          licensePlate: data.car.licensePlate || "",
          make: data.car.make || "",
          model: data.car.model || "",
          capacity: data.car.capacity?.toString() || "",
          carPhotoUrl: data.car.carPhotoUrl || "",
        });
      } catch (err) {
        console.error("❌ Error al obtener datos del carro:", err);
      }
    };

    fetchCar();
  }, [API_URL]);

  // 🔹 Cuando el usuario selecciona una nueva foto
  const handleCarPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Muestra la previsualización temporalmente
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const formData = new FormData();
      formData.append("file", file);

      // 📤 Subir primero la imagen a Cloudinary (ruta backend /upload)
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "Error uploading image");

      const newImageUrl = uploadData.url;

      // 🔁 Actualizar la foto del carro en la base de datos
      const updateRes = await fetch(`${API_URL}/car/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carPhotoUrl: newImageUrl }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Error updating car photo");

      setCar((prev) => ({ ...prev, carPhotoUrl: newImageUrl }));
      setPreviewImage(null);
      setMessage("✅ Car photo updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("Error updating car photo");
      setMessageType("error");
    } finally {
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // 🔹 Abrir selector de archivos al hacer hover o clic
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // 🔹 Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setCar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔹 Guardar cambios del carro (información general)
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

    // 📸 Si el usuario cambió la foto, también la enviamos
    if (car.newCarPhoto) formData.append("carPhoto", car.newCarPhoto);

    const res = await fetch(`${API_URL}/car/update`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Error updating car");
      setMessageType("error");
    } else {
      setMessage("✅ Car information updated successfully!");
      setMessageType("success");

      // 🧩 Actualiza el estado local del carro con la nueva info
      setCar((prev) => ({
        ...prev,
        licensePlate: data.car.licensePlate,
        make: data.car.make,
        model: data.car.model,
        capacity: data.car.capacity?.toString(),
        carPhotoUrl: data.car.carPhotoUrl,
        newCarPhoto: null,
      }));
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
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
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
    <div className="flex flex-col items-center mt-24 w-full max-w-5xl">
      {/* Imagen + Nombre + Frequent */}
      <div className="flex flex-row items-center justify-center gap-8 mb-10 flex-wrap">
        {/* Imagen del carro con hover para cambiar */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-md group cursor-pointer" onClick={handlePhotoClick}>
          {/* Imagen o placeholder */}
          {car.carPhotoUrl ? (
            <img
              src={previewImage || car.carPhotoUrl}
              alt="Car"
              className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-50"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center transition-all duration-300 group-hover:opacity-50">
              <User size={96} className="text-white" />
            </div>
          )}

          {/* Overlay de cambio */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-lg font-semibold">Change Photo</span>
          </div>

          {/* Input oculto */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleCarPhotoChange}
          />
        </div>


        {/* Nombre del carro */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-4">
            <h1 className="text-6xl font-bold text-gray-800 text-center">
              {car.model || "Car Model"}
            </h1>
          </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12 max-w-4xl w-full">
        <div className="flex flex-col">
          <label className=" text-gray-500 text-2xl mb-2 font-semibold">
            License Plate
          </label>
          <input
            type="text"
            name="licensePlate"
            value={car.licensePlate}
            onChange={handleChange}
            className="bg-gray-200 rounded-xl text-2xl px-4 py-3 text-gray-900 font-semibold focus:outline-none"
            disabled
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
            <option value="RAV4">RAV4</option>
            <option value="Focus">Focus</option>
          </select>
        </div>
      </div>
      
      {/* Botón Done */}
      <div className="w-full max-w-4xl flex justify-center sm:justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-3xl px-20 py-3 rounded-xl shadow-md mt-4 sm:mt-0"
        >
          {loading ? "Saving..." : "Done"}
        </button>
      </div>

    </div>
  </div>
);
}