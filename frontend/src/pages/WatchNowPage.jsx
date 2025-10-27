import React from 'react'
import UserNavbar from "../components/UserNavbar.jsx"
import Sidebar from '../components/Sidebar.jsx'
import VideoPlayer from "../components/video/VideoPlayer.jsx"
import Chatbot from '../components/chatbot/Chatbot.jsx'

function WatchNowPage() {
  return (
    <div className='bg-gray-400'>
        <UserNavbar/>
        <Sidebar/>
        <div className='mt-15 ml-66'>
            <VideoPlayer/>
        </div>
        <Chatbot/>
    </div>
  )
}

export default WatchNowPage