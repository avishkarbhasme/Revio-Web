import React from 'react'
import Sidebar from '../components/Sidebar'
import PersonalProfile from '../components/MyProfile/PersonalProfile'
import UserNavbar from '../components/UserNavbar'
import Chatbot from '../components/chatbot/Chatbot'

function ProfilePage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <PersonalProfile/>
        <Chatbot/>
    </div>
  )
}

export default ProfilePage
