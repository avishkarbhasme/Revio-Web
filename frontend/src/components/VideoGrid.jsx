import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDuration, formatTimeAgo } from "../utils/Helper.js";
import { useNavigate, Link } from "react-router-dom";

function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const limit = 15;

  const fetchVideos = async (filterOption, pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/videos/getAllVideos", {
        params: { page: pageNumber, limit, filter: filterOption },
      });
      setVideos(res.data.data.docs || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      setVideos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(filter, page);
  }, [filter, page]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading)
    return (
      <div className="ml-0 md:ml-64 mt-16 p-6 text-center w-full">Loading...</div>
    );

  return (
    <main className="ml-0 md:ml-64 mt-16 px-4 sm:px-7 py-8 bg-zinc-600 dark:bg-gray-900 min-h-screen">
      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-center md:justify-end">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-gray-100 text-sm sm:text-base"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-200"
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

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center items-center mt-8 gap-2 sm:gap-3">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-40 transition"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            } transition`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-40 transition"
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default VideoGrid;
