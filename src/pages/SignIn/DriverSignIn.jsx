import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DriverSignIn() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const REGISTER_BACKEND_URL = process.env.REGISTER_BACKEND_URL;
  const [values, setValues] = useState({
    name: "",
    lastName: "",
    id: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  // Liberar URL temporal cuando cambie o se desmonte
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const validateAndSetImage = (file) => {
    setImageError("");
    if (!file) {
      // limpiar
      setSelectedFile(null);
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setImageError("Formato no soportado. Usa JPG o PNG. *");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Archivo muy grande. Máx 2MB. *");
      setSelectedFile(null);
      return;
    }

    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    const imageURL = URL.createObjectURL(file);
    setPreview(imageURL);
    setSelectedFile(file);
    setImageError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetImage(file);
  };

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
  };

  const validateFields = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const idRegex = /^0{4}\d{6}$/; 
    const emailRegex = /^[A-Za-z0-9._%+-]+@unisabana\.edu\.co$/;
    const phoneRegex = /^3\d{9}$/; 
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{8,}$/;

    // Nombre
    if (!values.name.trim()) {
      newErrors.name = "Required field *";
    } else if (!nameRegex.test(values.name.trim())) {
      newErrors.name = "Only letters allowed *";
    }

    // Apellido
    if (!values.lastName.trim()) {
      newErrors.lastName = "Required field *";
    } else if (!nameRegex.test(values.lastName.trim())) {
      newErrors.lastName = "Only letters allowed *";
    }

    // ID institucional
    if (!values.id.trim()) {
      newErrors.id = "Required field *";
    } else if (!idRegex.test(values.id.trim())) {
      newErrors.id = "Must be 10 digits, starting with 0000 *";
    }

    // Email
    if (!values.email.trim()) {
      newErrors.email = "Required field *";
    } else if (!emailRegex.test(values.email.trim())) {
      newErrors.email = "Must end with @unisabana.edu.co *";
    }

    // Teléfono
    if (!values.phone.trim()) {
      newErrors.phone = "Required field *";
    } else if (!phoneRegex.test(values.phone.trim())) {
      newErrors.phone = "Must start with 3 and have 10 digits *";
    }

    // Contraseña
    if (!values.password.trim()) {
      newErrors.password = "Required field *";
    } else if (!passwordRegex.test(values.password)) {
      newErrors.password = "8 chars, 1 uppercase, 1 number, 1 symbol *";
    }

    return newErrors;
  };

  const handleAddCar = async () => {
    setSubmitted(true);
    setServerError("");
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || imageError) {
      return;
    }

    try {
      // Si hay imagen, usar FormData para incluir archivo
      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("lastName", values.lastName);
        formData.append("idUniversidad", values.id);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("password", values.password);
        formData.append("role", "driver");
        formData.append("avatar", selectedFile);

        res = await fetch(REGISTER_BACKEND_URL, {
          method: "POST",
          body: formData,
        });
      } else {
        // Sin imagen: JSON
        res = await fetch(REGISTER_BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            lastName: values.lastName,
            idUniversidad: values.id,
            email: values.email,
            phone: values.phone,
            password: values.password,
            role: "driver",
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Error al registrar usuario.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("userRole", "driver");
      localStorage.setItem("isAuthenticated", "true");
      navigate("/carSignIn");
    } catch (err) {
      setServerError("⚠️ Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center relative overflow-hidden">
      {/* Flecha de regreso */}
      <button
        className="absolute top-8 left-8 hover:opacity-70 transition"
        aria-label="Back"
        onClick={() => navigate("/start")}
      >
        <ArrowLeft className="w-8 h-8 text-black" />
      </button>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-20 w-full max-w-7xl px-8 md:px-20">
        {/* FORMULARIO */}
        <div className="flex flex-col gap-6 w-full max-w-sm">
          {[
            { key: "name", label: "Name", placeholder: "Enter your name" },
            { key: "lastName", label: "Last Name", placeholder: "Enter your last name" },
            { key: "id", label: "ID", placeholder: "Enter your institutional ID" },
            { key: "email", label: "Email", placeholder: "Enter your institutional email" },
            { key: "phone", label: "Phone number", placeholder: "Enter your number" },
            { key: "password", label: "Password", placeholder: "Enter your password", type: "password" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-black font-semibold text-lg">{field.label}</label>
                {submitted && errors[field.key] && (
                  <span className="text-[#F59739] font-semibold text-sm">{errors[field.key]}</span>
                )}
              </div>

              <input
                type={field.type || "text"}
                value={values[field.key]}
                onChange={handleChange(field.key)}
                placeholder={field.placeholder}
                className={`bg-[#F4EFEF] rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none transition
                  ${submitted && errors[field.key] ? "border-2 border-[#F59739]" : "focus:ring-2 focus:ring-gray-700"}`}
              />
            </div>
          ))}

          {/* Error general del servidor */}
          {serverError && (
            <div className="text-[#F59739] font-semibold text-sm mt-2">{serverError}</div>
          )}
        </div>

        {/* SECCIÓN DERECHA */}
        <div className="relative flex flex-col items-center text-center w-full max-w-lg mt-10">
          {/* Botón Add Car */}
          <button
            onClick={handleAddCar}
            className="absolute -top-16 -right-10 bg-emerald-500 text-white px-10 py-3 
              rounded-xl text-lg font-semibold flex items-center gap-3 
              shadow-md hover:bg-emerald-600 transition"
          >
            <span className="text-3xl leading-none">+</span>
            <span>Add a car</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Texto principal */}
          <h1 className="text-[#1F2937] text-center text-6xl font-bold leading-tight mt-10 mb-8 ml-0 self-center">
            New Driver
          </h1>

          {/* Avatar circular clickeable */}
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

          {/* Texto bajo el avatar */}
          <p className="text-gray-400 text-lg mt-6">Upload your photo (Optional)</p>

          {/* Mensaje de error de imagen */}
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