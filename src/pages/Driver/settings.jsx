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

  // 🔹 Manejar cambio de foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFormData({ ...formData, profileImage: file });
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

  // 🔹 Guardar cambios
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found");
        return;
      }

      // Validar correo único
      if (formData.email && formData.email !== user.email) {
        const valid = await validateEmail(formData.email);
        if (!valid) {
          setLoading(false);
          return;
        }
      }

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      const res = await fetch(`${API_URL}/user/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Error updating user");
      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-20">Loading...</div>;

  const isDriver = user.role === "driver";
  const handleCarSettings = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found");
      return;
    }

    // 🔸 Validar que el email no esté repetido (solo si cambió)
    if (formData.email && formData.email !== user.email) {
      const valid = await validateEmail(formData.email);
      if (!valid) {
        setLoading(false);
        return;
      }
    }

    // 🔸 Crear FormData con los datos actualizados
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    // 🔸 Guardar los cambios
    const res = await fetch(`${API_URL}/user/${user._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!res.ok) throw new Error("Error updating user");
    const updatedUser = await res.json();
    setUser(updatedUser);

    // ✅ Mostrar mensaje y redirigir
    alert("Profile updated successfully! Redirecting to Car Settings...");
    navigate("/carSettings");
  } catch (err) {
    console.error(err);
    alert("Error updating profile");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen overflow-y-auto md:overflow-hidden bg-white rounded-2xl flex flex-col p-6 md:p-12 relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-black hover:text-gray-700"
      >
        <ArrowLeft size={28} />
      </button>

      {/* 🔹 Avatar + Nombre */}
      <div className="flex flex-col md:flex-row items-center gap-8 mt-20">
        <div
          className="relative w-40 h-40 md:w-72 md:h-72 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
          onClick={() => fileInputRef.current.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : user.profileImage ? (
            <img
              src={user.profileImage}
              alt="user"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl font-bold text-gray-700">
              {user.name?.[0]?.toUpperCase()}
            </span>
          )}
          <div className="absolute bottom-2 right-2 bg-[#F59739] p-2 rounded-full">
            <Camera size={22} className="text-white" />
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

      {/* 🔹 Formulario */}
      <div className="grid md:grid-cols-2 gap-8 mt-16">
        <div>
          <label className="block text-gray-500 text-xl font-semibold mb-2">
            ID
          </label>
          <input
            name="idNumber"
            value={formData.idNumber || ""}
            onChange={handleChange}
            className="w-full bg-[#EEEEEE] text-black rounded-2xl px-4 py-3 text-lg font-semibold outline-none"
          />
        </div>

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
      </div>

      {/* 🔹 Botón Guardar */}
      <div className="flex items-center justify-end gap-3 mt-12">
        <button
            onClick={isDriver ? handleCarSettings : handleSave}
            className={`${
            isDriver ? "bg-emerald-500" : "bg-amber-500"
            } text-white text-2xl font-bold px-12 py-3 rounded-xl hover:opacity-90`}
        >
            {isDriver ? "Car settings" : "Done"}
        </button>
      </div>
    </div>
  );
}
