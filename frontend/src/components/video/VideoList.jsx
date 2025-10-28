import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDuration, formatTimeAgo } from "../../utils/Helper.js";
import { useNavigate, Link } from "react-router-dom";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/v1/videos/getAllVideos", { params: { page: 1, limit: 15 } })
      .then((res) => setVideos(res.data.data.docs || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-gray-300 text-center mt-8">Loading videos...</div>
    );

  return (
    <main className="bg-transparent dark:bg-gray-900 py-4 w-full overflow-x-hidden">
      <div className="flex flex-col gap-3 w-full max-w-[400px] mx-auto md:max-w-full">
        {videos.map((video) => (
          <div
            key={video._id}
            className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 w-full"
          >
            {/* --- Thumbnail --- */}
            <img
              src={video.thumbnail?.url}
              alt={video.title}
              className="w-full sm:w-48 h-48 sm:h-32 object-cover"
            />

            {/* --- Video Content --- */}
            <div className="flex flex-col justify-between p-3 flex-1">
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                  {video.title}
                </h3>

                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="w-7 h-7 rounded-full border"
                  />
                  <Link
                    to={`/home/profile/${video.owner?.username}`}
                    className="text-xs underline text-gray-700 dark:text-gray-300"
                  >
                    @{video.owner?.username}
                  </Link>
                </div>

                <p className="text-xs text-gray-500 mb-1">
                  {video.views} views • {formatTimeAgo(video.createdAt)}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-200 line-clamp-2">
                  {video.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {formatDuration(Math.round(video.duration * 100) / 100)}
                </span>
                <button
                  onClick={() => navigate(`/watchNow/v/${video._id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
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
