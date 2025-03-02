import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice"; 
import "./Sidebar.css";

const Sidebar = ({ isOpen, onItemClick }) => {
  const { user } = useSelector((state) => state.auth); 
  const dispatch = useDispatch();

  const menuItems = [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Home", path: "/" },
    { name: "Job Listings", path: "/job-listings" },
    { name: "My Applications", path: "/my-applications" },
    { name: "CDC Trainings", path: "/cdc-trainings" },
    { name: "Notifications", path: "/notifications" },
  ];

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      <nav className="sidebar-nav">
        <ul className="menu-list">
          <li className="user-info">
            <p>Hi, {user?.fullName || "User"} 👋</p>
          </li>

          {/* Sidebar Menu */}
          {menuItems.map((item) => (
            <li key={item.name} className="menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onItemClick}
              >
                {item.name}
              </NavLink>
            </li>
          ))}

          {/* Logout Button */}
          <li className="menu-item logout">
            <button className="logout-btn"
              onClick={() => {
                dispatch(logout()); 
                window.location.href = "/authContainer"; 
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
