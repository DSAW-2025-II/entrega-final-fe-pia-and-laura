import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Start from "./pages/Start";
import LogIn from "./pages/LogIn";
import DriverSignIn from "./pages/DriverSignIn";
import PassengerSignIn from "./pages/PassengerSignIn";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Redirección de la raíz "/" hacia "/start" */}
        <Route path="/" element={<Navigate to="/start" replace />} />

        {/* 🔹 Rutas principales */}
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/driverSignIn" element={<DriverSignIn />} />
        <Route path="/passengerSignIn" element={<PassengerSignIn />} />

        {/* 🔹 Página por defecto si no hay coincidencia */}
        <Route path="*" element={<Navigate to="/start" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
