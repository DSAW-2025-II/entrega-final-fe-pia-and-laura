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
import reservationssPage from "./pages/Driver/reservationss.jsx";
import Settings from "./pages/Driver/settings.jsx";
import CarSettings from "./pages/Driver/carSettings.jsx";
import CreateTrip from "./pages/Driver/createTrip.jsx";
import SeeOffers from "./pages/Passenger/seeOffers.jsx";
import SearchRide from "./pages/Passenger/SearchRide.jsx";
import ConfirmRide from "./pages/Passenger/confirmRide.jsx";
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
        <Route path="/driverHome" element={<ProtectedRoute allowedRoles={["driver"]}><DriverHome /></ProtectedRoute>} />
        <Route path="/passengerHome" element={<ProtectedRoute><PassengerHome /></ProtectedRoute>} />
        <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/reservationss" element={<ProtectedRoute ><reservationssPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/carSettings" element={<ProtectedRoute allowedRoles={["driver"]}><CarSettings /></ProtectedRoute>} />
        <Route path="/createTrip" element={<ProtectedRoute allowedRoles={["driver"]}><CreateTrip /></ProtectedRoute>} />
        <Route path="/seeOffers" element={<ProtectedRoute><SeeOffers /></ProtectedRoute>} />
        <Route path="/searchRide" element={<ProtectedRoute><SearchRide /></ProtectedRoute>} />
        <Route path="/confirmRide" element={<ProtectedRoute><ConfirmRide /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
