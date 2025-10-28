import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { MdImageNotSupported } from "react-icons/md";
import UserVideos from "../UserProfile/UserVideos.jsx";
import UserPlaylists from "../UserProfile/UserPlaylists.jsx";
import UserTweets from "../UserProfile/UserTweets.jsx";
import UserSubscribed from "../UserProfile/UserSubscribed.jsx";

function PersonalProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`/api/v1/users/c/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setProfile(res.data.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (!profile) return <div className="text-center text-red-500">Profile not found</div>;

  return (
    // 👇 Only change: make full width on small screens
    <main className="min-h-screen border pt-15 ml-0 md:ml-64">
      {/* Cover Image */}
      <div className="h-56 w-full bg-cover bg-center relative">
        {profile.coverImage ? (
          <div
            className="h-56 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.coverImage})` }}
          />
        ) : (
          <div className="h-56 w-full flex items-center justify-center bg-gray-200">
            <MdImageNotSupported size={48} color="#888" />
          </div>
        )}

        {/* Avatar */}
        <div className="absolute left-10 max-sm:left-1/2 max-sm:top-44 max-sm:-translate-x-1/2 top-62 z-20">
          <img
            src={profile.avatar || "/default-avatar.png"}
            alt={profile.username}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Channel Info Card */}
      <div className="bg-gray-900 px-10 py-8 mt-0 relative dark:bg-black flex flex-col md:flex-row items-center justify-between">
        <div className="md:ml-36 mt-8 md:mt-0 flex-1 text-center md:text-left">
          <h1 className="text-xl font-semibold text-white">{profile.fullName}</h1>
          <p className="text-lg text-gray-300">@{profile.username}</p>
          <p className="text-sm text-gray-400 mt-1">
            {profile.subcribersCount || 0} Subscribers {" • "}
            {profile.channelsSubscribedToCount || 0} Subscribed
          </p>
        </div>

        <Link
          to={`/home/my-profile/edit/${username}`}
          className="px-5 py-2 rounded-lg font-medium mt-3 md:mt-0 shadow bg-purple-400 text-black hover:bg-purple-600 hover:text-white"
        >
          Edit Profile
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 dark:bg-gray-900 w-full px-6 md:px-10">
        <div className="flex flex-wrap md:flex-nowrap space-x-6 md:space-x-10 border-b border-gray-700 overflow-x-auto">
          <button
            className={`py-3 font-semibold ${
              activeTab === "videos"
                ? "text-purple-300 border-b-2 border-purple-300"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`py-3 font-semibold ${
              activeTab === "playlist"
                ? "text-purple-300 border-b-2 border-purple-300"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("playlist")}
          >
            Playlist
          </button>
          <button
            className={`py-3 font-semibold ${
              activeTab === "tweets"
                ? "text-purple-300 border-b-2 border-purple-300"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("tweets")}
          >
            Tweets
          </button>
          <button
            className={`py-3 font-semibold ${
              activeTab === "subscribed"
                ? "text-purple-300 border-b-2 border-purple-300"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("subscribed")}
          >
            Subscribed
          </button>
        </div>

        {/* Conditionally Render Content Based on Active Tab */}
        {activeTab === "videos" && <UserVideos username={username} />}
        {activeTab === "playlist" && <UserPlaylists userId={profile._id} />}
        {activeTab === "tweets" && <UserTweets userId={profile._id} />}
        {activeTab === "subscribed" && <UserSubscribed subscriberId={profile._id} />}
      </div>
    </main>
  );
}

export default PersonalProfile;
