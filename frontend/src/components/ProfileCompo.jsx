import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdImageNotSupported } from "react-icons/md";
import UserVideos from "../components/UserProfile/UserVideos.jsx";
import Playlist from "./Playlist/Playlist.jsx"; 
import UserTweets from "./UserProfile/UserTweets.jsx";
import UserSubscribed from "./UserProfile/UserSubscribed.jsx";

function ProfileCompo() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
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

  const handleSubscribeToggle = () => {
    if (!profile) return;
    const token = localStorage.getItem("token");
    setSubscribing(true);

    axios
      .get(`/api/v1/users/c/${username}?toggle=true`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setProfile(res.data.data))
      .catch((err) => {
        console.error("Subscription toggle failed", err);
      })
      .finally(() => setSubscribing(false));
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (!profile)
    return <div className="text-center text-red-500">Profile not found</div>;

  return (
    <main className="min-h-screen ml-64 pt-15 border max-sm:ml-0 max-sm:px-0">
      {/* Cover Image */}
      <div className="h-56 w-full bg-cover bg-center relative max-sm:h-56">
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
        <div className="absolute left-10 top-62 z-20 max-sm:left-1/2 max-sm:top-44 max-sm:-translate-x-1/2">
          <img
            src={profile.avatar || "/default-avatar.png"}
            alt={profile.username}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Channel Info */}
      <div className="bg-gray-900 px-10 py-8 mt-0 relative dark:bg-black flex flex-col md:flex-row items-center justify-between max-sm:px-5">
        <div className="md:ml-36 mt-8 md:mt-0 flex-1 text-center md:text-left">
          <h1 className="text-xl font-semibold text-white">{profile.fullName}</h1>
          <p className="text-lg text-gray-300">@{profile.username}</p>
          <p className="text-sm text-gray-400 mt-1">
            {profile.subcribersCount || 0} Subscribers {" • "}
            {profile.channelsSubscribedToCount || 0} Subscribed
          </p>
        </div>
        <button
          onClick={handleSubscribeToggle}
          disabled={subscribing}
          className={`px-5 py-2 rounded-lg font-medium mt-3 md:mt-0 shadow ${
            profile.isSubscribed
              ? "bg-red-500 text-white hover:bg-red-700"
              : "bg-purple-400 text-black hover:bg-purple-600 hover:text-white"
          }`}
        >
          {subscribing
            ? "Processing..."
            : profile.isSubscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 dark:bg-gray-900 w-full px-10 max-sm:px-5">
        <div className="flex flex-wrap justify-center space-x-10 border-b border-gray-700 max-sm:space-x-4">
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

        {/* Tab Content */}
        {activeTab === "videos" && <UserVideos username={username} />}
        {activeTab === "playlist" && <Playlist userId={profile._id} />}
        {activeTab === "tweets" && <UserTweets userId={profile._id} />}
        {activeTab === "subscribed" && (
          <UserSubscribed subscriberId={profile._id} />
        )}
      </div>
    </main>
  );
}

export default ProfileCompo;
