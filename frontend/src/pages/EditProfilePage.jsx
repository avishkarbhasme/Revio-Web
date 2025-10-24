import React from 'react'
import UserNavbar from '../components/UserNavbar'
import Sidebar from '../components/Sidebar'
import EditCompo from '../components/MyProfile/EditCompo.jsx'

function EditProfilePage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <EditCompo/>
    </div>
  )
}

export default EditProfilePage