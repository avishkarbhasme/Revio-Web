import React from 'react'
import UserNavbar from '../components/UserNavbar.jsx'
import Dashboard from '../components/Dashboard.jsx'
import Chatbot from '../components/chatbot/Chatbot.jsx'

function DashboardPage() {
  return (
    <div className="relative min-h-screen">
        <UserNavbar/>
        <Dashboard/>
        <Chatbot />
    </div>
  )
}

export default DashboardPage