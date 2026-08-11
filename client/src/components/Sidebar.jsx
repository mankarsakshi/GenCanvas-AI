
import {
  LayoutDashboard,
  Sparkles,
  Images,
  Heart,
  History,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import "./Sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {

  return (

    <aside
      className={`sidebar ${
        sidebarOpen ? "sidebar-open" : ""
      }`}
    >

      {/* Sidebar Header */}

      <div className="sidebar-header">

        <h2>AI Studio</h2>

        <button
          onClick={() => setSidebarOpen(false)}
          className="close-sidebar"
        >
          <X size={20} />
        </button>

      </div>


      {/* Menu */}

      <div className="sidebar-menu">

        <a href="/dashboard">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>


        <a href="/create-post">
          <Sparkles size={20} />
          <span>Generate Image</span>
        </a>


        <a href="/gallery">
          <Images size={20} />
          <span>Gallery</span>
        </a>


        <a href="/favorites">
          <Heart size={20} />
          <span>Favorites</span>
        </a>


        <a href="/history">
          <History size={20} />
          <span>History</span>
        </a>


        <a href="/profile">
          <User size={20} />
          <span>Profile</span>
        </a>


        <a href="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </a>

      </div>


      {/* Logout */}

      <div className="sidebar-bottom">

        <button>
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </aside>

  );
}

export default Sidebar;

