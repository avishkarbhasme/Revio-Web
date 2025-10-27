import React from 'react'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import Setting from '../components/Support/Setting'
import Chatbot from '../components/chatbot/Chatbot'

function SettingPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <Setting/>
        <Chatbot/>
    </div>
  )
}

export default SettingPage