import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineLike } from "react-icons/ai";

const UserVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('/api/v1/dashboard/videos', { withCredentials: true });
        setVideos(response.data.data || []); // Safely access nested data, default to empty array
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch videos');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-black bg-gray-900 min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">Channel Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div 
            key={video._id} 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={video.thumbnail.url} 
              alt={video.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center mb-2">
                <h2 className="text-lg font-semibold text-white">{video.title}</h2>
              </div>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{video.description}</p>
              <div className="flex justify-between items-center text-gray-400 text-sm">
                <span>
                  {new Date(video.createdAt.year, video.createdAt.month - 1, video.createdAt.day).toLocaleDateString()}
                </span>
                <span className='border-pink-400 border'>{video.likesCount} {video.likesCount === 1 ? 'Like' : 'Likes'}</span>
              </div>
              {video.isPublished ? (
                <Link 
                  to={`/watchNow/v/${video._id}`} 
                  className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Watch Video
                </Link>
              ) : (
                <span className="mt-3 inline-block text-yellow-400">Unpublished</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserVideos;