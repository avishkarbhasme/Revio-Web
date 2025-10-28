import React from "react";
import UserNavbar from "../components/UserNavbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import VideoPlayer from "../components/video/VideoPlayer.jsx";
import Chatbot from "../components/chatbot/Chatbot.jsx";

function WatchNowPage() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <UserNavbar />

      {/* Main layout */}
      <div className="flex flex-1 w-full">
        {/* Sidebar (Left) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content + Right Sidebar */}
        <main className="flex-1 flex flex-col md:flex-row px-2 sm:px-4 md:px-6 py-4 gap-4 md:gap-6">
          
          {/* Video Player - MAXIMIZED WIDTH */}
          <div className="flex-1 md:w-4/5 lg:w-5/6 xl:w-[90%]">
            <VideoPlayer />
          </div>

          {/* Right Sidebar - Slim & Scrollable */}
          
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default WatchNowPage;