import React, { useRef, useState, useEffect } from "react";
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
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleAvatarClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  const menuItems = [
    { icon: <Mail className="w-5 h-5 text-black" />, text: "Notifications" },
    { icon: <Car className="w-5 h-5 text-black" />, text: "Be a driver" },
    { icon: <HelpCircle className="w-5 h-5 text-black" />, text: "Help" },
    { icon: <Settings className="w-5 h-5 text-black" />, text: "Settings" },
  ];

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-start p-6 md:p-10">
      {/* Top-left back arrow */}
      <div className="w-full">
        <button
          className="absolute top-8 left-8 hover:opacity-70 transition"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-8 h-8 text-black" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full gap-10 md:gap-16">
        {/* Left column: avatar + name */}
        <div className="flex flex-col items-center md:items-start flex-1 md:flex-none">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Avatar */}
          <div
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? handleAvatarClick() : null)}
            className="bg-[#2B2F38] w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-white w-24 h-24 md:w-36 md:h-36 opacity-95" />
            )}
          </div>

          {/* Name */}
          <h1 className="text-[#23262B] font-bold text-4xl md:text-6xl mt-6">
            Wheeler
          </h1>

          {/* Frecuent badge */}
          <div className="flex items-center gap-2 mt-3">
            <div className="inline-flex items-center gap-2 bg-[#F3F0F0] px-3 py-1 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-black" />
              <span className="text-black font-medium text-sm md:text-base">
                Frecuent
              </span>
            </div>
          </div>
        </div>

        {/* Right column: menu */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center justify-between bg-[#F3EFEE] rounded-xl px-4 py-4 hover:bg-gray-200 transition"
            >
              <div className="flex items-center gap-4 text-black text-lg font-medium">
                <div className="bg-white p-2 rounded-md shadow-sm">{item.icon}</div>
                <span>{item.text}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          ))}

          {/* Exit row */}
          <button className="flex items-center justify-between bg-[#F3EFEE] rounded-xl px-4 py-4 hover:bg-gray-200 transition">
            <div className="flex items-center gap-4 text-[#F59739] text-lg font-medium">
              <div className="bg-white p-2 rounded-md shadow-sm">
                <LogOut className="w-5 h-5 text-[#F59739]" />
              </div>
              <span>Exit</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}