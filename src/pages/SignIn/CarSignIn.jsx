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
  const CAR_BACKEND_URL = process.env.CAR_BACKEND_URL;
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
  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB
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
      if (carPhotoPreview?.startsWith?.("blob:")) URL.revokeObjectURL(carPhotoPreview);
      if (soatPreview?.startsWith?.("blob:")) URL.revokeObjectURL(soatPreview);
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
      setError("Formato no soportado. Usa JPG/PNG/PDF.");
      setFileName(file.name || "");
      setPreview(null);
      setFile(null);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Archivo muy grande. Máx 2MB.");
      setFileName(file.name || "");
      setPreview(null);
      setFile(null);
      return;
    }
    setFileName(file.name);
    setFile(file);
    if (file.type === "application/pdf") {
      setPreview("pdf");
      setError("");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setError("");
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

    // Validaciones básicas
    if (!values.licensePlate?.trim()) newErrors.licensePlate = "Required field *";
    else if (!/^[A-Z]{3}\d{3}$/i.test(values.licensePlate.trim())) {
      newErrors.licensePlate = "Invalid plate. Use 3 letters + 3 numbers";
    }

    if (!values.capacity?.toString()?.trim()) newErrors.capacity = "Required field *";
    if (!values.make?.trim()) newErrors.make = "Required field *";
    if (!values.model?.trim()) newErrors.model = "Required field *";

    if (!carPhotoFile && !carPhotoPreview) setCarPhotoError("Required field *");
    if (!soatFile && !soatPreview) setSoatError("Required field *");

    setErrors(newErrors);

    const hasFormErrors = Object.keys(newErrors).length > 0;
    const hasUploadErrors = !!(carPhotoError || soatError);

    if (!hasFormErrors && !hasUploadErrors) {
      const formData = new FormData();
      formData.append("licensePlate", values.licensePlate);
      formData.append("capacity", values.capacity);
      formData.append("make", values.make);
      formData.append("model", values.model);
      if (carPhotoFile) formData.append("carPhoto", carPhotoFile);
      if (soatFile) formData.append("soat", soatFile);

      try {
        const response = await fetch(CAR_BACKEND_URL, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (response.ok) {
          setShowBackArrow(false);
          navigate("/driverHome");
        } else {
          setFormMessage({
            type: "error",
            text: data.message || "Vehículo ya registrado.",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setFormMessage({
          type: "error",
          text: "Error al conectar con el servidor.",
        });
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-white flex flex-col items-center overflow-hidden">
      {/* HEADER SUPERIOR */}
      <div className="relative w-full flex justify-center items-center mt-8">
        {/* ARROW BACK */}
        {showBackArrow && (
          <button
            className="absolute left-8 hover:opacity-70 transition"
            aria-label="Back"
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

      {/* PRINCIPAL CONTAINER */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-7xl px-10 mt-12">
        {/* LEFT FORM  */}
        <div className="flex flex-col gap-6 w-full max-w-md justify-center md:min-h-[420px]">
          {/* License Plate */}
          <div>
            <label className="flex justify-between items-center text-xl font-semibold mb-2 text-black">
              <span>License Plate</span>
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
              placeholder="Enter your vehicle registration plate"
              className={`w-full bg-[#EEEEEE] text-black/60 rounded-xl px-5 py-4 text-xl font-semibold focus:outline-none transition ${
                submitted && errors.licensePlate
                  ? "border-2 border-green-400"
                  : ""
              }`}
            />
          </div>

          {/* Vehicle capacity */}
          <div>
            <label className="flex justify-between items-center text-lg font-semibold mb-1 text-black">
              <span>Vehicle capacity</span>
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
            <label className="flex justify-between items-center text-xl font-semibold mb-2 text-black">
              <span>Make</span>
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
            <label className="flex justify-between items-center text-xl font-semibold mb-2 text-black">
              <span>Model</span>
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

        {/* SECCIÓN DERECHA */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-sm md:min-h-[420px]">
          {formMessage && (
            <span
              className={`text-base font-semibold mb-3 ${
                formMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formMessage.text}
            </span>
          )}

          <div className="flex flex-row justify-center items-center gap-16 w-full">
            {/* Car photo */}
            <div className="flex flex-col items-center">
              <label
                onClick={() => handleFileUpload(carPhotoInputRef)}
                className={`w-[200px] h-[180px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden ${
                  carPhotoPreview || carPhotoName
                    ? "bg-white border"
                    : "bg-[#F59739]"
                } ${carPhotoError ? "ring-2 ring-green-600" : ""}`}
              >
                {carPhotoPreview === "pdf" ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-gray-700" />
                    <span className="text-sm mt-2 break-words max-w-[160px] text-center">
                      {carPhotoName}
                    </span>
                  </div>
                ) : carPhotoPreview ? (
                  <img
                    src={carPhotoPreview}
                    alt="car"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="assets/upload.png"
                    alt="upload"
                    className="w-[90px] h-[90px]"
                  />
                )}

                <input
                  ref={carPhotoInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      setCarPhotoName,
                      setCarPhotoPreview,
                      setCarPhotoError,
                      setCarPhotoFile
                    )
                  }
                />
              </label>

              <div className="flex flex-col items-center mt-3">
                <span className="text-2xl font-semibold text-black">
                  Car photo
                </span>
                {carPhotoError ? (
                  <span className="text-green-600 font-semibold mt-1">
                    {carPhotoError}
                  </span>
                ) : submitted && !carPhotoFile && !carPhotoPreview ? (
                  <span className="text-green-600 font-semibold mt-1">
                    Required field *
                  </span>
                ) : carPhotoName ? (
                  <span className="text-gray-600 mt-1 text-sm break-words max-w-[160px] text-center">
                    {carPhotoName}
                  </span>
                ) : null}
              </div>
            </div>

            {/* SOAT */}
            <div className="flex flex-col items-center">
              <label
                onClick={() => handleFileUpload(soatInputRef)}
                className={`w-[200px] h-[180px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden ${
                  soatPreview || soatFileName
                    ? "bg-white border"
                    : "bg-[#F59739]"
                } ${soatError ? "ring-2 ring-green-600" : ""}`}
              >
                {soatPreview === "pdf" ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-gray-700" />
                    <span className="text-sm mt-2 break-words max-w-[160px] text-center">
                      {soatFileName}
                    </span>
                  </div>
                ) : soatPreview ? (
                  <img
                    src={soatPreview}
                    alt="soat"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="assets/upload.png"
                    alt="upload"
                    className="w-[80px] h-[80px]"
                  />
                )}

                <input
                  ref={soatInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      setSoatFileName,
                      setSoatPreview,
                      setSoatError,
                      setSoatFile
                    )
                  }
                />
              </label>

              <div className="flex flex-col items-center mt-3">
                <span className="text-2xl font-semibold text-black">SOAT</span>
                {soatError ? (
                  <span className="text-green-600 font-semibold mt-1">
                    {soatError}
                  </span>
                ) : submitted && !soatFile && !soatPreview ? (
                  <span className="text-green-600 font-semibold mt-1">
                    Required field *
                  </span>
                ) : soatFileName ? (
                  <span className="text-gray-600 mt-1 text-sm break-words max-w-[160px] text-center">
                    {soatFileName}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
