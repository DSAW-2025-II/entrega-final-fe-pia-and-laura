import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";


export default function PassengerSignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [values, setValues] = useState({
    name: "",
    lastName: "",
    universityId: "",
    email: "",
    phone: "",
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
      setImageError("Not supported. Use JPG or PNG. *");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("File too large. Max 2MB. *");
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
    const idRegex = /^0{4}\d{6}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@unisabana\.edu\.co$/;
    const phoneRegex = /^3\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!values.name.trim()) newErrors.name = "Required field *";
    else if (!nameRegex.test(values.name))
      newErrors.name = "Only letters allowed *";

    if (!values.lastName.trim()) newErrors.lastName = "Required field *";
    else if (!nameRegex.test(values.lastName))
      newErrors.lastName = "Only letters allowed *";

    if (!values.universityId.trim())
      newErrors.universityId = "Required field *";
    else if (!idRegex.test(values.universityId))
      newErrors.universityId = "Invalid ID format *";

    if (!values.email.trim()) newErrors.email = "Required field *";
    else if (!emailRegex.test(values.email))
      newErrors.email = "Must end with @unisabana.edu.co *";

    if (!values.phone.trim()) newErrors.phone = "Required field *";
    else if (!phoneRegex.test(values.phone))
      newErrors.phone = "Must start with 3 and have 10 digits *";

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
        Object.entries(values).forEach(([key, value]) =>
          formData.append(key, value)
        );
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
  // ✅ Actualizar AuthContext de inmediato
  login(
    {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    },
    data.token
  );

  // ✅ Redirigir según el rol
  if (data.user.role === "passenger") {
    navigate("/passengerHome");
  } else if (data.user.role === "driver") {
    navigate("/driverSignIn");
  }
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
        className="absolute top-6 left-6 hover:opacity-70 transition"
        aria-label="Back"
        onClick={() => navigate("/start")}
      >
        <ArrowLeft className="w-7 h-7 text-black" />
      </button>

      <div
        className="flex flex-col-reverse md:flex-row items-center justify-center 
        gap-10 md:gap-20 w-full max-w-7xl px-6 md:px-20"
      >
        {/* FORMULARIO */}
        <div className="flex flex-col gap-5 w-full max-w-sm">
          {[
            { key: "name", label: "Name", placeholder: "Enter your name" },
            {
              key: "lastName",
              label: "Last Name",
              placeholder: "Enter your last name",
            },
            {
              key: "universityId",
              label: "ID",
              placeholder: "Enter your institutional ID",
            },
            {
              key: "email",
              label: "Email",
              placeholder: "Enter your institutional email",
            },
            {
              key: "phone",
              label: "Phone number",
              placeholder: "Enter your number",
            },
            {
              key: "password",
              label: "Password",
              placeholder: "Enter your password",
              type: "password",
            },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-black font-semibold text-base">
                  {field.label}
                </label>
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
                  ${
                    submitted && errors[field.key]
                      ? "ring-0 border-2 border-[#F59739]"
                      : "focus:ring-gray-700"
                  }`}
              />
            </div>
          ))}

          {serverError && (
            <div className="text-[#F59739] font-semibold text-sm mt-2">
              {serverError}
            </div>
          )}
        </div>

        {/* SECCIÓN DERECHA */}
        <div className="relative flex flex-col items-center text-center w-full max-w-lg">
          <h1 className="text-[#1F2937] text-3xl md:text-6xl font-bold leading-tight mt-2 mb-6 md:mb-8 self-center md:self-start">
            New <br className="hidden md:block" /> Passenger
          </h1>

          {/* Avatar + texto opcional */}
          <div className="flex flex-row md:flex-col items-center justify-center gap-4 md:gap-6">
            <div
              onClick={handleAvatarClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}
              className={`bg-[#5E626B] w-24 h-24 md:w-[300px] md:h-[300px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition overflow-hidden
                ${submitted && imageError ? "ring-2 ring-[#F59739]" : ""}`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-white w-12 h-12 md:w-36 md:h-36 opacity-90" />
              )}
            </div>

            <p className="text-gray-400 text-sm md:text-lg">
              Upload your photo <br className="hidden md:block" />
              <span className="text-gray-400">(Optional)</span>
            </p>
          </div>

          {submitted && imageError && (
            <div className="mt-2 text-[#F59739] font-semibold text-sm">
              {imageError}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Botón Sign Up */}
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="mt-8 md:mt-0 md:absolute md:-top-10 md:right-0 bg-[#1F2937] text-white px-8 md:px-10 py-3 rounded-xl text-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50 w-full md:w-auto"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
