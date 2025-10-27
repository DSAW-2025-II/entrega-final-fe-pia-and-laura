import React from "react";
import {
  ArrowLeft,
  Mail,
  Car,
  HelpCircle,
  Settings,
  LogOut,
  Star,
  ChevronRight,
  User,
} from "lucide-react";

export default function UserProfile() {
  const menuItems = [
    { icon: <Mail className="w-5 h-5 text-black" />, text: "Notifications" },
    { icon: <Car className="w-5 h-5 text-black" />, text: "Be a driver" },
    { icon: <HelpCircle className="w-5 h-5 text-black" />, text: "Help" },
    { icon: <Settings className="w-5 h-5 text-black" />, text: "Settings" },
  ];

  return (
    // Página completamente blanca; contenido centrado verticalmente y distribuido horizontalmente en desktop
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 md:p-8">
      {/* Contenedor principal: en mobile columna, en md fila; en md ocupa todo el ancho disponible (max-w-6xl) */}
      <div className="w-full md:max-w-6xl flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8">
        {/* Columna izquierda: avatar + nombre + badge */}
        <div className="flex items-center md:items-center gap-4 md:gap-8 md:flex-col md:flex-1">
          <div
            className="bg-[#2B2F38] rounded-full flex items-center justify-center overflow-hidden
                          w-20 h-20 md:w-[260px] md:h-[260px] flex-shrink-0"
          >
            <User className="text-white w-10 h-10 md:w-36 md:h-36" />
          </div>

          <div className="flex flex-col items-start md:items-start text-left">
            <h1 className="text-[#1F2937] font-bold text-2xl md:text-6xl leading-tight">
              User
            </h1>

            <div className="flex items-center gap-2 mt-2 bg-[#EEEEEE] px-3 py-1 rounded-xl inline-flex">
              <Star className="w-4 h-4 text-black" />
              <span className="text-black font-medium text-sm">Frequent</span>
            </div>
          </div>
        </div>

        {/* Columna derecha: menú grande y espaciado */}
        <div className="w-full md:flex-1 flex flex-col gap-4">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center justify-between bg-[#F2EEEC] rounded-3xl px-4 py-2 hover:bg-[#E9E6E4] transition shadow-md w-full"
            >
              <div className="flex items-center gap-6 text-black text-xl md:text-2xl font-semibold">
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
                  {React.cloneElement(item.icon, {
                    className: "w-9 h-9 text-black",
                  })}
                </div>
                <span>{item.text}</span>
              </div>
              <ChevronRight className="w-8 h-8 text-gray-400" />
            </button>
          ))}

          <button className="flex items-center justify-between bg-[#F2EEEC] rounded-3xl px-4 py-2 hover:bg-[#E9E6E4] transition shadow-md w-full">
            <div className="flex items-center gap-6 text-[#F59739] text-xl md:text-2xl font-semibold">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
                <LogOut className="w-9 h-9 text-[#F59739]" />
              </div>
              <span>Exit</span>
            </div>
            <ChevronRight className="w-8 h-8 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Flecha de regreso (se muestra encima, posicionada relativa a la pantalla) */}
      <button
        className="fixed top-6 left-6 md:top-8 md:left-8 hover:opacity-80 transition"
        aria-label="Back"
      >
        <ArrowLeft className="w-7 h-7 text-black" />
      </button>
    </div>
  );
}
