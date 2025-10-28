import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDuration, formatTimeAgo } from "../../utils/Helper.js";

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest"); // default filter
  const navigate = useNavigate();

  const fetchLikedVideos = async (filterOption = "latest") => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/likes/videos?filter=${filterOption}`, {
        withCredentials: true,
      });
      setVideos(res.data.data || []);
    } catch (err) {
      console.error("Error fetching liked videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedVideos(filter);
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-20">Loading videos...</p>;

  if (!videos.length)
    return (
      <p className="text-center mt-40 text-4xl text-red-400">
        You haven’t liked any videos yet.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-700 dark:bg-gray-900 py-6 px-2 sm:px-5  w-full"> {/* changed px for mobile */}
      <h1 className="text-2xl sm:text-3xl text-white font-bold dark:text-white mb-6 text-center">
        Your Liked Videos
      </h1>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-end">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-100"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 w-full">
        {videos.map((item) => {
          const video = item.likedVideo || item;
          return (
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
                    src={video.ownerDetails?.avatar}
                    alt={video.ownerDetails?.username || video.owner?.username}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border object-cover"
                  />
                  <Link
                    to={`/home/profile/${video.ownerDetails?.username || video.owner?.username}`}
                    className="text-xs sm:text-sm underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    @{video.ownerDetails?.username || video.owner?.username}
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  {video.views} views • {formatTimeAgo(video.createdAt)}
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
          );
        })}
      </div>
    </div>
  );
};

export default LikedVideos;
