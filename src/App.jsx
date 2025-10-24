import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./pages/start.jsx";
import LogIn from "./pages/LogIn.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PassengerSignIn from "./pages/SignIn/PassengerSignIn.jsx";
import DriverSignIn from "./pages/SignIn/DriverSignIn.jsx";
import CarSignIn from "./pages/SignIn/CarSignIn.jsx";
import PassengerHome from "./pages/Home/passengerHome.jsx";
import DriverHome from "./pages/Home/driverHome.jsx";
import ProtectedRoute from "./pages/components/protectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/start" replace />} />
        <Route path="/start" element={<Start />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/passengerSignIn" element={<PassengerSignIn />} />
        <Route path="/driverSignIn" element={<DriverSignIn />} />
        <Route path="/CarSignIn" element={<CarSignIn />} />

        {/* Rutas protegidas */}
        
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute allowedRoles={["passenger", "driver"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passengerHome"
          element={
            <ProtectedRoute allowedRoles={["passenger"]}>
              <PassengerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driverHome"
          element={
            <ProtectedRoute allowedRoles={["driver"]}>
              <DriverHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
