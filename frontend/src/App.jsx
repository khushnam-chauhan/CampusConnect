import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthContainer from "./pages/loginPage/AuthContainer";
import Login from "./pages/loginPage/Login";
import Signup from "./pages/loginPage/Register";
import Navbar from "./layouts/Navbar";

function App() {
  return (
    <Router> 
    <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/authContainer" element={<AuthContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
