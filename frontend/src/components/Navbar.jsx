import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../utils/ThemeToggle";


// Ensure you replace 'your-logo-url' with the actual image URL or import the logo if downloaded
const logoUrl = "https://res.cloudinary.com/dnifjcy7p/image/upload/v1760537821/REVIO_tmpvwl.png"; // or import logo

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed dark:bg-gray-800 dark:text-gray-100 top-0 left-0 w-full bg-white shadow-lg flex items-center px-4 h-16 z-50">
      
      {/* Logo on the left */}
      <div
       onClick={() => navigate("/")}
       className="flex cursor-pointer items-center space-x-2">
        <img src={logoUrl} alt="Revio Logo" className="w-15 h-15 object-contain" />
        
        {/* Website name "REVIO" */}
        <span className="text-xl font-bold ml-2">REVIO</span>
      </div>
     
      {/* Login/Signup buttons on the right */}
      <div className="absolute right-4 flex space-x-4">
        <div className="">
        <ThemeToggle/>
        </div>
        <button
         onClick={() => navigate("/login")} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">Login
        </button>
        <button
          onClick={() => navigate("/register")}
         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">Register</button>
      </div>
    </nav>
  );
}

export default Navbar;
