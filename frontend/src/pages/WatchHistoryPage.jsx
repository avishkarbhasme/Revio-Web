import React from 'react'
import WatchHistory from '../components/WatchHistory/WatchHistory'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import Chatbot from '../components/chatbot/Chatbot'

function WatchHistoryPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <div className="ml-0 md:ml-64 pt-16 mt-4 px-3 md:px-6 min-h-screen bg-gray-700 dark:bg-gray-900">
            <WatchHistory/>
        </div>
       <Chatbot/>
    </div>
  )
}

export default WatchHistoryPage