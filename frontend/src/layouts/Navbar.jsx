import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to='/' className="log">
        <h1 className="logo-head">
          Campus<span className="logoColor">Connect</span>
        </h1>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="#">
          <button className="nav-btn">About</button>
        </Link>
        <Link to="/authContainer">
          <button className="nav-btn">Sign In</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
