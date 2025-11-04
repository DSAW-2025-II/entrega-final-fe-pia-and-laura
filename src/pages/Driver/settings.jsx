import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // 🔹 Obtener usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found");

        const res = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error fetching user`);
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [API_URL]);

  // 🔹 Manejar cambios en inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") setEmailError("");
  };

  // 🔹 Subir imagen al backend (no directamente a Cloudinary)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostrar preview local
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found");
        return;
      }

      const formDataFile = new FormData();
      formDataFile.append("file", file);

      // Enviar archivo al backend (el backend se encarga de Cloudinary)
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataFile,
      });

      if (!uploadRes.ok) throw new Error("Error uploading image");

      const uploadData = await uploadRes.json();

      // Guardar URL devuelta por el backend
      setFormData((prev) => ({ ...prev, profileImage: uploadData.url }));

      alert("Photo uploaded successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Validar correo existente antes de guardar
  const validateEmail = async (email) => {
    try {
      const res = await fetch(`${API_URL}/user/check-email?email=${email}`);
      if (res.status === 409) {
        setEmailError("This email is already registered.");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating email", err);
      return false;
    }
  };

  // 🔹 Validar formulario antes de guardar
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const idRegex = /^0{4}\d{6}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@unisabana\.edu\.co$/;
    const phoneRegex = /^3\d{9}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!formData.name?.trim()) newErrors.name = "Required field *";
    else if (!nameRegex.test(formData.name))
      newErrors.name = "Only letters allowed *";

    if (!formData.lastName?.trim()) newErrors.lastName = "Required field *";
    else if (!nameRegex.test(formData.lastName))
      newErrors.lastName = "Only letters allowed *";

    if (!formData.universityId?.trim())
      newErrors.universityId = "Required field *";
    else if (!idRegex.test(formData.universityId))
      newErrors.universityId = "Invalid ID format *";

    if (!formData.email?.trim()) newErrors.email = "Required field *";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Must end with @unisabana.edu.co *";

    if (!formData.phone?.trim()) newErrors.phone = "Required field *";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Must start with 3 and have 10 digits *";

    if (formData.password && !passwordRegex.test(formData.password))
      newErrors.password = "8 chars, 1 uppercase, 1 number, 1 symbol *";

    return newErrors;
  };

  // 🔹 Guardar cambios generales
  const handleSave = async () => {
    setLoading(true);
    try {
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setLoading(false);
        alert("Please correct the highlighted fields.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return alert("No token found");

      // Validar email si cambió
      if (formData.email && formData.email !== user.email) {
        const valid = await validateEmail(formData.email);
        if (!valid) {
          setLoading(false);
          return;
        }
      }

const form = new FormData();

Object.keys(formData).forEach((key) => {
  if (key === "car" && formData.car && typeof formData.car === "object") {
    // 👇 Solo enviamos el _id del carro si existe
    form.append("car", formData.car._id || "");
  } else {
    form.append(key, formData[key]);
  }
});


      const res = await fetch(`${API_URL}/user/${user._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Error updating user");
      const updatedUser = await res.json();
      setUser(updatedUser.user);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Guardar y redirigir a Car Settings (para conductores)
  const handleCarSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found");
        return;
      }

      if (formData.email && formData.email !== user.email) {
        const valid = await validateEmail(formData.email);
        if (!valid) {
          setLoading(false);
          return;
        }
      }

          const form = new FormData();
          Object.keys(formData).forEach((key) => {
            if (key === "car" && formData.car && typeof formData.car === "object") {
              // 👇 Solo enviamos el _id del carro si existe
              form.append("car", formData.car._id || "");
            } else {
              form.append(key, formData[key]);
            }
          });

      const res = await fetch(`${API_URL}/user/${user._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error("Error updating user");
      const updatedUser = await res.json();
      setUser(updatedUser.user);

      alert("Profile updated successfully! Redirecting to Car Settings...");
      navigate("/carSettings");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Definir si el usuario es conductor
  const isDriver = user?.role === "driver" || user?.isDriver === true;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando configuración...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white rounded-2xl flex flex-col p-6 md:p-10 relative pb-20">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-black hover:text-gray-700"
      >
        <ArrowLeft size={28} />
      </button>

      {/* 🔹 Avatar + Nombre */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-8">
        <div
          className="relative w-28 h-28 md:w-56 md:h-56 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer group transition-all duration-200"
          onClick={() => fileInputRef.current.click()}
        >
          {preview ? (
  <img src={preview} alt="preview" className="w-full h-full object-cover" />
) : user?.profileImage ? (
  <img
    src={user.profileImage}
    alt="Profile"
    className="w-full h-full object-cover"
  />
) : (
  <span className="text-6xl font-bold text-gray-700">
    {user?.name?.[0]?.toUpperCase() || "?"}
  </span>
)}


          {/* 🔸 Icono cámara hover */}
          <div className="absolute bottom-2 right-2 bg-[#F59739] p-2 rounded-full transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-6">
            <Camera size={22} className="text-white" />
          </div>

          {/* 🔸 Overlay al pasar el mouse */}
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <span className="text-white font-semibold text-lg">Change photo</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1F2937]">
            {user.name} {user.lastName}
          </h1>

          <div className="bg-[#F59739] text-white text-2xl md:text-3xl font-bold rounded-2xl px-12 py-2 text-center w-full md:w-auto">
            {isDriver ? "Driver" : "Passenger"}
          </div>
        </div>
      </div>

{/* 🔹 Formulario de edición */}
<div className="grid md:grid-cols-2 gap-6 mt-8">
  {/* 🟠 Nombre */}
  <div>
    <label className="block text-gray-500 text-xl font-semibold mb-2">
      Name
    </label>
    <input
      name="name"
      value={formData.name || ""}
      onChange={handleChange}
      className="w-full bg-[#EEEEEE] text-black rounded-2xl px-4 py-3 text-lg font-semibold outline-none"
    />
  </div>

  {/* 🟠 Apellido */}
  <div>
    <label className="block text-gray-500 text-xl font-semibold mb-2">
      Last name
    </label>
    <input
      name="lastName"
      value={formData.lastName || ""}
      onChange={handleChange}
      className="w-full bg-[#EEEEEE] text-black rounded-2xl px-4 py-3 text-lg font-semibold outline-none"
    />
  </div>

  {/* 🟠 ID Universitario */}
  <div>
    <label className="block text-gray-500 text-xl font-semibold mb-2">
      ID
    </label>
    <input
      name="universityId"
      value={formData.universityId || ""}
      onChange={handleChange}
      className="w-full bg-[#EEEEEE] text-black rounded-2xl px-4 py-3 text-lg font-semibold outline-none"
      disabled // 🔹 Deshabilitado para que no se modifique manualmente
    />
  </div>

  {/* 🟠 Email */}
  <div>
    <label className="block text-gray-500 text-xl font-semibold mb-2">
      Email
    </label>
    <input
      name="email"
      value={formData.email || ""}
      onChange={handleChange}
      className={`w-full bg-[#EEEEEE] text-black rounded-2xl px-4 py-3 text-lg font-semibold outline-none ${
        emailError ? "border border-[#F59739]" : ""
      }`}
    />
    {emailError && (
      <p className="text-[#F59739] mt-1 font-medium">{emailError}</p>
    )}
  </div>

  {/* 🟠 Teléfono */}
  <div>
    <label className="block text-gray-500 text-xl font-semibold mb-2">
      Phone number
    </label>
    <input
      name="phone"
      value={formData.phone || ""}
      onChange={handleChange}
      className="w-full bg-[#EEEEEE] text-black rounded-2xl px-4 py-3 text-lg font-semibold outline-none"
    />
  </div>

  {/* 🟠 Contraseña */}
  <div>
    <label className="block text-gray-500 text-xl font-semibold mb-2">
      Change password
    </label>
    <input
      type="password"
      name="password"
      value={formData.password || ""}
      onChange={handleChange}
      placeholder="New password"
      className="w-full bg-[#EEEEEE] text-black rounded-2xl px-4 py-3 text-lg font-semibold outline-none"
    />
  </div>
</div>

{/* 🔸 Botón debajo del formulario */}
<div className="flex justify-center mt-10">
  <button
    onClick={isDriver ? handleCarSettings : handleSave}
    disabled={loading}
    className={`${
      isDriver ? "bg-emerald-500" : "bg-amber-500"
    } text-white text-2xl font-bold px-12 py-3 rounded-xl hover:opacity-90 transition-all duration-200 ${
      loading ? "opacity-70 cursor-not-allowed" : ""
    }`}
  >
    {loading ? "Saving..." : isDriver ? "Car settings" : "Done"}
  </button>
</div>

    </div>);
}
