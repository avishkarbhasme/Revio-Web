import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "../components/UserNavbar.jsx"
import Sidebar from "../components/Sidebar.jsx"
import VideoGrid from "../components/VideoGrid.jsx";
import Chatbot from "../components/chatbot/Chatbot.jsx";




function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await axios.get("/api/v1/users/current-user", { withCredentials: true });
      } catch {
        navigate("/", { replace: true }); // Redirect if not authenticated
      }
    };
    verifyAuth();
  }, [navigate]);

  return <>
  <div className="dark:bg-gray-200  ">
  <UserNavbar/>
  <Sidebar/>
  <VideoGrid/>
  <Chatbot/>
  
  </div>
  </>
  ;
}

export default Home;
