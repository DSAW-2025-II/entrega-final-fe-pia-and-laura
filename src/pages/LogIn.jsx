import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "@/context/AuthContext.jsx";
import { loginUser } from "../services/api.js";

export default function LogIn() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [attempts, setAttempts] = useState(() => {
  return Number(localStorage.getItem("loginAttempts") || 0);
  });
  const [lockUntil, setLockUntil] = useState(() => {
  return Number(localStorage.getItem("lockUntil") || 0);
  });

  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    // si está logueado, enviarlo a su home
    if (user.role === "driver") navigate("/driverHome");
    else navigate("/passengerHome");
  }
}, []);
  // 🔹 Maneja cambios en los inputs
  const handleChange = (key) => (e) => {
    setValues({ ...values, [key]: e.target.value });
    setErrors({ ...errors, [key]: "" });
    setMessage({ type: "", text: "" });
  };

  // 🔹 Validaciones del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = "Required field *";
    if (!values.password.trim()) newErrors.password = "Required field *";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 🔹 Función principal de login
  const handleLogIn = async () => {
    setSubmitted(true);
    setMessage({ type: "", text: "" });
    // ⛔ Bloqueo de intentos fallidos
    const now = Date.now();
    if (lockUntil && now < lockUntil) {
      const remaining = Math.ceil((lockUntil - now) / 60000);
      setMessage({
        type: "error",
        text: `Too many failed attempts. Try again in ${remaining} minutes.`,
      });
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { ok, data } = await loginUser(values);

    if (!ok) {
      throw new Error(data.message || "Incorrect email or password.");
    }
    
    // ✅ Guarda datos en el contexto global
    
    login(data.user, data.token);
    if (data.token) {
      localStorage.setItem("token", data.token);
      // ✅ Guarda token y usuario en localStorage para futuras peticiones
      localStorage.setItem("user", JSON.stringify(data.user)); // <--- esta línea nueva
    }
    
    setMessage({ type: "success", text: "Login successful!" });
    // 🔄 Resetear intentos y bloqueo después de un login exitoso
    setAttempts(0);
    setLockUntil(0);
    localStorage.setItem("loginAttempts", 0);
    localStorage.setItem("lockUntil", 0);

    // ✅ Redirige según el rol
    setTimeout(() => {
      if (data.user.role === "driver") navigate("/driverHome");
      else navigate("/passengerHome");
    }, 800);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        type: "error",
        text: error.message || "Server connection error.",
      });

      // ❗ Evitar sumar intentos si ya está bloqueado
      if (lockUntil && Date.now() < lockUntil) {
        return;
      }

      // 🔥 Sumar intento fallido
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts);

      // ⛔ Si llegó a 5 intentos → bloquear 15 minutos
      if (newAttempts >= 5) {
        const lockTime = Date.now() + 15 * 60 * 1000; // 15 min
        setLockUntil(lockTime);
        localStorage.setItem("lockUntil", lockTime);
        setMessage({
          type: "error",
          text: "Too many failed attempts. Locked for 15 minutes.",
        });
        return;
      }
    }
  }
  return (
    <div className="h-screen w-full bg-[#1F2937] flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-28 px-8 w-full max-w-6xl">
        {/* LOGO */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Logo Wheels Unisabana"
            className="w-72 md:w-96 lg:w-[420px] object-contain"
          />
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg w-[360px] sm:w-[400px] p-10 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Log In
          </h2>

          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-semibold">
              Email{" "}
              {submitted && errors.email && (
                <span className="text-[#F59739] text-sm font-normal ml-1">
                  {errors.email}
                </span>
              )}
            </label>
            <input
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              placeholder="Enter your email"
              className={`w-full rounded-xl px-4 py-3 text-gray-800 bg-[#EEEEEE] focus:outline-none focus:ring-2 transition ${
                submitted && errors.email ? "ring-[#F59739]" : "ring-gray-300"
              }`}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-semibold">
              Password{" "}
              {submitted && errors.password && (
                <span className="text-[#F59739] text-sm font-normal ml-1">
                  {errors.password}
                </span>
              )}
            </label>
            <input
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              placeholder="Enter your password"
              className={`w-full rounded-xl px-4 py-3 text-gray-800 bg-[#EEEEEE] focus:outline-none focus:ring-2 transition ${
                submitted && errors.password ? "ring-[#F59739]" : "ring-gray-300"
              }`}
            />
          </div>

          {/* Feedback Message */}
          {message.text && (
            <div
              className={`mt-2 text-lg font-semibold flex items-center gap-2 px-4 py-2 rounded-xl ${
                message.type === "success"
                  ? "text-green-600 bg-green-100"
                  : "text-[#F59739] bg-orange-100"
              }`}
            >
              {message.type === "success" ? <CheckCircle /> : <XCircle />}
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleLogIn}
            disabled={loading}
            className="mt-4 flex items-center justify-center gap-2 bg-gray-800 text-white font-bold text-lg py-3 rounded-xl hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : <>Log In <ArrowRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
