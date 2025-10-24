import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDuration, formatTimeAgo } from "../utils/Helper.js";
import { useNavigate, Link } from "react-router-dom";

function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest");

  const navigate = useNavigate();

  const fetchVideos = async (filterOption) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/videos/getAllVideos", {
        params: { page: 1, limit: 15, filter: filterOption },
      });
      setVideos(res.data.data.docs || []);
    } catch (err) {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(filter);
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading) return <div className="ml-64 mt-16 p-6">Loading...</div>;

  return (
    <main className="ml-64 mt-16 px-7 py-8 bg-zinc-600 dark:bg-gray-900 min-h-screen">
      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-end">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-100"
        >
          <option value="latest">Latest</option>
          <option value="6hr">Last 6 hours</option>
          <option value="12hr">Last 12 hours</option>
          <option value="1day">Last 1 day</option>
          <option value="7days">Last 7 days</option>
          <option value="1month">Last 1 month</option>
          <option value="6month">Last 6 months</option>
          <option value="1year">Last 1 year</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-200"
          >
            <img
              src={video.thumbnail?.url}
              alt={video.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center space-x-2 mb-1">
                <img
                  src={video.owner?.avatar}
                  alt={video.owner?.username}
                  className="w-7 h-7 rounded-full border object-cover"
                />
                <Link
                  to={`/home/profile/${video.owner?.username}`}
                  className="text-xs underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  @{video.owner?.username}
                </Link>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {video.views} views &bull; {formatTimeAgo(video.createdAt)} 
              </p>
              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-200 mb-3">
                {video.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {formatDuration(Math.round(video.duration * 100) / 100)}
                </span>
                <button
                  onClick={() => navigate(`/watchNow/v/${video._id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default VideoGrid;
