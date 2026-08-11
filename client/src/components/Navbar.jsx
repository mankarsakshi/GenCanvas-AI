import React from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import "./Navbar.css";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="navbar">
      {/* ================================
          LEFT SIDE
      ================================= */}

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
        <div className="logo">
          <div className="logo-icon">
            <Sparkles size={17} />
          </div>

          <div className="logo-text">
            <span>GenCanvasAI</span>
            <small>AI Creative Studio</small>
          </div>
        </div>
      </div>

      {/* ================================
          SEARCH
      ================================= */}

      <div className="search-container">
        <Search size={17} className="search-icon" />

        <input
          type="text"
          placeholder="Search creations..."
          className="search"
        />
      </div>

      {/* ================================
          RIGHT SIDE
      ================================= */}

      <div className="nav-right">

        {/* Notification */}
        <button
          className="nav-icon-button"
          title="Notifications"
          type="button"
        >
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        {/* Profile */}
        <button
          className="profile-button"
          title="Profile"
          type="button"
        >
          <div className="profile-avatar">
            <User size={17} />
          </div>

          <div className="profile-details">
            <span className="profile-name">
              Sakshi
            </span>

            <span className="profile-role">
              Creator
            </span>
          </div>

          <ChevronDown
            size={15}
            className="profile-chevron"
          />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;