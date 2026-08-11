import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
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
import "./page/Dashboard.css";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /*
  =========================================================
  SHARED SIDEBAR ITEM
  =========================================================
  */

  const sidebarItemClass = ({ isActive }) =>
    `sidebar-item ${isActive ? "active" : ""}`;


  /*
  =========================================================
  APP
  =========================================================
  */

  return (
    <BrowserRouter>

      {/* =====================================================
          AUTH PAGES
          No Navbar / Sidebar
      ===================================================== */}

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

      </Routes>


      {/* =====================================================
          MAIN APPLICATION
          Navbar + Sidebar + Pages
      ===================================================== */}

      <div className="dashboard-app">

        {/* ===================================================
            SHARED NAVBAR
        =================================================== */}

        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />


        {/* ===================================================
            DASHBOARD LAYOUT
        =================================================== */}

        <div className="dashboard-layout">


          {/* =================================================
              SHARED SIDEBAR
          ================================================= */}

          <aside
            className={`dashboard-sidebar ${
              sidebarOpen
                ? "sidebar-open"
                : "sidebar-closed"
            }`}
          >

            {/* ================= MENU ================= */}

            <div className="sidebar-menu">


              {/* Dashboard */}

              <NavLink
                to="/dashboard"
                className={sidebarItemClass}
              >
                <ImageIcon size={19} />

                {sidebarOpen && (
                  <span>
                    Dashboard
                  </span>
                )}
              </NavLink>


              {/* Create */}

              <NavLink
                to="/create-post"
                className={sidebarItemClass}
              >
                <Sparkles size={19} />

                {sidebarOpen && (
                  <span>
                    Create
                  </span>
                )}
              </NavLink>


              {/* Gallery */}

              <NavLink
                to="/gallery"
                className={sidebarItemClass}
              >
                <ImageIcon size={19} />

                {sidebarOpen && (
                  <span>
                    Gallery
                  </span>
                )}
              </NavLink>


              {/* Favorites */}

              <NavLink
                to="/favorites"
                className={sidebarItemClass}
              >
                <Heart size={19} />

                {sidebarOpen && (
                  <span>
                    Favorites
                  </span>
                )}
              </NavLink>


              {/* History */}

              <NavLink
                to="/history"
                className={sidebarItemClass}
              >
                <History size={19} />

                {sidebarOpen && (
                  <span>
                    History
                  </span>
                )}
              </NavLink>


              {/* Explore */}

              <NavLink
                to="/explore"
                className={sidebarItemClass}
              >
                <Search size={19} />

                {sidebarOpen && (
                  <span>
                    Explore
                  </span>
                )}
              </NavLink>


              {/* Divider */}

              <div className="sidebar-divider"></div>


              {/* Profile */}

              <NavLink
                to="/profile"
                className={sidebarItemClass}
              >

                <div className="sidebar-avatar">
                  <User size={17} />
                </div>

                {sidebarOpen && (
                  <span>
                    Profile
                  </span>
                )}

              </NavLink>


              {/* Settings */}

              <NavLink
                to="/settings"
                className={sidebarItemClass}
              >
                <Settings size={19} />

                {sidebarOpen && (
                  <span>
                    Settings
                  </span>
                )}
              </NavLink>

            </div>


            {/* =================================================
                LOGOUT
            ================================================= */}

            <button
              className="sidebar-logout"
              type="button"
              onClick={() => {
                console.log("Logout clicked");
              }}
            >

              <LogOut size={19} />

              {sidebarOpen && (
                <span>
                  Logout
                </span>
              )}

            </button>

          </aside>


          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <main className="dashboard-content">

            <Routes>

              {/* Dashboard */}

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />


              {/* Create */}

              <Route
                path="/create-post"
                element={<CreatePost />}
              />


              {/* Gallery */}

              <Route
                path="/gallery"
                element={<Gallery />}
              />


              {/* Favorites */}

              <Route
                path="/favorites"
                element={<Favorites />}
              />


              {/* History */}

              <Route
                path="/history"
                element={<HistoryPage />}
              />


              {/* Profile */}

              <Route
                path="/profile"
                element={<Profile />}
              />


              {/* Settings */}

              <Route
                path="/settings"
                element={<SettingsPage />}
              />


              {/* Explore */}

              <Route
                path="/explore"
                element={<Gallery />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;