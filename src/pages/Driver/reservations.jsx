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

const HomeIcon = ({filled}) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#000" : "none"}>
    <path
      d="M12 3.172L3 10.172V20a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1v-9.828L12 3.172z"
      stroke={filled ? "none" : "#AFAFAF"}
      strokeWidth={filled ? 0 : 1.6}
    />
  </svg>
);

const ActivityIcon = ({filled}) => (
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

const AccountIcon = ({filled}) => (
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
// === ESTILOS PARA EL ESTADO DE LA RESERVA ===
const statusStyles = {
  pending: "bg-[#374151] text-white",
  accepted: "bg-[#10B981] text-white",
  declined: "bg-[#F59739] text-white",
};

export function ReservationsCard({ reservations, currentUser, onStatusChange, getId }) {
  const [open, setOpen] = useState(false);
  console.log("🔍 RESERVATION OBJECT:", reservations);
  console.log("🧾 ID en la card:", getId(reservations));
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

  return (
    <>
      {/* === TARJETA MINI === */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.01 }}
  transition={{ duration: 0.25 }}
  onClick={handleOpen}
  className="w-full max-w-[750px] rounded-3xl shadow-md cursor-pointer"
  style={{ background: "#1F2739" }}
>
  <div className="flex items-center justify-between px-6 py-4 w-full text-white">
    
    {/* Left */}
    <div className="flex flex-col w-[55%]">
      <span className="text-xs font-medium opacity-80">
        To: {reservations.destination}
      </span>

      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`mt-2 px-3 py-1 text-[10px] font-bold rounded-full ${statusStyles[reservations.status]}`}
      >
        {reservations.status.toUpperCase()}
      </motion.span>

      <span className="mt-2 text-2xl font-extrabold">
        {new Date(reservations.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>

    {/* Icon */}
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
        <WalletIcon className="w-6 h-6" />
      </div>
    </div>

    {/* Right */}
    <div className="flex flex-col text-right">
      <span className="text-sm font-semibold">
        {isDriver ? `Passenger: ${reservations?.passenger?.name}` : `Driver: ${reservations?.driver?.name}`}
      </span>

      <span className="mt-1 text-xl font-extrabold">
        ${reservations.price}
      </span>
    </div>
  </div>
</motion.div>

{/* === PANEL LATERAL === */}
<AnimatePresence>
{open && (
  <motion.aside
    className="fixed top-0 right-0 z-50 h-full w-[420px] p-6"
    initial={{ x: 420 }}
    animate={{ x: 0 }}
    exit={{ x: 420 }}
    transition={{ type: "spring", stiffness: 250, damping: 28 }}
  >
    <div className="relative h-full rounded-2xl overflow-hidden shadow-xl bg-emerald-500">
      
      {/* Close */}
      <button onClick={handleClose} className="absolute right-4 top-4 p-2">
        <CloseIcon />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-white h-full flex flex-col justify-between"
      >

        {/* TOP INFO */}
        <div>
          {/* Badge arriba */}
          <span
            className={`px-3 py-1 rounded-xl text-sm font-bold ${statusStyles[reservations.status]}`}
          >
            {reservations.status.toUpperCase()}
          </span>

          {/* Destino y hora */}
          <h2 className="mt-5 text-2xl font-bold">
            To: {reservations.destination}
          </h2>
          <p className="opacity-90 mt-1">
            {new Date(reservations.date).toLocaleString()}
          </p>

          {/* Info agrupada */}
          <div className="mt-6 space-y-2 text-sm">
            {!isDriver && (
              <p>Driver: <span className="font-semibold">{reservations.driver?.name}</span></p>
            )}
            {!isPassenger && (
              <p>Passenger: <span className="font-semibold">{reservations.passenger?.name}</span></p>
            )}
          </div>
          <div className="mt-6 space-y-3 text-sm">

  <p>
    <span className="font-semibold">Start point:</span>{" "}
    {reservations.trip?.startPoint ?? reservations.origin}
  </p>

  <p>
    <span className="font-semibold">Destination:</span>{" "}
    {reservations.trip?.endPoint ?? reservations.destination}
  </p>

  <p>
    <span className="font-semibold">Route:</span>{" "}
    {reservations.trip?.route || "N/A"}
  </p>

  <p>
    <span className="font-semibold">Available seats:</span>{" "}
    {reservations.trip?.availableSeats ?? reservations.availableSeats ?? reservations.seats ?? "N/A"}
  </p>

  <p>
    <span className="font-semibold">Departure time:</span>{" "}
    {reservations.trip?.departureTime
      ? new Date(reservations.trip.departureTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : new Date(reservations.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}
  </p>

</div>



          {/* Precio destacado */}
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mt-8 text-5xl font-extrabold"
          >
            ${reservations.trip?.price ?? reservations.price}
          </motion.p>
        </div>

        {/* ACCIONES */}
        <div className="mt-8">
          
          {/* DRIVER ACTIONS */}
          {isDriver && reservations.status === "pending" && (
            <>
            
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => onStatusChange(getId(reservations), "accepted")}
                className="w-full px-6 py-3 rounded-xl bg-white text-emerald-600 font-semibold mb-3 shadow"
              >
                Accept
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => onStatusChange(getId(reservations), "declined")}
                className="w-full px-6 py-3 rounded-xl bg-orange-400 font-semibold text-white shadow"
              >
                Decline
              </motion.button>
            </>
          )}

          {/* Passenger messages */}
          {isPassenger && reservations.status === "pending" && (
            <p className="text-center text-white/90 text-lg">
              Waiting for driver response...
            </p>
          )}

          {isPassenger && reservations.status === "accepted" && (
            <p className="text-center text-white text-lg font-bold">
              🎉 Driver accepted your reservation!
            </p>
          )}

          {isPassenger && reservations.status === "declined" && (
            <p className="text-center text-white text-lg font-bold">
              ❌ Driver declined your reservation.
            </p>
          )}

          {/* Confirmed message for driver */}
          {isDriver && reservations.status !== "pending" && (
            <p className="text-center text-white text-lg font-semibold">
              This reservation is {reservations.status}.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  </motion.aside>
)}
</AnimatePresence>
    </>
  );
}




export default function ReservationsPage() {
  const [active, setActive] = useState("activity");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user, token } = useAuth();

  /* ===========================================
     🔄 GET RESERVATIONS (Driver or Passenger)
  ============================================ */
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
        console.log("📦 Backend:", data);

        if (!res.ok) throw new Error(data.message || "Error fetching reservations");

        if (data.today || data.tomorrow) {
          setReservations({
            today: data.today ?? [],
            tomorrow: data.tomorrow ?? [],
          });
        } else {
          setReservations({ today: [], tomorrow: [] });
        }

      } catch (err) {
        console.error("❌ Error fetching reservations:", err);
        setError("Error fetching reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, token]);


  /* ===========================================
     🔄 UPDATE STATUS (Driver: accept / decline)
  ============================================ */
  const handleStatusChange = async (id, newStatus) => {
  if (!id) {
    console.error("❌ No ID provided to update status");
    return;
  }
  console.log("📌 Enviando update para ID:", id);

  try {
    const res = await fetch(`${API_URL}/reservations/status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();
    console.log("🔄 Status updated response:", data);

    if (!res.ok) {
      throw new Error(data.message || "Error updating reservation");
    }

    // 🔥 Actualiza hoy y mañana
    setReservations((prev) => ({
      today: prev.today.map((r) =>
        getId(r) === id ? { ...r, status: newStatus } : r
      ),
      tomorrow: prev.tomorrow.map((r) =>
        getId(r) === id ? { ...r, status: newStatus } : r
      ),
    }));

  } catch (err) {
    console.error("❌ Error updating status:", err);
  }
};
  const getId = (r) => r?._id || r?.id || r?.reservationId || null;


  /* ===========================================
     🔙 NAVIGATION
  ============================================ */
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


  /* ===========================================
     🎨 RENDER
  ============================================ */
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 md:p-8">
      
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 left-0 right-0 z-30 bg-white w-full h-16 border-b border-gray-200">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={handleBackClick}
            className="p-2 flex items-center justify-center h-10 w-10"
          >
            <BackIcon className="w-6 h-6 text-gray-800" />
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1">
            Reservations
          </h1>

          <div className="w-10 h-10" />
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="w-full max-w-6xl mt-6 px-4">

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : loading ? (
          <p className="text-gray-500 text-center">Loading reservations...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ===== TODAY ===== */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Today</h2>
              {reservations.today?.length > 0 ? (
                <div className="flex flex-col gap-4 items-center">
                  {reservations.today.map((res) => (
                    <ReservationsCard
                      key={res._id}
                      reservations={res}
                      currentUser={user}
                      onStatusChange={handleStatusChange}
                      getId={getId}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No rides for today</p>
              )}
            </div>

            {/* ===== TOMORROW ===== */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tomorrow</h2>
              {reservations.tomorrow?.length > 0 ? (
                <div className="flex flex-col gap-4 items-center">
                  {reservations.tomorrow.map((res) => (
                    <ReservationsCard
                      key={res._id}
                      reservations={res}
                      currentUser={user}
                      onStatusChange={handleStatusChange}
                      getId={getId}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No rides for tomorrow</p>
              )}
            </div>

          </div>
        )}
      </main>


      {/* ===== MOBILE FOOTER ===== */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 w-full z-30 bg-white border-t border-gray-200">
        <div className="w-full flex justify-center">
          <nav className="relative w-full max-w-[414px] h-[83px] flex items-start justify-center py-[5%] gap-[33px]">

            <button onClick={handleHomeClick} className="flex flex-col items-center gap-1">
              {HomeIcon({filled: active === "home"})}
              <span className={`text-sm font-medium ${active === "home" ? "text-black" : "text-gray-500"}`}>
                Home
              </span>
            </button>

            <button onClick={handleActivityClick} className="flex flex-col items-center gap-1">
              {ActivityIcon({filled: active === "activity"})}
              <span className={`text-sm font-medium ${active === "activity" ? "text-black" : "text-gray-500"}`}>
                Activity
              </span>
            </button>

            <button onClick={handleAccountClick} className="flex flex-col items-center gap-1">
              {AccountIcon({filled: active === "account"})}
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
