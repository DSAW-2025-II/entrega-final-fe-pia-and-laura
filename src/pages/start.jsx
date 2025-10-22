import React from "react";
import logo from "../../assets/logo.png";
import {useNavigate} from "react-router-dom";

export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#1F2937]">
        <div className="h-full w-full flex items-center justify-center gap-x-12 px-10">
        {/* LOGO - izquierda */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo del proyecto"
            className="w-72 md:w-96 lg:w-[420px] object-contain"
          />
        </div>

        {/* BOTONES - derecha */}
        <div className="w-[340px] md:w-[380px] flex flex-col gap-6">
          <button
          onClick={() => navigate("/signup")}
            className="bg-emerald-500 text-white font-semibold text-lg py-3 rounded-xl shadow-md hover:bg-emerald-600 transition"
          >
            Sign up 
          </button>

          <button className="bg-white text-gray-800 font-medium text-lg py-3 rounded-xl shadow-md hover:bg-gray-100 transition">
            Login as passenger
          </button>

          <button className="bg-white text-gray-800 font-medium text-lg py-3 rounded-xl shadow-md hover:bg-gray-100 transition">
            Login as driver
          </button>
        </div>
      </div>
    </div>
  );
}