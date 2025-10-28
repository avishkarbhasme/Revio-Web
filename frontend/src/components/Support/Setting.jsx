import React from "react";
import ThemeToggle from "../../utils/ThemeToggle.jsx";

function Setting() {
  return (
    <div className="min-h-screen mt-15 bg-gray-700 dark:bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

        {/* Theme Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg">Theme</span>
          <div className="text-black">
            <ThemeToggle />
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <p>
            <span className="font-medium">Email:</span>{" "}
            <a href="mailto:timepasstalkies12@gmail.com" className="underline hover:text-purple-400">
              timepasstalkies12@gmail.com
            </a>
          </p>
          <p>
            <span className="font-medium">Phone:</span> 738555418
          </p>
        </div>

        {/* Other Settings */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Other Settings</h2>
          <p className="text-gray-400 underline">More settings coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default Setting;
