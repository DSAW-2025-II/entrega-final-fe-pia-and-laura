import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import {rideCar} from "../assets/ridecar.png";
import calendarBenefits from "../assets/calendarBenefits.png";
import clockBenefits from "../assets/clockBenefits.png";
import cardBenefits from "../assets/cardBenefits.png";
import homeCar from "../assets/homeCar.png";
import reservations from "../assets/reservations.png";


export default function HomePassenger() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Obtener perfil del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener perfil");
        const data = await res.json();
        console.log("Perfil en PassengerHome:", data);
        setUser(data);
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };

    fetchUser();
  }, []);

  // 🚗 Función principal: manejar el clic en “Be a driver”
  const handleBeDriver = async () => {
    if (!user) return;

    if (user.role === "driver") {
      // Si ya es conductor, lo enviamos directamente a su home
      navigate("/driverHome");
      return;
    }

    // Si es pasajero, primero mostramos mensaje
    try {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  // Cambiar el rol del usuario en el backend
  const res = await fetch(`${API_URL}/user/update-role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newRole: "driver" }), // 👈 IMPORTANTE: debe ser "newRole"
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Error del servidor:", data);
    throw new Error(data.message || "Error al actualizar rol");
  }

  console.log("Rol actualizado a conductor ✅", data);

  // Redirigimos al registro del carro
  navigate("/CarSignIn");
} catch (error) {
  console.error("Error cambiando rol:", error);
  alert("Hubo un error cambiando tu rol. Inténtalo nuevamente.");
}

  };

  // Navegación general
  const handleHomeClick = () => {
    setActive("home");
    navigate("/passengerHome");
  };

  const handleAccountClick = () => {
    setActive("account");
    navigate("/userProfile");
  };

  const handleActivityClick = () => {
    setActive("activity");
  };

  const HomeIcon = (filled) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#000" : "none"} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 3.172L3 10.172V20a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1v-9.828L12 3.172z" stroke={filled ? "none" : "#AFAFAF"} strokeWidth={filled ? 0 : 1.6} />
    </svg>
  );

  const ActivityIcon = (filled) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 13h4l3-9 4 18 3-7h4" stroke={filled ? "#000" : "#AFAFAF"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const AccountIcon = (filled) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke={filled ? "#000" : "#AFAFAF"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20a8 8 0 0116 0" stroke={filled ? "#000" : "#AFAFAF"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full bg-white font-sans text-gray-800 flex flex-col">
      {/* Header Desktop */}
      <header className="hidden md:flex items-center justify-between px-5 md:px-12 py-4 md:py-6">
        <h1 className="font-extrabold text-5xl md:text-6xl">
          Welcome, {user?.name || "Wheeler"}
        </h1>

        <nav className="flex items-center gap-6">
          <button onClick={handleHomeClick} className="flex flex-col items-center text-xs md:text-sm">
            {HomeIcon(active === "home")}
            <span className={`mt-1 ${active === "home" ? "text-black" : "text-gray-600"}`}>Home</span>
          </button>

          <button onClick={handleActivityClick} className="flex flex-col items-center text-xs md:text-sm">
            {ActivityIcon(active === "activity")}
            <span className={`mt-1 ${active === "activity" ? "text-black" : "text-gray-600"}`}>Activity</span>
          </button>

          <button onClick={handleAccountClick} className="flex flex-col items-center text-xs md:text-sm">
            {AccountIcon(active === "account")}
            <span className={`mt-1 ${active === "account" ? "text-black" : "text-gray-600"}`}>Account</span>
          </button>
        </nav>
      </header>

      {/* Header Mobile */}
      <div className="flex items-center justify-between px-5 py-4 md:hidden">
        <h1 className="font-extrabold text-3xl md:text-4xl">
          Welcome, {user?.name || "Wheeler"}
        </h1>

        {user?.photo ? (
          <img src={user.photo} alt="User avatar" className="w-14 h-14 rounded-full object-cover border border-gray-300" />
        ) : (
          <div className="bg-[#2B2F38] rounded-full flex items-center justify-center overflow-hidden w-14 h-14">
            <User className="text-white w-5 h-5" />
          </div>
        )}
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-between px-5 md:px-12 py-3 md:py-5 overflow-auto pb-32 md:pb-0">
        {/* Banner */}
        <section className="flex flex-col md:flex-row items-center justify-between bg-[#F59739] rounded-xl px-6 md:px-12 py-5 md:py-8 w-full">
          <div className="flex flex-col gap-2 text-center md:text-left flex-1">
            <h2 className="font-extrabold text-3xl md:text-5xl leading-tight text-gray-900">
              Still having space <br className="hidden md:block" /> on your car?
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3">
              <span className="font-semibold text-xs md:text-lg text-gray-900">Be a driver</span>
              <button
                onClick={handleBeDriver}
                className="text-xl md:text-3xl font-bold hover:text-orange-500 transition"
              >
                →
              </button>
            </div>
          </div>

          <img
            src={homeCar}
            alt="car"
            className="w-28 h-20 md:w-60 md:h-36 object-contain drop-shadow-lg mt-3 md:mt-0"
          />
        </section>

        {/* Middle */}
        <div className="flex flex-col md:flex-row justify-center gap-3 flex-1 pt-2">
          {/* Left: Icons */}
          <div className="flex flex-row md:flex-col justify-center items-center gap-3 md:gap-5 w-full md:w-[30%]">
            <button
            onClick={() => navigate("/reservations")} // 👈 Navega a la página de reservas
                className="flex-shrink-0 flex flex-col items-center bg-gray-100 rounded-xl p-3 w-28 md:w-full max-w-[280px] md:max-w-none h-28 md:h-auto justify-center hover:bg-gray-200 transition"
            >
                <img
                    src={rideCar}
                    alt="New ride"
                    className="w-24 md:w-40 h-auto object-contain"
                />
                <p className="mt-2 font-semibold text-sm md:text-base text-center">
                My rides
            </p>
            </button>
            <button className="flex-shrink-0 flex flex-col items-center bg-gray-100 rounded-xl p-3 w-28 md:w-full max-w-[280px] md:max-w-none h-28 md:h-auto justify-center">
              <img
                src={reservations}
                alt="Reservations"
                className="w-24 md:w-40 h-auto object-contain"
              />
              <p className="mt-2 font-semibold text-sm md:text-base text-center">
                Reserve
              </p>
            </button>
          </div>

          {/* Right */}
          <div className="flex flex-col justify-center w-full md:w-[70%] lg:w-[80%] gap-3">
            {/* Benefits box */}
            <div className="border border-gray-300 rounded-xl p-4 md:p-5 bg-white flex flex-col justify-between flex-shrink-0 h-auto md:h-[200px]">
              <h3 className="font-bold text-base md:text-xl mb-2 md:mb-3">
                Benefits
              </h3>

              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 md:w-12 md:h-6 bg-no-repeat bg-contain flex-shrink-0"
                    style={{
                      backgroundImage: `url(${calendarBenefits})`,
                    }}
                    aria-hidden
                  ></div>
                  <p className="min-w-0">Choose your exact pickup time up to 90 days in advance.</p>
                </li>

                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 md:w-12 md:h-6 bg-no-repeat bg-contain flex-shrink-0"
                    style={{
                      backgroundImage: `url(${clockBenefits})`,
                    }}
                    aria-hidden
                  ></div>
                  <p className="min-w-0">Extra wait time included to meet your ride.</p>
                </li>

                <li className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 md:w-12 md:h-6 bg-no-repeat bg-contain flex-shrink-0"
                    style={{
                      backgroundImage: `url(${cardBenefits})`,
                    }}
                    aria-hidden
                  ></div>
                  <p className="min-w-0">Cancel at no charge up to 60 minutes in advance.</p>
                </li>
              </ul>
            </div>

            {/* Next ride */}
            <div className="bg-emerald-500 text-white rounded-xl px-4 py-3 flex items-center justify-between h-[60px] md:h-[70px] flex-shrink-0">
              <div>
                <div className="font-bold text-sm md:text-lg">Next ride</div>
                <div className="text-[10px] md:text-sm opacity-80">
                  To: Destination
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-lg md:text-2xl font-extrabold">13:00</span>
                <button className="w-6 h-6 md:w-8 md:h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  x
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Mobile */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-30">
        <div className="w-full flex justify-center">
          <nav className="relative bg-white w-full max-w-[414px] h-[83px] border-t border-gray-200">
            <div className="absolute inset-0 flex items-start px-[22.21%] py-[5%] gap-[33px]">
              <button onClick={handleHomeClick} className="flex flex-col items-center gap-1 w-[53px] h-[52px]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill={active === "home" ? "#000" : "#AFAFAF"}>
                  <path d="M12 3.172L3 10.172V20a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1v-9.828L12 3.172z" />
                </svg>
                <span className={`text-sm font-medium ${active === "home" ? "text-black" : "text-gray-500"}`}>Home</span>
              </button>

              <button onClick={handleActivityClick} className="flex flex-col items-center gap-1 w-[53px] h-[52px]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 13h4l3-9 4 18 3-7h4" stroke={active === "activity" ? "#000" : "#AFAFAF"} strokeWidth="1.6" />
                </svg>
                <span className={`text-sm font-medium ${active === "activity" ? "text-black" : "text-gray-500"}`}>Activity</span>
              </button>

              <button onClick={handleAccountClick} className="flex flex-col items-center gap-1 w-[57px] h-[52px]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke={active === "account" ? "#000" : "#AFAFAF"} strokeWidth="1.4" />
                  <path d="M4 20a8 8 0 0116 0" stroke={active === "account" ? "#000" : "#AFAFAF"} strokeWidth="1.4" />
                </svg>
                <span className={`text-sm font-medium ${active === "account" ? "text-black" : "text-gray-500"}`}>Account</span>
              </button>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  );
}
