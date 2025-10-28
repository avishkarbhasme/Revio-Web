import React from "react";
import { useNavigate } from "react-router-dom";

function WelcomeMessage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl dark:bg-gray-800 dark:text-gray-100 mt-20 mb-10 mx-4 sm:mx-auto p-6 bg-white rounded shadow-lg text-center space-y-6">
      <div className="flex justify-center items-center">
        <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100">REVIO</span>
      </div>

      <p className="text-base sm:text-lg leading-relaxed px-2 sm:px-0">
        Welcome to <span className="font-bold text-blue-600">Revio</span> — your ultimate playground for video lovers! Dive into an ocean of awesome videos, curated just for you, with no boring livestreams in sight. Whether you’re here to binge-watch the latest hits, explore trending clips, or discover your new favorite creators, Revio is your go-to spot. You can even create your own channel and upload videos to share your passion with the world.
      </p>

      <p className="text-base sm:text-lg px-2 sm:px-0">
        If you already have an account, head to the{" "}
        <button
          onClick={() => navigate("/login")} 
          className="text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          Login
        </button>{" "}
        option at the top right, or if you’re new here, click{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-green-600 font-semibold hover:underline cursor-pointer"
        >
          Register
        </button>{" "}
        and join the fun! Grab some popcorn, get comfy, and let the good times roll!
      </p>
    </div>
  );
}

export default WelcomeMessage;
