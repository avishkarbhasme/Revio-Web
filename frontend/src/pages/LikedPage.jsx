import React from 'react'
import LikedVideos from '../components/Like/LikedVideos'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import Chatbot from '../components/chatbot/Chatbot'

function LikedPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <div className='ml-63 mt-15'>
            <LikedVideos/>
        </div>
        <Chatbot/>
    </div>
  )
}

export default LikedPage