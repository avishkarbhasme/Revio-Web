import React from 'react'
import WatchHistory from '../components/WatchHistory/WatchHistory'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'

function WatchHistoryPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <div className='ml-63 mt-15'>
            <WatchHistory/>
        </div>
       
    </div>
  )
}

export default WatchHistoryPage