import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../utils/ThemeToggle";

// Logo URL
const logoUrl = "https://res.cloudinary.com/dnifjcy7p/image/upload/v1760537821/REVIO_tmpvwl.png";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed dark:bg-gray-800 dark:text-gray-100 top-0 left-0 w-full bg-white shadow-lg flex items-center px-4 h-16 z-50">
      
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer items-center space-x-2"
      >
        <img src={logoUrl} alt="Revio Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold ml-2">REVIO</span>
      </div>

      {/* Desktop buttons */}
      <div className="ml-auto hidden md:flex items-center space-x-4">
        <ThemeToggle />
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
        >
          Register
        </button>
      </div>

      {/* Mobile hamburger */}
      <div className="ml-auto md:hidden flex items-center">
        <ThemeToggle />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-2 flex flex-col justify-center w-8 h-8 space-y-1.5 focus:outline-none"
        >
          <span className={`block h-1 w-full bg-gray-800 dark:bg-gray-100 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-1 w-full bg-gray-800 dark:bg-gray-100 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-1 w-full bg-gray-800 dark:bg-gray-100 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 flex flex-col space-y-2 w-40 z-50">
          <button
            onClick={() => { navigate("/login"); setMenuOpen(false); }}
            className="px-4 py-2 text-left text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Login
          </button>
          <button
            onClick={() => { navigate("/register"); setMenuOpen(false); }}
            className="px-4 py-2 text-left text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
