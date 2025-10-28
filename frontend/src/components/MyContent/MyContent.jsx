import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatDuration, formatTimeAgo } from "../../utils/Helper.js";

const MyContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/api/v1/dashboard/videos", { withCredentials: true });
        setVideos(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl font-semibold animate-pulse">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400 text-xl font-medium">
        {error}
      </div>
    );

  if (videos.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-xl font-medium">
        <p className="mb-4">No videos uploaded</p>
        <p className="max-w-md text-center text-gray-400">
          You haven't uploaded any videos yet. Start creating content!
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-700 dark:bg-gray-900 px-4 md:px-8 lg:px-16 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">My Content</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-200 w-full"
          >
            <img
              src={video.thumbnail?.url || "/default-thumbnail.png"}
              alt={video.title}
              className="w-full h-44 sm:h-48 md:h-56 object-cover"
            />
            <div className="p-3 sm:p-4 flex flex-col space-y-2">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                {video.views} views &bull; {formatTimeAgo(video.createdAt)}
              </p>
              <p className="line-clamp-2 text-sm sm:text-base text-gray-600 dark:text-gray-200 mb-3">
                {video.description}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {formatDuration(Math.round(video.duration * 100) / 100)}
                </span>
                <Link
                  to={`/watchNow/v/${video._id}`}
                  className="flex-shrink-0 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Watch Video
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyContent;
