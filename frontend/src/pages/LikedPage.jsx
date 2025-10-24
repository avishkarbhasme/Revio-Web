import React from 'react'
import LikedVideos from '../components/Like/LikedVideos'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'

function LikedPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <div className='ml-63 mt-15'>
            <LikedVideos/>
        </div>
        
    </div>
  )
}

export default LikedPage