import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dotenv from "dotenv";

dotenv.config();

export default function DriverSignIn() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const BACKEND_URL = process.env.BACKEND_URL;

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir según el rol del usuario
      if (data.user.role === "driver") {
        navigate("/driverHome");
      } else if (data.user.role === "passenger") {
        navigate("/passengerHome");
      } else {
        navigate("/start");
      }
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm bg-gray-50 p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Driver Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 outline-none"
        />

        {error && <p className="text-[#F59739] text-sm font-semibold">{error}</p>}

        <button
          type="submit"
          className="bg-[#1F2937] text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
