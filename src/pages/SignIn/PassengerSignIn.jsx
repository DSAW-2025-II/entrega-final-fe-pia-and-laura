import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PassengerSignIn() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Usa siempre import.meta.env en Vite, no process.env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    idUniversidad: "",
    email: "",
    celular: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const validateAndSetImage = (file) => {
    setImageError("");
    if (!file) {
      setSelectedFile(null);
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setImageError("Formato no soportado. Usa JPG o PNG. *");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Archivo muy grande. Máx 2MB. *");
      return;
    }

    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleFileChange = (e) => validateAndSetImage(e.target.files?.[0]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const idRegex = /^\d{5}$/; // ✅ tu backend acepta cualquier ID, no solo 0000XXXXXX
    const emailRegex = /^[A-Za-z0-9._%+-]+@unisabana\.edu\.co$/;
    const phoneRegex = /^3\d{9}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!values.nombre.trim()) newErrors.nombre = "Required field *";
    else if (!nameRegex.test(values.nombre)) newErrors.nombre = "Only letters allowed *";

    if (!values.apellido.trim()) newErrors.apellido = "Required field *";
    else if (!nameRegex.test(values.apellido)) newErrors.apellido = "Only letters allowed *";

    if (!values.idUniversidad.trim()) newErrors.idUniversidad = "Required field *";
    else if (!idRegex.test(values.idUniversidad)) newErrors.idUniversidad = "Invalid ID format *";

    if (!values.email.trim()) newErrors.email = "Required field *";
    else if (!emailRegex.test(values.email))
      newErrors.email = "Must end with @unisabana.edu.co *";

    if (!values.celular.trim()) newErrors.celular = "Required field *";
    else if (!phoneRegex.test(values.celular))
      newErrors.celular = "Must start with 3 and have 10 digits *";

    if (!values.password.trim()) newErrors.password = "Required field *";
    else if (!passwordRegex.test(values.password))
      newErrors.password = "8 chars, 1 uppercase, 1 number, 1 symbol *";

    return newErrors;
  };

  const handleSignUp = async () => {
    setSubmitted(true);
    setServerError("");
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || imageError) return;

    setLoading(true);

    try {
      let res;
      if (selectedFile) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => formData.append(key, value));
        formData.append("role", "passenger");
        formData.append("avatar", selectedFile);

        res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, role: "passenger" }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Error al registrar usuario.");
      } else {
        // ✅ Registro exitoso
        localStorage.setItem("userRole", "passenger");
        localStorage.setItem("isAuthenticated", "true");
        navigate("/passengerHome");
      }
    } catch (err) {
      console.error("Error al conectar:", err);
      setServerError("⚠️ Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center relative overflow-hidden">
      {/* Flecha de regreso */}
      <button
        className="absolute top-8 left-8 hover:opacity-70 transition"
        aria-label="Back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-8 h-8 text-black" />
      </button>

      <div className="flex flex-col md:flex-row items-center justify-center gap-20 w-full max-w-7xl px-8 md:px-20">
        {/* FORMULARIO */}
        <div className="flex flex-col gap-6 w-full max-w-sm">
          {[
            { key: "nombre", label: "Name", placeholder: "Enter your name" },
            { key: "apellido", label: "Last Name", placeholder: "Enter your last name" },
            { key: "idUniversidad", label: "ID", placeholder: "Enter your institutional ID" },
            { key: "email", label: "Email", placeholder: "Enter your institutional email" },
            { key: "celular", label: "Phone number", placeholder: "Enter your number" },
            { key: "password", label: "Password", placeholder: "Enter your password", type: "password" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-black font-semibold text-lg">{field.label}</label>
                {submitted && errors[field.key] && (
                  <span className="text-[#F59739] font-semibold text-sm">
                    {errors[field.key]}
                  </span>
                )}
              </div>

              <input
                type={field.type || "text"}
                value={values[field.key]}
                onChange={handleChange(field.key)}
                placeholder={field.placeholder}
                className={`bg-[#F4EFEF] rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 transition
                  ${submitted && errors[field.key] ? "ring-0 border-2 border-[#F59739]" : "focus:ring-gray-700"}`}
              />
            </div>
          ))}

          {serverError && (
            <div className="text-[#F59739] font-semibold text-sm mt-2">{serverError}</div>
          )}
        </div>

        {/* SECCIÓN DERECHA */}
        <div className="relative flex flex-col items-center text-center w-full max-w-lg">
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="absolute -top-10 right-0 bg-[#1F2937] text-white px-10 py-3 rounded-xl text-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <h1 className="text-[#1F2937] text-start text-6xl font-bold leading-tight mt-10 mb-8 ml-0 self-start">
            New <br /> Passenger
          </h1>

          <div
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}
            className={`bg-[#5E626B] w-[300px] h-[300px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition overflow-hidden
              ${submitted && imageError ? "ring-2 ring-[#F59739]" : ""}`}
          >
            {preview ? (
              <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="text-white w-36 h-36 opacity-90" />
            )}
          </div>

          <p className="text-gray-400 text-lg mt-6">Upload your photo (Optional)</p>

          {submitted && imageError && (
            <div className="mt-2 text-[#F59739] font-semibold text-sm">{imageError}</div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
