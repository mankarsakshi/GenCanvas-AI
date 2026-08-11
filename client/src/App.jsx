
// // export default App;
// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// import {
//   Menu,
//   X,
//   Home as HomeIcon,
//   Sparkles,
//   Images,
//   Heart,
//   History as HistoryIcon,
//   User,
//   Settings as SettingsIcon,
//   LogOut,
//   Search,
// } from "lucide-react";

// import { logo } from "./assets";
// import { Home, CreatePost } from "./page";

// import Signup from "./page/Signup";
// import Login from "./page/Login";
// import Dashboard from "./page/Dashboard";
// import Profile from "./page/Profile";
// import Gallery from "./page/Gallery";
// import Favorites from "./page/Favorites";
// import History from "./page/History";
// import Settings from "./page/Settings";

// const App = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   return (
//     <BrowserRouter>
//       {/* =====================================================
//           TOP NAVBAR
//       ===================================================== */}

//       <header className="fixed left-0 top-0 z-50 flex h-[73px] w-full items-center justify-between border-b border-gray-200 bg-white px-5">
//         {/* LOGO */}
//         <div className="flex items-center gap-2">
//           <Link
//             to="/"
//             onClick={closeSidebar}
//             className="flex items-center gap-2"
//           >
//             <img
//               src={logo}
//               alt="AI Studio"
//               className="h-8 w-8 object-contain"
//             />

//             <span className="text-xl font-bold">
//               AI Studio
//             </span>
//           </Link>
//         </div>

//         {/* SEARCH */}
//         <div className="hidden w-[400px] items-center rounded-lg bg-gray-100 px-4 md:flex">
//           <Search
//             size={20}
//             className="text-gray-500"
//           />

//           <input
//             type="text"
//             placeholder="Search images..."
//             className="w-full bg-transparent px-3 py-2 text-sm outline-none"
//           />
//         </div>

//         {/* MENU BUTTON */}
//         <div className="flex items-center">
//           <button
//             onClick={() =>
//               setSidebarOpen((prev) => !prev)
//             }
//             className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-100 hover:text-[#6469ff]"
//             title="Menu"
//           >
//             {sidebarOpen ? (
//               <X size={25} />
//             ) : (
//               <Menu size={25} />
//             )}
//           </button>
//         </div>
//       </header>

//       {/* =====================================================
//           RIGHT SIDEBAR
//       ===================================================== */}

//       <aside
//         className={`fixed right-0 top-[73px] z-40 h-[calc(100vh-73px)] w-[270px] border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out ${sidebarOpen
//             ? "translate-x-0"
//             : "translate-x-full"
//           }`}
//       >
//         {/* SIDEBAR HEADER */}

//         <div className="flex items-center justify-between border-b px-5 py-5">
//           <div className="flex items-center gap-2">
//             <img
//               src={logo}
//               alt="AI Studio"
//               className="h-7 w-7 object-contain"
//             />

//             <span className="text-lg font-bold">
//               AI Studio
//             </span>
//           </div>

//           <button
//             onClick={closeSidebar}
//             className="rounded-lg p-2 hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* SIDEBAR MENU */}

//         <nav className="flex flex-col gap-1 p-3">
//           {/* Dashboard */}

//           <Link
//             to="/dashboard"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
//           >
//             <HomeIcon size={20} />
//             <span>Dashboard</span>
//           </Link>

//           {/* Generate Image */}

//           <Link
//             to="/create-post"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
//           >
//             <Sparkles size={20} />
//             <span>Generate Image</span>
//           </Link>

//           {/* Gallery */}

//           <Link
//             to="/gallery"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
//           >
//             <Images size={20} />
//             <span>Gallery</span>
//           </Link>

//           {/* Favorites */}

//           <Link
//             to="/favorites"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
//           >
//             <Heart size={20} />
//             <span>Favorites</span>
//           </Link>

//           {/* History */}

//           <Link
//             to="/history"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
//           >
//             <HistoryIcon size={20} />
//             <span>History</span>
//           </Link>

//           {/* Profile */}

//           <Link
//             to="/profile"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
//           >
//             <User size={20} />
//             <span>Profile</span>
//           </Link>

//           {/* Settings */}

//           <Link
//             to="/settings"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
//           >
//             <SettingsIcon size={20} />
//             <span>Settings</span>
//           </Link>
//         </nav>

//         {/* LOGOUT */}

//         <div className="absolute bottom-0 left-0 w-full border-t p-3">
//           <button
//             onClick={() => {
//               console.log("Logout clicked");
//               closeSidebar();
//             }}
//             className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-500 transition hover:bg-red-50"
//           >
//             <LogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* =====================================================
//           DARK OVERLAY
//       ===================================================== */}

//       {sidebarOpen && (
//         <div
//           onClick={closeSidebar}
//           className="fixed inset-0 z-30 bg-black/20"
//         />
//       )}

//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}

//       <main className="min-h-screen bg-[#f9fafe] pt-[73px]">
//         <div className="w-full px-4 py-8 sm:p-8">
//           <Routes>
//             {/* HOME */}

//             <Route
//               path="/"
//               element={<Home />}
//             />

//             {/* GENERATE IMAGE */}

//             <Route
//               path="/create-post"
//               element={<CreatePost />}
//             />

//             {/* SIGNUP */}

//             <Route
//               path="/signup"
//               element={<Signup />}
//             />

//             {/* LOGIN */}

//             <Route
//               path="/login"
//               element={<Login />}
//             />

//             {/* DASHBOARD */}

//             <Route
//               path="/dashboard"
//               element={<Dashboard />}
//             />

//             {/* GALLERY */}

//             <Route
//               path="/gallery"
//               element={<Gallery />}
//             />

//             {/* FAVORITES */}

//             <Route
//               path="/favorites"
//               element={<Favorites />}
//             />

//             {/* HISTORY */}

//             <Route
//               path="/history"
//               element={<History />}
//             />

//             {/* PROFILE */}

//             <Route
//               path="/profile"
//               element={<Profile />}
//             />

//             {/* SETTINGS */}

//             <Route
//               path="/settings"
//               element={<Settings />}
//             />

//             {/* FALLBACK */}

//             <Route
//               path="*"
//               element={<Home />}
//             />
//           </Routes>
//         </div>
//       </main>
//     </BrowserRouter>
//   );
// };

// export default App;




import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import {
  Menu,
  X,
  Home as HomeIcon,
  Sparkles,
  Images,
  Heart,
  History as HistoryIcon,
  User,
  Settings as SettingsIcon,
  LogOut,
  Search,
} from "lucide-react";

import { logo } from "./assets";
import { Home, CreatePost } from "./page";

import Signup from "./page/Signup";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import Profile from "./page/Profile";
import Gallery from "./page/Gallery";
import Favorites from "./page/Favorites";
import History from "./page/History";
import Settings from "./page/Settings";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <header className="fixed left-0 top-0 z-50 flex h-[73px] w-full items-center justify-between border-b border-gray-200 bg-white px-5">

        {/* ================= LOGO ================= */}

        <div className="flex items-center gap-2">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2"
          >
            <img
              src={logo}
              alt="AI Studio"
              className="h-8 w-8 object-contain"
            />

            <span className="text-xl font-bold">
              AI Studio
            </span>
          </Link>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="hidden w-[400px] items-center rounded-lg bg-gray-100 px-4 md:flex">
          <Search
            size={20}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search images..."
            className="w-full bg-transparent px-3 py-2 text-sm outline-none"
          />
        </div>

        {/* ================= LOGIN + MENU ================= */}

        <div className="flex items-center gap-3">

          {/* LOGIN BUTTON */}

          <Link
            to="/login"
            onClick={closeSidebar}
            className="rounded-lg bg-[#6469ff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5358e8]"
          >
            Login
          </Link>

          {/* MENU BUTTON */}

          <button
            onClick={() =>
              setSidebarOpen((prev) => !prev)
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-100 hover:text-[#6469ff]"
            title="Menu"
          >
            {sidebarOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>
      </header>


      {/* =====================================================
          RIGHT SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed right-0 top-[73px] z-40 h-[calc(100vh-73px)] w-[270px] border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* ================= SIDEBAR HEADER ================= */}

        <div className="flex items-center justify-between border-b px-5 py-5">

          <div className="flex items-center gap-2">

            <img
              src={logo}
              alt="AI Studio"
              className="h-7 w-7 object-contain"
            />

            <span className="text-lg font-bold">
              AI Studio
            </span>

          </div>

          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>


        {/* ================= SIDEBAR MENU ================= */}

        <nav className="flex flex-col gap-1 p-3">

          {/* Dashboard */}

          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
          >
            <HomeIcon size={20} />
            <span>Dashboard</span>
          </Link>


          {/* Generate Image */}

          <Link
            to="/create-post"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
          >
            <Sparkles size={20} />
            <span>Generate Image</span>
          </Link>


          {/* Gallery */}

          <Link
            to="/gallery"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
          >
            <Images size={20} />
            <span>Gallery</span>
          </Link>


          {/* Favorites */}

          <Link
            to="/favorites"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
          >
            <Heart size={20} />
            <span>Favorites</span>
          </Link>


          {/* History */}

          <Link
            to="/history"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
          >
            <HistoryIcon size={20} />
            <span>History</span>
          </Link>


          {/* Profile */}

          <Link
            to="/profile"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>


          {/* Settings */}

          <Link
            to="/settings"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-[#eef0ff] hover:text-[#6469ff]"
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>

        </nav>


        {/* ================= LOGIN IN SIDEBAR ================= */}

        <div className="absolute bottom-0 left-0 w-full border-t p-3">

          <Link
            to="/login"
            onClick={closeSidebar}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#6469ff] transition hover:bg-[#eef0ff]"
          >
            <User size={20} />

            <span>
              Login
            </span>
          </Link>

        </div>

      </aside>


      {/* =====================================================
          DARK OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/20"
        />
      )}


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="min-h-screen bg-[#f9fafe] pt-[73px]">

        <div className="w-full px-4 py-8 sm:p-8">

          <Routes>

            {/* ================= HOME ================= */}

            <Route
              path="/"
              element={<Home />}
            />


            {/* ================= LOGIN ================= */}

            <Route
              path="/login"
              element={<Login />}
            />


            {/* ================= SIGNUP ================= */}

            <Route
              path="/signup"
              element={<Signup />}
            />


            {/* ================= DASHBOARD ================= */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* ================= GENERATE IMAGE ================= */}

            <Route
              path="/create-post"
              element={<CreatePost />}
            />


            {/* ================= GALLERY ================= */}

            <Route
              path="/gallery"
              element={<Gallery />}
            />


            {/* ================= FAVORITES ================= */}

            <Route
              path="/favorites"
              element={<Favorites />}
            />


            {/* ================= HISTORY ================= */}

            <Route
              path="/history"
              element={<History />}
            />


            {/* ================= PROFILE ================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />


            {/* ================= SETTINGS ================= */}

            <Route
              path="/settings"
              element={<Settings />}
            />


            {/* ================= FALLBACK ================= */}

            <Route
              path="*"
              element={<Home />}
            />

          </Routes>

        </div>

      </main>

    </BrowserRouter>
  );
};

export default App;