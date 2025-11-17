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

const CloseIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
export function ReservationsCard({ reservations, currentUser, onStatusChange, onPassengerCancel }) {
  const [open, setOpen] = useState(false);
  
  // Gestionar comparaciones de id (asegúrate de que currentUser tenga _id o id)
  const currentId = currentUser?._id || currentUser?.id || null;
  const driverId = reservations?.driver?._id || reservations?.driver?.id || null;
  const passengerId = reservations?.passenger?._id || reservations?.passenger?.id || null;

  const isDriver = currentId && driverId && String(currentId) === String(driverId);
  const isPassenger = currentId && passengerId && String(currentId) === String(passengerId);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Colores por estado (para badge de la izquierda)
  const badgeColor =
    reservations.status === "pending"
      ? "bg-amber-100 text-amber-700"
      : reservations.status === "accepted"
      ? "bg-emerald-100 text-emerald-700"
      : reservations.status === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-slate-100 text-slate-700";

  return (
    <>
      {/* === TARJETA MINI (lista) === */}
<div
  onClick={handleOpen}
  className="w-full max-w-[750px] rounded-3xl cursor-pointer shadow-md transition hover:scale-[1.01]"
  style={{ background: "#1F2739" }}
>
  <div className="flex items-center justify-between w-full px-6 py-4">

    {/* LEFT SIDE */}
    <div className="flex flex-col text-white w-[60%]">
      <span className="text-xs font-semibold opacity-90">
        To: {reservations.destination}
      </span>

      <span className="text-2xl font-extrabold mt-1">
        {new Date(reservations.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>

    {/* CENTER ICON */}
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
        <WalletIcon className="w-6 h-6" />
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex flex-col text-right text-white">
      <span className="text-sm font-semibold">
        Passenger: {reservations?.passenger?.name || "Passenger"}
      </span>

      <span className="text-lg font-extrabold mt-1">
        ${reservations.price}
      </span>
    </div>
  </div>
</div>


      {/* === OVERLAY OSCURO === */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* === PANEL LATERAL === */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="fixed top-0 right-0 z-50 h-full w-[420px] p-6"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="relative h-full rounded-2xl overflow-hidden shadow-xl" style={{ background: "#10B981" }}>
              {/* Close Button */}
              <button onClick={handleClose} className="absolute right-4 top-4 p-2">
                <CloseIcon />
              </button>

              <div className="p-8 text-white h-full flex flex-col justify-between">
                <div>
                  {/* Icon top-left */}
                  <div className="mb-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>

                  <ul className="list-inside list-disc ml-2 space-y-2 mb-6">
                    <li className="text-lg font-semibold">To: {reservations.destination}</li>
                    {/* Mostrar conductor si NO eres el conductor dueño */}
                    {!isDriver && (
                      <li className="text-base">Driver: <span className="font-medium">{reservations.driver?.name || "Unknown"}</span></li>
                    )}
                    <li className="text-sm opacity-90">{new Date(reservations.date).toLocaleString()}</li>
                  </ul>

                  <div className="mt-6 text-5xl font-extrabold">${reservations.price}</div>
                </div>

                {/* Botones de acción */}
                <div className="mt-6">
                  {/* Si eres conductor y la reserva está pendiente -> mostrar Accept/Decline (verde y naranja) */}
                  {isDriver && reservations.status === "pending" && (
                    <>
                      <button
                        onClick={() => onStatusChange(reservations._id || reservations.id, "accepted")}
                        className="w-full px-6 py-3 rounded-xl bg-emerald-400 text-white font-semibold mb-3 shadow"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => onPassengerCancel(reservations._id || reservations.id)}
                        className="w-full px-6 py-3 rounded-xl bg-orange-400 text-white font-semibold"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {/* Si eres pasajero y aún está pendiente -> cancelar */}
                  {isPassenger && reservations.status === "pending" && (
                    <button
                      onClick={() => onPassengerCancel(reservations._id || reservations.id)}
                      className="w-full px-6 py-3 rounded-xl bg-orange-400 text-white font-semibold"
                    >
                      Cancel reservations
                    </button>
                  )}


                  {/* Si ni eres conductor ni pasajero -> solo vista (o botón de info) */}
                  {!isDriver && !isPassenger && (
                    <div className="text-white/90 text-center py-3">You are viewing this reservations</div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}



/* ==== MAIN PAGE ==== */
export default function ReservationsPage() {
  const [active, setActive] = useState("activity");
  const [reservations, setreservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user?.id && !user?._id) return;

    const fetchreservations = async () => {
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
          setreservations(data);
        } else if (data.today || data.tomorrow) {
          setreservations({
            today: data.today || [],
            tomorrow: data.tomorrow || []
          });
        } else {
          setreservations([]);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Error fetching reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchreservations();
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
  const handleStatusChange = async (id, newStatus) => {
  try {
    await fetch(`${API_URL}/reservations/status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    // Refrescar lista después de cambiar estado
    setreservations(prev =>
      ({
        today: prev.today.map(r => r._id === id ? { ...r, status: newStatus } : r),
        tomorrow: prev.tomorrow.map(r => r._id === id ? { ...r, status: newStatus } : r),
      })
    );

  } catch (err) {
    console.error("Error updating status:", err);
  }
  
};
  const onPassengerCancel = async (id) => {
    try {
        await fetch(`${API_URL}/reservations/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      // actualizar UI
    setreservations(prev => ({
        today: prev.today.map(r => r._id === id ? { ...r, status: "cancelled" } : r),
        tomorrow: prev.tomorrow.map(r => r._id === id ? { ...r, status: "cancelled" } : r),
      }));
    } catch (err) {
      console.error("Error cancelling reservations:", err);
    }
  };


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
        <ReservationsCard
          key={res._id || res.id}
          reservations={res}
          currentUser={user}
          onStatusChange={handleStatusChange}
          onPassengerCancel={onPassengerCancel}
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
          <ReservationsCard
            key={res._id || res.id}
            reservations={res}
            currentUser={user}
            onStatusChange={handleStatusChange}
            onPassengerCancel={onPassengerCancel}
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
