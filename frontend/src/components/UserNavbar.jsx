import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../utils/ThemeToggle";
import { LuLogOut } from "react-icons/lu";
import { formatTimeAgo, formatDuration } from "../utils/Helper";

const logoUrl = "https://res.cloudinary.com/dnifjcy7p/image/upload/v1760537821/REVIO_tmpvwl.png";

function UserNavbar() {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  let debounceTimer;

  useEffect(() => {
    clearTimeout(debounceTimer);
    if (!searchQuery.trim()) {
      setVideos([]);
      return;
    }

    debounceTimer = setTimeout(() => {
      fetchVideos(searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const fetchVideos = async (query) => {
    try {
      const res = await axios.get(
        `/api/v1/videos/getAllVideos?query=${encodeURIComponent(query)}`,
        { withCredentials: true }
      );

      const videoResults = res.data.data.docs || [];
      setVideos(videoResults);
    } catch (err) {
      console.error(err);
      setVideos([]);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      navigate("/", { replace: true });
    } catch (err) {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const res = await axios.get("/api/v1/users/current-user", { withCredentials: true });
        setAvatarUrl(res.data?.data?.avatar);
        setUsername(res.data?.data?.username);
      } catch {
        setAvatarUrl("");
        setUsername("");
      }
    }
    fetchUserDetails();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full dark:bg-black dark:text-gray-100 bg-pink-500 shadow-lg flex items-center px-4 h-16 z-50">
      {/* Logo and name */}
      <div
        onClick={() => navigate("/home")}
        className="flex cursor-pointer items-center space-x-2 w-1/4 min-w-[180px]"
      >
        <img src={logoUrl} alt="Revio Logo" className="w-15 h-15 object-contain" />
        <span className="text-2xl font-bold ml-2">REVIO</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 flex justify-center relative">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-black dark:border-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search Results Dropdown (Overlapping main content) */}
        {searchQuery && (
          <div className="absolute top-12 ml-27 left-0 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-[70vh] overflow-y-auto z-50">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div
                  key={video._id}
                  className="flex items-center justify-between gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {/* Left: Thumbnail + Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={video.thumbnail?.url || "https://via.placeholder.com/100x60"}
                      alt={video.title}
                      className="w-24 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        @{video.owner?.username} • {video.views} views
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {formatDuration(Math.round(video.duration * 100) / 100)} •{" "}
                        {formatTimeAgo(video.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Watch Now Button */}
                  <button
                    onClick={() => {
                      navigate(`/watchNow/v/${video._id}`);
                      setSearchQuery("");
                    }}
                    className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    Watch Now
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No videos found.</p>
            )}
          </div>
        )}
      </div>

      {/* Theme toggle + Profile */}
      <ThemeToggle />
      <div className="flex items-center w-1/4 justify-end relative" ref={dropdownRef}>
        <button
          className="flex items-center cursor-pointer focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          <img
            src={avatarUrl || "https://www.gravatar.com/avatar?d=mp"}
            alt="Profile"
            className="h-10 w-10 rounded-full border object-cover"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-60 w-44 dark:bg-pink-300 bg-cyan-300 text-black border rounded shadow-lg z-50">
            <Link
              to={`/home/my-profile/${username}`}
              className="block px-4 py-2 cursor-pointer text-black border-b hover:bg-gray-100"
            >
              My Profile
            </Link>
            <Link
              to="/home/dashboard"
              className="block px-4 py-2 text-black border-b hover:bg-gray-100"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-black border-b hover:bg-gray-100"
            >
              Settings
            </Link>
            <Link
              to="/home/help"
              className="block px-4 py-2 text-black border-b hover:bg-gray-100"
            >
              Help
            </Link>
            <button
              className="w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100 flex items-center justify-between"
              onClick={handleLogout}
            >
              Logout
              <LuLogOut />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default UserNavbar;
