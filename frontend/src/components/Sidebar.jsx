import React, { useState } from "react";
import { FaHome, FaThumbsUp, FaHistory, FaVideo, FaUsers, FaQuestionCircle, FaCog, FaBars } from "react-icons/fa";
import { MdOutlineBugReport } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="sm:hidden fixed top-16 left-2 z-50 p-2 bg-gray-900 text-white rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open sidebar"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-64 max-w-full p-4 border border-gray-700 bg-gray-900 dark:bg-black flex flex-col justify-between 
          transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:block`}
      >
        {/* Top section */}
        <div>
          <SidebarItem icon={<FaHome />} label="Home" onClick={() => handleNavigate("/home")} />
          <SidebarItem icon={<FaThumbsUp />} label="Liked Videos" onClick={() => handleNavigate("/home/likeVideos")} />
          <SidebarItem icon={<FaHistory />} label="History" onClick={() => handleNavigate("/home/watch-history")} />
          <SidebarItem icon={<FaVideo />} label="My Content" onClick={() => handleNavigate("/home/my-content")} />
          {/* New Sidebar Item */}
          <SidebarItem icon={<FaUsers />} label="All Tweets" onClick={() => handleNavigate("/home/all-tweets")} />
        </div>

        {/* Bottom section - ALWAYS at bottom */}
        <div>
          <SidebarItem icon={<MdOutlineBugReport />} label="Report" onClick={() => handleNavigate("/report")} />
          <SidebarItem icon={<FaQuestionCircle />} label="Support" onClick={() => handleNavigate("/support")} />
          <SidebarItem icon={<FaCog />} label="Settings" onClick={() => handleNavigate("/settings")} />
        </div>
      </aside>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 sm:hidden transition-opacity duration-300 ${
          isOpen ? "block" : "hidden"
        } z-30`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
};

const SidebarItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-4 py-2 mb-3 border border-gray-200 rounded text-white cursor-pointer dark:hover:bg-purple-800 hover:bg-gray-800 transition-colors duration-200"
  >
    <span className="mr-3 text-lg">{icon}</span>
    <span className="text-md">{label}</span>
  </button>
);

export default Sidebar;
