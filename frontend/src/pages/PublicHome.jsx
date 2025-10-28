import React from 'react';
import Navbar from '../components/Navbar';
import WelcomeMessage from '../components/WelcomeMessage';
import Footer from '../components/Footer';
import NonAuthChatbot from '../components/chatbot/NonAuthChatbot';

function PublicHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow relative">
        <WelcomeMessage />
        <NonAuthChatbot />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PublicHome;
