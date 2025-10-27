import React from 'react'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import Report from '../components/Support/Report'
import Chatbot from '../components/chatbot/Chatbot'

function ReportPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <Report/>
        <Chatbot/>
    </div>
  )
}

export default ReportPage