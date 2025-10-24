import React from 'react';
import { FaHome, FaThumbsUp, FaHistory, FaVideo, FaFolderOpen, FaUser, FaQuestionCircle, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdOutlineBugReport } from "react-icons/md";


const Sidebar = () => {
  const navigate = useNavigate(); // must be inside BrowserRouter

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <aside className="fixed dark:bg-black top-16 left-0 bg-gray-900 p-4 border border-gray-700 min-h-[calc(100vh-64px)] w-64 flex flex-col justify-between">
      <div>
        <SidebarItem icon={<FaHome />} label="Home" onClick={() => handleNavigate('/home')} />
        <SidebarItem icon={<FaThumbsUp />} label="Liked Videos" onClick={() => handleNavigate('/home/likeVideos')} />
        <SidebarItem icon={<FaHistory />} label="History" onClick={() => handleNavigate('/home/watch-history')} />
        <SidebarItem icon={<FaVideo />} label="My Content" onClick={() => handleNavigate('/home/my-content')} />

      </div>
      <div>
        <SidebarItem icon={<MdOutlineBugReport />} label="Report" onClick={() => handleNavigate('/report')} />
        <SidebarItem icon={<FaQuestionCircle />} label="Support" onClick={() => handleNavigate('/support')} />
        <SidebarItem icon={<FaCog />} label="Settings" onClick={() => handleNavigate('/settings')} />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-4 py-2 mb-3 border border-gray-200 rounded text-white dark:hover:bg-purple-800 hover:bg-gray-800 transition-colors duration-200"
  >
    <span className="mr-3 text-lg">{icon}</span>
    <span className="text-md">{label}</span>
  </button>
);

export default Sidebar;
