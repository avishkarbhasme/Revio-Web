import React from 'react'
import UserNavbar from "../components/UserNavbar.jsx"
import Sidebar from "../components/Sidebar.jsx"
import MyContent from '../components/MyContent/MyContent.jsx'
import Chatbot from '../components/chatbot/Chatbot.jsx'

function MyContentPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <div className="ml-0 md:ml-64 pt-16 mt-4 px-3 md:px-6 min-h-screen bg-gray-700 dark:bg-gray-900">
        <MyContent/>
        </div>
        <Chatbot/>
    </div>
  )
}

export default MyContentPage