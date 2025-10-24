import React from 'react'
import UserNavbar from "../components/UserNavbar.jsx"
import Sidebar from "../components/Sidebar.jsx"
import MyContent from '../components/MyContent/MyContent.jsx'

function MyContentPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <div className='ml-63 mt-15'
        ><MyContent/></div>
        
    </div>
  )
}

export default MyContentPage