import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Image as ImageIcon,
  Sparkles,
  Heart,
  History,
  Search,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import { Home, CreatePost } from "./page";
import Signup from "./page/Signup";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import Profile from "./page/Profile";
import Gallery from "./page/Gallery";
import Favorites from "./page/Favorites";
import HistoryPage from "./page/History";
import SettingsPage from "./page/Settings";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./page/Dashboard.css";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const sidebarItemClass = ({ isActive }) =>
    `sidebar-item ${isActive ? "active" : ""}`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-app">
      {/* NAVBAR */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside
          className={`dashboard-sidebar ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <div className="sidebar-menu">
            <NavLink to="/dashboard" className={sidebarItemClass}>
              <ImageIcon size={19} />
              {sidebarOpen && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/create-post" className={sidebarItemClass}>
              <Sparkles size={19} />
              {sidebarOpen && <span>Create</span>}
            </NavLink>

            <NavLink to="/gallery" className={sidebarItemClass}>
              <ImageIcon size={19} />
              {sidebarOpen && <span>Gallery</span>}
            </NavLink>

            <NavLink to="/favorites" className={sidebarItemClass}>
              <Heart size={19} />
              {sidebarOpen && <span>Favorites</span>}
            </NavLink>

            <NavLink to="/history" className={sidebarItemClass}>
              <History size={19} />
              {sidebarOpen && <span>History</span>}
            </NavLink>

            <NavLink to="/explore" className={sidebarItemClass}>
              <Search size={19} />
              {sidebarOpen && <span>Explore</span>}
            </NavLink>

            <div className="sidebar-divider" />

            <NavLink to="/profile" className={sidebarItemClass}>
              <div className="sidebar-avatar">
                <User size={17} />
              </div>
              {sidebarOpen && <span>Profile</span>}
            </NavLink>

            <NavLink to="/settings" className={sidebarItemClass}>
              <Settings size={19} />
              {sidebarOpen && <span>Settings</span>}
            </NavLink>
          </div>

          {/* LOGOUT */}
          <button
            className="sidebar-logout"
            type="button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={19} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </aside>

        {/* PAGE CONTENT */}
        <main className="dashboard-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/explore" element={<Gallery />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* LANDING PAGE */}
            <Route path="/" element={<Home />} />

            {/* AUTH PAGES */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* PROTECTED MAIN APPLICATION */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;