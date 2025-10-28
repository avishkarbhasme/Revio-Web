import React from 'react';
import LikedVideos from '../components/Like/LikedVideos';
import UserNavbar from '../components/UserNavbar';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/chatbot/Chatbot';

function LikedPage() {
  return (
    <div>
      <UserNavbar />
      <Sidebar />
      {/* Responsive main container: ml-0 on small, ml-64 on md+; pt-16 for navbar */}
      <div className="ml-0 md:ml-64 pt-16 mt-4 px-3 md:px-6 min-h-screen bg-gray-700 dark:bg-gray-900">
        <LikedVideos />
      </div>
      <Chatbot />
    </div>
  );
}

export default LikedPage;
