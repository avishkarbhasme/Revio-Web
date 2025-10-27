import React from 'react'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import EditCompo from '../components/MyProfile/EditCompo.jsx'
import Chatbot from '../components/chatbot/Chatbot.jsx'

function EditProfilePage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <EditCompo/>
        <Chatbot/>
    </div>
  )
}

export default EditProfilePage