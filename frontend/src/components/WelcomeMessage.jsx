import React from "react";
import { useNavigate } from "react-router-dom";
import NonAuthChatbot from "./chatbot/NonAuthChatbot";


function WelcomeMessage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl dark:bg-gray-800 dark:text-gray-100 mt-25 mb-10 mx-auto p-6 bg-white rounded shadow-lg text-center space-y-6">
     <div className="flex items-center mx-70  w-1/4 min-w-[180px]">
        
        <span className="text-5xl text-shadow-gray-800 font-extrabold  ml-3">REVIO</span>
      </div>
      <p className="text-lg leading-relaxed">
        Welcome to <span className=" font-bold text-blue-600">Revio</span> — your ultimate playground for video lovers! Dive into an ocean of awesome videos, curated just for you, with no boring livestreams in sight. Whether you’re here to binge-watch the latest hits, explore trending clips, or discover your new favorite creators, Revio is your go-to spot. You can even create your own channel and upload videos to share your passion with the world.
      </p>
      <p className="text-lg">
        If you already have an account, head to the{" "}
        <button
          onClick={() => navigate("/login")} 
          className="text-blue-600  font-semibold hover:underline cursor-pointer"
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
