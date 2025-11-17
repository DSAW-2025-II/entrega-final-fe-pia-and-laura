import React from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#1F2937] relative overflow-hidden">

      {/* Main Content */}
      <div className="h-full w-full flex flex-col md:flex-row items-center justify-center px-5 md:px-10">
        {/* LOGO - Arriba en móvil, izquierda en desktop */}
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 md:mr-12">
          <img
            src={logo}
            alt="Logo del proyecto"
            className="w-48 sm:w-56 md:w-72 lg:w-96 xl:w-[420px] object-contain"
          />
        </div>

        {/* BOTONES - Abajo en móvil, derecha en desktop */}
        <div className="w-full max-w-sm md:w-[340px] lg:w-[380px] flex flex-col gap-4 md:gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#10B981] text-white font-bold text-lg md:text-xl py-4 md:py-3 rounded-[20px] shadow-md hover:bg-emerald-600 transition-colors"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/passengerSignIn", { state: { role: "passenger" } })}
            className="bg-white text-[#1F2937] font-bold text-lg md:text-xl py-4 md:py-3 rounded-[20px] shadow-md hover:bg-gray-100 transition-colors"
          >
            Sign In as Passenger
          </button>

          <button
            onClick={() => navigate("/driverSignIn", { state: { role: "driver" } })}
            className="bg-white text-[#1F2937] font-bold text-lg md:text-xl py-4 md:py-3 rounded-[20px] shadow-md hover:bg-gray-100 transition-colors"
          >
            Sign In as Driver
          </button>
        </div>
      </div>
    </div>
  );
}
