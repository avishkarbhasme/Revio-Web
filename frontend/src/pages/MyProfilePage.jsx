import React from 'react'
import Sidebar from '../components/Sidebar'
import PersonalProfile from '../components/MyProfile/PersonalProfile'
import UserNavbar from '../components/UserNavbar'

function ProfilePage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <PersonalProfile/>
    </div>
  )
}

export default ProfilePage
