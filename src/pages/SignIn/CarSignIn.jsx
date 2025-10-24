import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
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
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${API_URL}/cars`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setShowBackArrow(false);
        navigate("/driverHome");
      } else {
        setFormMessage({
          type: "error",
          text: data.message || "Vehicle already registered.",
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
    <div className="relative w-full h-screen bg-white flex flex-col items-center overflow-hidden">
      {/* HEADER */}
      <div className="relative w-full flex justify-center items-center mt-8">
        {showBackArrow && (
          <button
            className="absolute left-8 hover:opacity-70 transition"
            onClick={() => navigate("/driverSignIn")}
          >
            <ArrowLeft className="w-8 h-8 text-black" />
          </button>
        )}

        <h1 className="text-[56px] font-bold leading-[56px] text-[#1F2937] text-center">
          New Car
        </h1>

        <button
          onClick={handleContinue}
          className="absolute right-8 bg-[#1F2937] text-white px-10 py-4 rounded-2xl text-xl font-bold flex items-center gap-3 hover:bg-gray-700 transition"
        >
          Continue
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* FORM CONTAINER */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-7xl px-10 mt-12">
        {/* LEFT FORM */}
        <div className="flex flex-col gap-6 w-full max-w-md justify-center md:min-h-[420px]">
          {/* License Plate */}
          <div>
            <label className="flex justify-between text-xl font-semibold mb-2 text-black">
              License Plate
              {submitted && errors.licensePlate && (
                <span className="text-green-600 text-base font-normal">
                  {errors.licensePlate}
                </span>
              )}
            </label>
            <input
              type="text"
              value={values.licensePlate}
              onChange={handleChange("licensePlate")}
              placeholder="Enter vehicle registration plate"
              className={`w-full bg-[#EEEEEE] text-black/60 rounded-xl px-5 py-4 text-xl font-semibold focus:outline-none transition ${
                submitted && errors.licensePlate ? "border-2 border-green-400" : ""
              }`}
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="flex justify-between text-lg font-semibold mb-1 text-black">
              Vehicle capacity
              {submitted && errors.capacity && (
                <span className="text-green-600 text-base font-normal">
                  {errors.capacity}
                </span>
              )}
            </label>
            <select
              value={values.capacity}
              onChange={handleChange("capacity")}
              className={`w-full bg-[#EEEEEE] text-black/60 rounded-xl px-5 py-4 text-xl font-semibold focus:outline-none transition ${
                submitted && errors.capacity ? "border-2 border-green-400" : ""
              }`}
            >
              <option value="">Select vehicle capacity</option>
              {[2, 3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num} seats
                </option>
              ))}
            </select>
          </div>

          {/* Make */}
          <div>
            <label className="flex justify-between text-xl font-semibold mb-2 text-black">
              Make
              {submitted && errors.make && (
                <span className="text-green-600 text-base font-normal">
                  {errors.make}
                </span>
              )}
            </label>
            <select
              value={values.make}
              onChange={handleMakeChange}
              className={`w-full bg-[#EEEEEE] text-black/60 rounded-xl px-5 py-4 text-xl font-semibold focus:outline-none transition ${
                submitted && errors.make ? "border-2 border-green-400" : ""
              }`}
            >
              <option value="">Select your car make</option>
              {Object.keys(carMakes).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="flex justify-between text-xl font-semibold mb-2 text-black">
              Model
              {submitted && errors.model && (
                <span className="text-green-600 text-base font-normal">
                  {errors.model}
                </span>
              )}
            </label>
            <select
              value={values.model}
              onChange={handleChange("model")}
              disabled={!values.make}
              className={`w-full bg-[#EEEEEE] text-black/60 rounded-xl px-5 py-4 text-xl font-semibold focus:outline-none transition ${
                submitted && errors.model ? "border-2 border-green-400" : ""
              }`}
            >
              <option value="">Select your car model</option>
              {values.make &&
                carMakes[values.make].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center gap-8">
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
          <div className="flex flex-row gap-16">
            {/* Car photo */}
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

            {/* SOAT */}
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
    </div>
  );
}

function FileUpload({ title, preview, fileName, error, inputRef, onFileChange }) {
  return (
    <div className="flex flex-col items-center">
      <label
        onClick={() => inputRef.current?.click()}
        className={`w-[200px] h-[180px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden ${
          preview || fileName ? "bg-white border" : "bg-[#F59739]"
        } ${error ? "ring-2 ring-green-600" : ""}`}
      >
        {preview === "pdf" ? (
          <div className="flex flex-col items-center">
            <FileText className="w-12 h-12 text-gray-700" />
            <span className="text-sm mt-2 break-words max-w-[160px] text-center">
              {fileName}
            </span>
          </div>
        ) : preview ? (
          <img src={preview} alt={title} className="w-full h-full object-cover" />
        ) : (
          <img
            src="/assets/upload.png"
            alt="upload"
            className="w-[90px] h-[90px]"
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

      <div className="flex flex-col items-center mt-3">
        <span className="text-2xl font-semibold text-black">{title}</span>
        {error ? (
          <span className="text-green-600 font-semibold mt-1">{error}</span>
        ) : fileName ? (
          <span className="text-gray-600 mt-1 text-sm break-words max-w-[160px] text-center">
            {fileName}
          </span>
        ) : null}
      </div>
    </div>
  );
}
