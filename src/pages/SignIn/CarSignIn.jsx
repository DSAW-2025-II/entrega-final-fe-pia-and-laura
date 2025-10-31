import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import uploadImage from "../../../assets/upload.png";


export default function CarSignIn() {
  const carPhotoInputRef = useRef(null);
  const soatInputRef = useRef(null);
  const navigate = useNavigate();

  const [carPhotoPreview, setCarPhotoPreview] = useState(null);
  const [soatPreview, setSoatPreview] = useState(null);
  const [carPhotoName, setCarPhotoName] = useState("");
  const [soatFileName, setSoatFileName] = useState("");
  const [carPhotoFile, setCarPhotoFile] = useState(null);
  const [soatFile, setSoatFile] = useState(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [values, setValues] = useState({
    licensePlate: "",
    capacity: "",
    make: "",
    model: "",
  });

  const [errors, setErrors] = useState({});
  const [carPhotoError, setCarPhotoError] = useState("");
  const [soatError, setSoatError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [showBackArrow, setShowBackArrow] = useState(true);

  const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const allowedTypes = [...allowedImageTypes, "application/pdf"];

  const carMakes = {
    Toyota: ["Corolla", "Yaris", "Hilux", "RAV4"],
    Mazda: ["Mazda 2", "Mazda 3", "CX-5"],
    Chevrolet: ["Spark", "Sail", "Onix", "Tracker"],
    Renault: ["Logan", "Sandero", "Duster"],
    Kia: ["Picanto", "Rio", "Sportage"],
  };

  const handleMakeChange = (e) => {
    const make = e.target.value;
    setValues((prev) => ({ ...prev, make, model: "" }));
  };

  useEffect(() => {
    return () => {
      if (carPhotoPreview?.startsWith("blob:")) URL.revokeObjectURL(carPhotoPreview);
      if (soatPreview?.startsWith("blob:")) URL.revokeObjectURL(soatPreview);
    };
  }, [carPhotoPreview, soatPreview]);

  const handleFileUpload = (ref) => ref?.current?.click();

  const validateAndSetFile = (file, setFileName, setPreview, setError, setFile) => {
    setError("");
    if (!file) {
      setFileName("");
      setPreview(null);
      setFile(null);
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setError("Not supported. Use JPG/PNG/PDF.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("File too large. Max 2MB.");
      return;
    }
    setFileName(file.name);
    setFile(file);
    setPreview(file.type === "application/pdf" ? "pdf" : URL.createObjectURL(file));
  };

  const handleFileChange = (e, setFileName, setPreview, setError, setFile) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file, setFileName, setPreview, setError, setFile);
  };

  const handleChange = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleContinue = async () => {
    setSubmitted(true);
    setFormMessage(null);

    const newErrors = {};
    if (!values.licensePlate.trim()) newErrors.licensePlate = "Required field *";
    else if (!/^[A-Z]{3}\d{3}$/i.test(values.licensePlate.trim()))
      newErrors.licensePlate = "Invalid plate. Use 3 letters + 3 numbers";
    if (!values.capacity) newErrors.capacity = "Required field *";
    if (!values.make) newErrors.make = "Required field *";
    if (!values.model) newErrors.model = "Required field *";
    if (!carPhotoFile) setCarPhotoError("Required field *");
    if (!soatFile) setSoatError("Required field *");

    setErrors(newErrors);

    const hasErrors =
      Object.keys(newErrors).length > 0 || carPhotoError || soatError;
    if (hasErrors) return;

    const formData = new FormData();
    formData.append("licensePlate", values.licensePlate);
    formData.append("capacity", values.capacity);
    formData.append("make", values.make);
    formData.append("model", values.model);
    formData.append("carPhoto", carPhotoFile);
    formData.append("soat", soatFile);

    try {
      console.log("API_URL (raw):", API_URL);
      // Aseguramos no tener barras duplicadas y usamos la ruta que tu backend expone (/car)
      const base = (API_URL || "").replace(/\/+$/, "");
      const url = `${base}/car`;
      console.log("POST a:", url);

      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      console.log("Response status:", response.status);

      const contentType = response.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn("Non-JSON response from /car:", text);
        data = { message: text };
      }

      console.log("Response body:", data);

      if (response.ok) {
        setShowBackArrow(false);
        navigate("/driverHome");
      } else {
        setFormMessage({
          type: "error",
          text: data.message || `Server error: ${response.status}`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setFormMessage({
        type: "error",
        text: "Error connecting to the server.",
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col items-center overflow-hidden">
      {/* HEADER */}
      <div className="relative w-full flex justify-center items-center mt-8 md:mt-12">
        {showBackArrow && (
          <button
            className="absolute left-6 hover:opacity-70 transition"
            onClick={() => navigate("/driverSignIn")}
          >
            <ArrowLeft className="w-7 h-7 text-black" />
          </button>
        )}

        <h1 className="text-[40px] md:text-[56px] font-bold leading-[56px] text-[#1F2937] text-center">
          New Car
        </h1>

        <button
          onClick={handleContinue}
          className="hidden md:flex absolute right-8 bg-[#1F2937] text-white px-10 py-4 rounded-2xl text-xl font-bold items-center gap-3 hover:bg-gray-700 transition"
        >
          Continue
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* FORM */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-7xl px-6 mt-10 md:mt-12">
        {/* LEFT FORM */}
        <div className="flex flex-col gap-6 w-full max-w-md justify-center md:min-h-[420px]">
          {[
            { label: "License Plate", key: "licensePlate", placeholder: "Enter vehicle registration plate" },
            { label: "Vehicle capacity", key: "capacity", select: [2, 3, 4, 5, 6, 7] },
            { label: "Make", key: "make", select: Object.keys(carMakes) },
            { label: "Model", key: "model", select: values.make ? carMakes[values.make] : [] },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="flex justify-between text-lg md:text-xl font-semibold mb-2 text-black">
                {field.label}
                {submitted && errors[field.key] && (
                  <span className="text-[#F59739] text-base font-normal">
                    {errors[field.key]}
                  </span>
                )}
              </label>
              {field.select ? (
                <select
                  value={values[field.key]}
                  onChange={field.key === "make" ? handleMakeChange : handleChange(field.key)}
                  disabled={field.key === "model" && !values.make}
                  className={`w-full bg-[#EEEEEE] text-black/60 rounded-xl px-5 py-4 text-lg md:text-xl font-semibold focus:outline-none transition ${
                    submitted && errors[field.key] ? "border-2 border-[#F59739]" : ""
                  }`}
                >
                  <option value="">
                    {field.key === "capacity"
                      ? "Select vehicle capacity"
                      : `Select your car ${field.key}`}
                  </option>
                  {field.select.map((opt) => (
                    <option key={opt} value={opt}>
                      {field.key === "capacity" ? `${opt} seats` : opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[field.key]}
                  onChange={handleChange(field.key)}
                  placeholder={field.placeholder}
                  className={`w-full bg-[#EEEEEE] text-black/60 rounded-xl px-5 py-4 text-lg md:text-xl font-semibold focus:outline-none transition ${
                    submitted && errors[field.key] ? "border-2 border-[#F59739]" : ""
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center gap-8 w-full md:w-auto">
          {formMessage && (
            <span
              className={`text-base font-semibold ${
                formMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formMessage.text}
            </span>
          )}

          {/* File uploads */}
          <div className="flex flex-row justify-center gap-6 md:gap-16 w-full">
            <FileUpload
              title="Car photo"
              preview={carPhotoPreview}
              fileName={carPhotoName}
              error={carPhotoError}
              inputRef={carPhotoInputRef}
              onFileChange={(e) =>
                handleFileChange(
                  e,
                  setCarPhotoName,
                  setCarPhotoPreview,
                  setCarPhotoError,
                  setCarPhotoFile
                )
              }
            />

            <FileUpload
              title="SOAT"
              preview={soatPreview}
              fileName={soatFileName}
              error={soatError}
              inputRef={soatInputRef}
              onFileChange={(e) =>
                handleFileChange(
                  e,
                  setSoatFileName,
                  setSoatPreview,
                  setSoatError,
                  setSoatFile
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Continue button visible only on mobile */}
      <div className="flex md:hidden justify-center w-full px-6 mt-10 mb-10">
        <button
          onClick={handleContinue}
          className="w-full bg-[#1F2937] text-white py-4 rounded-2xl text-lg font-bold flex justify-center items-center gap-2 hover:bg-gray-700 transition"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function FileUpload({ title, preview, fileName, error, inputRef, onFileChange }) {
  return (
    <div className="flex flex-col items-center">
      <label
        onClick={() => inputRef.current?.click()}
        className={`w-[150px] h-[150px] md:w-[200px] md:h-[180px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden ${
          preview || fileName ? "bg-white border" : "bg-[#F59739]"
        } ${error ? "ring-2 ring-[#F59739]" : ""}`}
      >
        {preview === "pdf" ? (
          <div className="flex flex-col items-center">
            <FileText className="w-10 h-10 text-gray-700" />
            <span className="text-xs mt-2 break-words max-w-[120px] text-center md:max-w-[160px]">
              {fileName}
            </span>
          </div>
        ) : preview ? (
          <img src={preview} alt={title} className="w-full h-full object-cover" />
        ) : (
          <img
            src={uploadImage}
            alt="upload"
            className="w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
          />
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={onFileChange}
        />
      </label>

      <div className="flex flex-col items-center mt-2 md:mt-3">
        <span className="text-lg md:text-2xl font-semibold text-black">{title}</span>
        {error ? (
          <span className="text-[#F59739] font-semibold mt-1">{error}</span>
        ) : fileName ? (
          <span className="text-gray-600 mt-1 text-xs md:text-sm break-words max-w-[120px] md:max-w-[160px] text-center">
            {fileName}
          </span>
        ) : null}
      </div>
    </div>
  );
}