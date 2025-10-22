import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./pages/start.jsx";
import SignUp from "./pages/SignUp";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/start" element={<Start />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
