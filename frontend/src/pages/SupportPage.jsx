import React from 'react'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import Support from '../components/Support/Support.jsx'
import Chatbot from '../components/chatbot/Chatbot.jsx'

function SupportPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <Support/>
        <Chatbot/>
    </div>
  )
}

export default SupportPage