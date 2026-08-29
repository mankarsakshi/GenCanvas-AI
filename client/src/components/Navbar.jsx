import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const displayName = user?.name || "Creator";
  const displayEmail = user?.email || "creator@gencanvas.ai";

  return (
    <nav className="navbar">
      {/* LEFT SIDE */}
      <div className="navbar-left">
        {/* Sidebar Toggle */}
        <button
          className="menu-button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          title={sidebarOpen ? "Close Menu" : "Open Menu"}
          type="button"
        >
          {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo" style={{ textDecoration: "none" }}>
          <div className="logo-icon">
            <Sparkles size={17} />
          </div>
          <div className="logo-text">
            <span>GenCanvasAI</span>
            <small>AI Creative Studio</small>
          </div>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <Search size={17} className="search-icon" />
        <input
          type="text"
          placeholder="Search creations..."
          className="search"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        {/* Notification */}
        <button
          className="nav-icon-button"
          title="Notifications"
          type="button"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        {/* Profile with Dropdown */}
        <div className="profile-container" ref={dropdownRef}>
          <button
            className="profile-button"
            title="User Menu"
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="profile-avatar">
              <User size={17} />
            </div>

            <div className="profile-details">
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">Creator</span>
            </div>

            <ChevronDown
              size={15}
              className="profile-chevron"
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <span className="dropdown-user-name">{displayName}</span>
                <span className="dropdown-user-email">{displayEmail}</span>
              </div>

              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <User size={15} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>

              <button
                type="button"
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;