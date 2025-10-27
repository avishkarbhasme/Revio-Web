import React from 'react'
import Navbar from '../components/Navbar'
import WelcomeMessage from '../components/WelcomeMessage'
import Footer from '../components/Footer'
import ProfileCompo from '../components/ProfileCompo'
import NonAuthChatbot from '../components/chatbot/NonAuthChatbot'

function PublicHome() {
  return (
    <>
    <div className=''>
    <Navbar/>
    <WelcomeMessage/>
    <NonAuthChatbot/>
    <Footer/>
    </div>
    </>
  )
}

export default PublicHome