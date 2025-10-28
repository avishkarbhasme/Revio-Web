import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx"; // Your protected home page component
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Register from "./pages/Register.jsx";
import PublicHome from "./pages/PublicHome.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import WatchNowPage from "./pages/WatchNowPage.jsx";
import LikedPage from "./pages/LikedPage.jsx";
import WatchHistoryPage from "./pages/WatchHistoryPage.jsx";
import MyProfilePage from "./pages/MyProfilePage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import UserPlaylists from "./components/UserProfile/UserPlaylists.jsx";
import PlaylistDetails from "./components/Playlist/PlaylistDetails.jsx";
import MyContentPage from "./pages/MyContentPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import Setting from "./components/Support/Setting.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import AllTweetPage from "./pages/AllTweetPage.jsx";


function App() {


  return (
    <Router>
      <div >
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/profile/:username"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/my-profile/:username"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
          path="/home/all-tweets"
          element = {
            <ProtectedRoute>
              <AllTweetPage/>
            </ProtectedRoute>
          }/>

          <Route
            path="/home/my-profile/edit/:username"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watchNow/v/:videoId"
            element={
              <ProtectedRoute>
                <WatchNowPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/likeVideos"
            element={
              <ProtectedRoute>
                <LikedPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/watch-history"
            element={
              <ProtectedRoute>
                <WatchHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/my-content"
            element={
              <ProtectedRoute>
                <MyContentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/playlist/:playlistId"
            element={
              <ProtectedRoute>
                <PlaylistDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home/help"
            element={
              <ProtectedRoute>
                <HelpPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingPage />
              </ProtectedRoute>
            }
          />
        </Routes>

       
      </div>
    </Router>
  );
}

export default App;
