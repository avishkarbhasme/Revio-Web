import React from 'react'
import Sidebar from '../components/Sidebar'
import ProfileCompo from '../components/ProfileCompo'
import UserNavbar from '../components/UserNavbar'
import Chatbot from '../components/chatbot/Chatbot'

function ProfilePage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <ProfileCompo/>
        <Chatbot/>
    </div>
  )
}

export default ProfilePage
