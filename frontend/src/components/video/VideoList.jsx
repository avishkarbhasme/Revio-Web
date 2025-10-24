import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDuration, formatTimeAgo } from "../../utils/Helper.js";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function VideoList() {
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/v1/videos/getAllVideos", { params: { page: 1, limit: 15 } })
      .then((res) => {
        setVideos(res.data.data.docs || []);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ml-64 mt-16 p-6">Loading...</div>;

  return (
<main className="bg-gray-500 dark:bg-gray-900 mt-0 py-8">
  {/* Container wraps cards tightly */}
  <div className="flex flex-col p-2 gap-[3px] w-110">
    {videos.map((video) => (
      <div
        key={video._id}
        className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
      >
        {/* Thumbnail */}
        <img
          src={video.thumbnail?.url}
          alt={video.title}
          className="w-56 h-45 object-cover"
        />
        {/* Video content */}
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center space-x-2 mb-1">
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username}
                className="w-7 h-7 rounded-full border"
              />
              <Link
                to={`/home/profile/${video.owner?.username}`}
                onClick={() => setSearchQuery("")}
                className="text-xs underline text-gray-700 dark:text-gray-300"
              >
               @{video.owner?.username}
              </Link>
              
            </div>
            <p className="text-xs text-gray-500 mb-2">
              {video.views} Views &bull; {formatTimeAgo(video.createdAt)}
            </p>
            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-200 mb-3">
              {video.description}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {formatDuration(Math.round(video.duration * 100) / 100)}
            </span>
            <button
              className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
               onClick={() => navigate(`/watchNow/v/${video._id}`)}
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

export default VideoList;
