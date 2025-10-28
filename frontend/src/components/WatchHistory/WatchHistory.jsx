import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDuration, formatTimeAgo } from "../../utils/Helper.js";

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("latest"); // default filter
  const navigate = useNavigate();

  const fetchWatchHistory = async (selectedFilter = "latest") => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/users/watch-history?filter=${selectedFilter}`, {
        withCredentials: true,
      });
      setVideos(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch watch history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchHistory(filter);
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading watch history...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-20">{error}</p>;
  }

  if (videos.length === 0) {
    return <p className="text-center text-red-400 mt-20 text-xl sm:text-4xl">No watch history found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-700 dark:bg-gray-900 py-6 px-2 sm:px-6 w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
        Watch History
      </h1>

      {/* Filter Dropdown */}
      <div className="flex justify-end mb-6">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 w-full">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-200 w-full"
          >
            <img
              src={video.thumbnail?.url}
              alt={video.title}
              className="w-full h-36 sm:h-44 md:h-48 object-cover"
            />
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-md sm:text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center space-x-2 mb-1">
                <img
                  src={video.owner?.avatar}
                  alt={video.owner?.username}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border object-cover"
                />
                <Link
                  to={`/home/profile/${video.owner?.username}`}
                  className="text-xs sm:text-sm underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  @{video.owner?.username}
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                {video.views} views &bull; {formatTimeAgo(video.createdAt)}
              </p>
              <p className="line-clamp-2 text-sm sm:text-base text-gray-600 dark:text-gray-200 mb-3">
                {video.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {formatDuration(Math.round(video.duration * 100) / 100)}
                </span>
                <button
                  onClick={() => navigate(`/watchNow/v/${video._id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
                >
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
