import React from "react";
import logo from "../../assets/logo.png";
import { ArrowRight } from "lucide-react"; 

export default function SignUp() {
  return (
    <div className="h-screen w-full bg-[#1F2937] flex items-center justify-center">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex items-center justify-center gap-x-20 px-8 backdrop-blur-sm bg-[#1F2937]/80 w-full h-full">
        {/* LOGO */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo Wheels Unisabana"
            className="w-72 md:w-96 lg:w-[420px] object-contain"
          />
        </div>

        {/* FORMULARIO */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[340px] md:w-[400px]">
          <form className="flex flex-col gap-5">
            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* CONTRASEÑA */}
           <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-semibold">Contraseña</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              className="mt-3 flex items-center justify-center gap-2 bg-[#111827] text-white font-semibold text-lg py-3 rounded-xl shadow-md hover:bg-[#0f172a] transition"
            >
              Sign Up
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
