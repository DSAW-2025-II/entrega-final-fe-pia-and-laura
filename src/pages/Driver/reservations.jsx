import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";


const API_URL = import.meta.env.VITE_API_BASE_URL;

/* ==== ICONOS ==== */
const WalletIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="12" r="1.2" fill="currentColor" />
  </svg>
);

const BackIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HomeIcon = (filled) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#000" : "none"}>
    <path
      d="M12 3.172L3 10.172V20a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1v-9.828L12 3.172z"
      stroke={filled ? "none" : "#AFAFAF"}
      strokeWidth={filled ? 0 : 1.6}
    />
  </svg>
);

const ActivityIcon = (filled) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 13h4l3-9 4 18 3-7h4"
      stroke={filled ? "#000" : "#AFAFAF"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AccountIcon = (filled) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 12a4 4 0 100-8 4 4 0 000 8z"
      stroke={filled ? "#000" : "#AFAFAF"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 20a8 8 0 0116 0"
      stroke={filled ? "#000" : "#AFAFAF"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ==== CARD COMPONENT ==== */
const ReservationCard = ({ reservation, role, token }) => {
  const variant = reservation.variant || "dark";
  const bg = {
    orange: "bg-amber-500 text-white",
    dark: "bg-gray-800 text-white",
    green: "bg-emerald-400 text-white",
  }[variant];

  // === ACCIONES ===
  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`${API_URL}/reservations/${reservation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(`Reservation ${newStatus}`);
      window.location.reload();
    } catch (error) {
      console.error("❌ Error updating reservation:", error);
    }
  };

  return (
    <div className={`flex items-center justify-between ${bg} rounded-xl px-4 py-3 w-full max-w-xl shadow-md`}>

      {/* Columna izquierda */}
      <div className="flex flex-col text-left">
        <span className="text-xs opacity-90 font-medium">
          To: {reservation.destination || "Unknown"}
        </span>

        <span className="font-extrabold text-lg mt-1">
          {reservation.date
            ? new Date(reservation.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--"}
        </span>

        {role === "passenger" && (
          <span className="text-xs mt-2 opacity-80">
            Status: <b className="capitalize">{reservation.status}</b>
          </span>
        )}
      </div>

      {/* Centro */}
      <div className="flex items-center justify-center flex-1">
        <div className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-md">
          <WalletIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Derecha */}
      <div className="flex flex-col text-right pr-3">
        {role === "driver" ? (
          <div className="font-semibold text-sm">
            Passenger: {reservation.passenger?.name || "Unknown"}
          </div>
        ) : (
          <div className="font-semibold text-sm">
            Driver: {reservation.driver?.name || "Unknown"}
          </div>
        )}

        <div className="text-white font-bold">
          {reservation.price ? `$${reservation.price}` : "--"}
        </div>
{/* BOTONES SEGÚN QUIÉN ES EL USUARIO */}
{isDriver ? (
  reservation.status === "pending" ? (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => updateStatus("confirmed")}
        className="px-3 py-1 bg-emerald-500 text-xs rounded-lg"
      >
        Accept
      </button>
      <button
        onClick={() => updateStatus("declined")}
        className="px-3 py-1 bg-red-500 text-xs rounded-lg"
      >
        Decline
      </button>
    </div>
  ) : (
    <span className="text-xs opacity-80 mt-2 capitalize">
      Status: {reservation.status}
    </span>
  )
) : isPassenger ? (
  reservation.status !== "cancelled" && (
    <button
      onClick={() => updateStatus("cancelled")}
      className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded-lg"
    >
      Cancel
    </button>
  )
) : null}

      </div>
    </div>
  );
};



/* ==== MAIN PAGE ==== */
export default function ReservationsPage() {
  const [active, setActive] = useState("activity");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user?.id && !user?._id) return;

    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/reservations/${user.id || user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("📦 Respuesta del backend:", data);

        if (!res.ok) throw new Error(data.message || "Error fetching reservations");

        // Asegurar que siempre sea un array
        if (Array.isArray(data)) {
          setReservations(data);
        } else if (data.today || data.tomorrow) {
          setReservations({
            today: data.today || [],
            tomorrow: data.tomorrow || []
          });
        } else {
          setReservations([]);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Error fetching reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, token]);

  /* ==== NAVIGATION ==== */
  const handleHomeClick = () => {
    setActive("home");
    navigate("/driverHome");
  };

  const handleAccountClick = () => {
    setActive("account");
    navigate("/UserProfile");
  };

  const handleActivityClick = () => {
    setActive("activity");
    navigate("/reservations");
  };

  const handleBackClick = () => navigate(-1);

  /* ==== RENDER ==== */
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 md:p-8">
      {/* HEADER */}
      <header className="sticky top-0 left-0 right-0 z-30 bg-white w-full h-16 border-b border-gray-200">
  <div className="flex items-center justify-between h-full px-4">
    <button
      onClick={handleBackClick}
      className="p-2 flex items-center justify-center h-10 w-10"
      aria-label="Back"
    >
      <BackIcon className="w-6 h-6 text-gray-800" />
    </button>

    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1">
      Reservations
    </h1>

    <div className="w-10 h-10" aria-hidden="true" />
  </div>
</header>


      {/* MAIN */}
<main className="w-full max-w-6xl mt-6 px-4">
  {error ? (
    <p className="text-red-500 text-center">{error}</p>
  ) : loading ? (
    <p className="text-gray-500 text-center">Loading reservations...</p>
  ) : reservations.today || reservations.tomorrow ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* TODAY COLUMN */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today</h2>
        {reservations.today && reservations.today.length > 0 ? (
          <div className="flex flex-col gap-4 items-center">
            {reservations.today.map((res) => (
              <ReservationCard 
  key={res._id || res.id} 
  reservation={res} 
  role={user.role} 
  token={token}
/>

            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No rides for today</p>
        )}
      </div>

      {/* TOMORROW COLUMN */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tomorrow</h2>
        {reservations.tomorrow && reservations.tomorrow.length > 0 ? (
          <div className="flex flex-col gap-4 items-center">
            {reservations.tomorrow.map((res) => (
              <ReservationCard 
  key={res._id || res.id} 
  reservation={res} 
  role={user.role} 
  token={token}
/>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No rides for tomorrow</p>
        )}
      </div>
    </div>
  ) : (
    <p className="text-gray-500 text-center">No reservations found.</p>
  )}
</main>


      {/* FOOTER MOBILE */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 w-full z-30 bg-white border-t border-gray-200">
        <div className="w-full flex justify-center">
          <nav className="relative w-full max-w-[414px] h-[83px] flex items-start justify-center py-[5%] gap-[33px]">
            <button onClick={handleHomeClick} className="flex flex-col items-center gap-1">
              {HomeIcon(active === "home")}
              <span className={`text-sm font-medium ${active === "home" ? "text-black" : "text-gray-500"}`}>Home</span>
            </button>

            <button onClick={handleActivityClick} className="flex flex-col items-center gap-1">
              {ActivityIcon(active === "activity")}
              <span className={`text-sm font-medium ${active === "activity" ? "text-black" : "text-gray-500"}`}>
                Activity
              </span>
            </button>

            <button onClick={handleAccountClick} className="flex flex-col items-center gap-1">
              {AccountIcon(active === "account")}
              <span className={`text-sm font-medium ${active === "account" ? "text-black" : "text-gray-500"}`}>
                Account
              </span>
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
