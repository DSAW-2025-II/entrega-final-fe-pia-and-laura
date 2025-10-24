import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import start from "./pages/start.jsx";
import LogIn from "./pages/LogIn.jsx";
import DriverSignIn from "./pages/SignIn/DriverSignIn.jsx";
import PassengerSignIn from "./pages/SignIn/PassengerSignIn.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/start" replace />} />
        <Route path="/start" element={<start />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/driverSignIn" element={<DriverSignIn />} />
        <Route path="/passengerSignIn" element={<PassengerSignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
