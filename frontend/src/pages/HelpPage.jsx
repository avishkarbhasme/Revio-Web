import React from 'react'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import Help from '../components/Support/Help'
import Chatbot from '../components/chatbot/Chatbot'

function HelpPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <Help/>
        <Chatbot/>
    </div>
  )
}

export default HelpPage