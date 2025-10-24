import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { formatDuration,formatTimeAgo } from '../../utils/Helper';

const MyContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/api/v1/dashboard/videos', { withCredentials: true });
        setVideos(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);


  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl font-semibold animate-pulse">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400 text-xl font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-12 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          My Content
        </h1>
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-2xl font-semibold text-white mb-4">No videos uploaded</p>
            <p className="text-gray-400 text-center max-w-md">
              You haven't uploaded any videos yet. Start creating content!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-200"
              >
                <img
                  src={video.thumbnail?.url || '/default-thumbnail.png'}
                  alt={video.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  
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
                    <Link
                    to={`/watchNow/v/${video._id}`}
                    className="mt-4 inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                  >
                    Watch Video
                  </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContent;