import React from 'react'
import Sidebar from '../components/Sidebar'
import ProfileCompo from '../components/ProfileCompo'
import UserNavbar from '../components/UserNavbar'

function ProfilePage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <ProfileCompo/>
    </div>
  )
}

export default ProfilePage
