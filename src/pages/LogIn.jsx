import React, { useState } from "react";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key) => (e) => {
    setValues({ ...values, [key]: e.target.value });
    setErrors({ ...errors, [key]: "" });
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.email.trim()) newErrors.email = "Required field *";
    if (!values.password.trim()) newErrors.password = "Required field *";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogIn = async () => {
    setSubmitted(true);
    setMessage({ type: "", text: "" });

    if (!validateForm()) return;

    try {
      setLoading(true);

      // ✅ Usa la variable correcta
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage({ type: "success", text: "Login successful!" });

        // ✅ Redirige según el rol
        setTimeout(() => {
          if (data.user.role === "driver") {
            navigate("/driverHome");
          } else {
            navigate("/passengerHome");
          }
        }, 800);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Incorrect email or password.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: "error", text: "Server connection error." });
    } finally {
      setLoading(false);
    }
  };

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
                <span className="text-green-600 text-sm font-normal ml-1">
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
                submitted && errors.email ? "ring-green-400" : "ring-gray-300"
              }`}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-semibold">
              Password{" "}
              {submitted && errors.password && (
                <span className="text-green-600 text-sm font-normal ml-1">
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
                submitted && errors.password ? "ring-green-400" : "ring-gray-300"
              }`}
            />
          </div>

          {/* Feedback Message */}
          {message.text && (
            <div
              className={`mt-2 text-lg font-semibold flex items-center gap-2 px-4 py-2 rounded-xl ${
                message.type === "success"
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {message.type === "success" ? <CheckCircle /> : <XCircle />}
              {message.text}
            </div>
          )}

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
