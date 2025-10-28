import React from 'react'

import UserNavbar from "../components/UserNavbar.jsx";
import Sidebar from "../components/Sidebar.jsx"
import GetAllTweets from '../components/GetAllTweets ';
function AllTweetPage() {
  return (
    <div>
        <UserNavbar/>
        <Sidebar/>
        <div>
            <GetAllTweets/>
        </div>
    </div>
  )
}

export default AllTweetPage