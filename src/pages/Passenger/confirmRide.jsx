// ConfirmRide.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ArrowLeft, Ticket, CreditCardIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";


const API_URL = import.meta.env.VITE_API_BASE_URL;
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function ConfirmRide() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const { user, token } = useAuth();
  const [fullUser, setFullUser] = useState(user);
  const [seats, setSeats] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!state || !state.trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No trip data received. Go back to search.</p>
      </div>
    );
  }

  const trip = state.trip;
  const maxAvailable = trip.seats ?? 1;
  async function fetchRealRoute(start, end) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes?.length) return null;

  return data.routes[0].geometry.coordinates;
}


  // MAP INIT
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const start = trip.startCoords;
    const end = trip.endCoords;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: end || start,
      zoom: 11,
    });

    mapRef.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    mapRef.current.on("load", async () => {
      if (start && end) {
    const realRoute = await fetchRealRoute(start, end);
    if (!realRoute) return;

        mapRef.current.addSource("route", {
        type: "geojson",
        data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] }
        }
        });


        mapRef.current.addLayer({
          id: "routeLine",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#FBBF24", "line-width": 5 },
        });
        let progress = 0;

        function animateLine() {
        if (progress > realRoute.length) return;

        const partial = {
            type: "Feature",
            geometry: {
            type: "LineString",
            coordinates: realRoute.slice(0, progress),
            },
        };

        mapRef.current.getSource("route").setData(partial);

        progress++;
        requestAnimationFrame(animateLine);
        }

        animateLine();

        new mapboxgl.Marker({ color: "#10B981" })
          .setLngLat(start)
          .setPopup(new mapboxgl.Popup().setText("Start"))
          .addTo(mapRef.current);

        new mapboxgl.Marker({ color: "#EF4444" })
          .setLngLat(end)
          .setPopup(new mapboxgl.Popup().setText("End"))
          .addTo(mapRef.current);

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(start);
        bounds.extend(end);
        mapRef.current.fitBounds(bounds, { padding: 60 });
      }
    });

    return () => mapRef.current?.remove();
    
}, []);
useEffect(() => {
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setFullUser(data);          // 🔥 AQUÍ SE SOLUCIONA EL NOMBRE
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  fetchUser();
}, [token]);

  const decrease = () => setSeats((s) => Math.max(1, s - 1));
  const increase = () => setSeats((s) => Math.min(maxAvailable, s + 1));

  const priceTotal = (trip.price || 0) * seats;

  const handleBook = async () => {
  setErrorMsg("");
  setLoading(true);

  if (!token) {
    navigate("/login");
    return;
  }

  const payload = {
    trip: trip._id,
    passenger: fullUser?._id,
    driver: trip.driver?._id || trip.driverId,
    seats,
    note,
    origin: trip.startPoint,
    destination: trip.endPoint,
    date: trip.departureTime,
    price: trip.price
  };

  console.log("📤 ENVIANDO RESERVA AL BACKEND:", payload);

  try {
    const res = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("📥 RESPUESTA DEL BACKEND:", data);

    if (!res.ok) {
      setErrorMsg(data.message || "Error creating reservation");
      return;
    }

    navigate("/reservations");
  } catch (err) {
    console.error("❌ ERROR FETCH:", err);
    setErrorMsg("Error creating reservation");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">

      {/* HEADER — SAME AS CREATE TRIP */}
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto relative mb-10">
        
        <button className="relative left-0" onClick={() => navigate(-1)}>
          <ArrowLeft size={32} className="text-black" />
        </button>

        <h1 className="font-extrabold text-5xl md:text-6xl text-gray-900">
          Confirm Ride
        </h1>

        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg text-gray-800">
            {fullUser?.name || "Wheeler"}
          </span>

          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
            {fullUser?.photo ? (
              <img
                src={fullUser.photo}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-400" />
            )}
          </div>
        </div>
      </header>

      {/* GRID 50/50 */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* LEFT — INFO CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 relative">

          <div className="text-center mt-6">
            <div className="text-gray-400 text-7xl font-bold">
              {new Date(trip.departureTime).toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div className="mt-4 flex justify-center items-center gap-6">
              <div className="w-64 h-40 rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={
                    trip.car?.image ||
                    trip.driver?.photo ||
                    "https://via.placeholder.com/360x200"
                  }
                  alt="Car"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-left">
                <div className="text-xl font-bold">{trip.startPoint}</div>
                <div className="text-sm text-gray-500 mt-1">{trip.endPoint}</div>

                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={trip.driver?.photo}
                    alt={trip.driver?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm text-gray-500">Driver</div>
                    <div className="font-semibold">{trip.driver?.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 grid grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-sm text-gray-500">Seats available</div>
              <div className="text-2xl font-bold">{maxAvailable}</div>
            </div>

        <div className="flex items-center justify-end gap-6">

            {/* Change Destination */}
            <button
                onClick={() => navigate("/searchRide")}
                className="flex flex-col items-center"
            >
                            <div className="w-14 h-14 border-2 border-gray-800 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="w-7 h-7 text-gray-800" strokeWidth={2.5} />
            </div>

            <span className="mt-2 text-gray-800 text-sm font-medium">
                Change Destination
            </span>
            </button>

            {/* More Offers */}
            <button
            onClick={() =>
                navigate("/seeOffers", { state: { query: trip.endPoint } })
            }
            className="flex flex-col items-center"
            >
            <div className="w-14 h-14 border-2 border-gray-800 rounded-xl flex items-center justify-center">
                <Ticket className="w-7 h-7 text-gray-800" strokeWidth={2.5} />
            </div>

            <span className="mt-2 text-gray-800 text-sm font-medium">
                More offers
            </span>
            </button>
        </div>
        </div>


          {/* Note */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Note for driver</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Indica dónde recogerme"
              className="w-full mt-2 p-3 border rounded-lg resize-none"
              rows={3}
            />
          </div>

          {/* Book section */}
          <div className="mt-8 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total</div>
              <div className="text-3xl font-extrabold text-gray-900">
                ${priceTotal}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={decrease}
                  className="w-10 h-10 rounded-lg bg-gray-100 font-bold"
                >
                  -
                </button>
                <div className="text-xl font-semibold w-12 text-center">
                  {seats}
                </div>
                <button
                  onClick={increase}
                  className="w-10 h-10 rounded-lg bg-gray-100 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleBook}
                disabled={loading}
                className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Booking..." : "Book now"}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 text-sm text-red-600">{errorMsg}</div>
          )}
        </div>

        {/* RIGHT — MAP */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
        </div>
      </div>
    </div>
  );
}
