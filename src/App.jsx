import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Start from "./pages/start";
import LogIn from "./pages/LogIn.jsx";
import DriverSignIn from "./pages/SignIn/DriverSignIn.jsx";
import PassengerSignIn from "./pages/SignIn/PassengerSignIn.jsx";
import ProtectedRoute from "./pages/components/protectedRoute.jsx";
import DriverHome from "./pages/Home/driverHome.jsx";
import PassengerHome from "./pages/Home/passengerHome.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import CarSignIn from "./pages/SignIn/CarSignIn.jsx";
import ReservationsPage from "./pages/Driver/reservations.jsx";
import Settings from "./pages/Driver/settings.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/start" replace />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/driverSignIn" element={<DriverSignIn />} />
        <Route path="/passengerSignIn" element={<PassengerSignIn />} />
        <Route path="/CarSignIn" element={<CarSignIn />} />
        <Route path="/driverHome" element={<DriverHome />} />
        <Route path="/passengerHome" element={<ProtectedRoute><PassengerHome /></ProtectedRoute>} />
        <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute allowedRoles={["driver", "passenger"]}><ReservationsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
