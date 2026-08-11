
import "./Navbar.css";
import { Menu, X } from "lucide-react";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        ✨ AI Studio
      </div>


      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="search"
      />


      {/* Right Side */}
      <div className="nav-right">

        {/* Sidebar Button */}
        <button
          className="menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Menu"
        >
          {sidebarOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

      </div>

    </nav>
  );
}

export default Navbar;

