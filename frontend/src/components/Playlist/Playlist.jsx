import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatDuration } from "../../utils/Helper";

const Playlist = ({ userId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUserPlaylists = async () => {
      try {
        const res = await axios.get(`/api/v1/playlist/u/${userId}`, {
          withCredentials: true,
        });
        setPlaylists(res.data.data || []);
      } catch (err) {
        console.error("Error fetching user playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlaylists();
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );

  if (!playlists || playlists.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-400">
        <div className="text-xl font-medium">No playlists found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center md:text-left">
          User Playlists
        </h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={
                    playlist.thumbnail?.url ||
                    "/default-thumbnail.png"
                  }
                  alt={playlist.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
                  {playlist.totalVideos ??
                            playlist.videosCount ??
                            playlist.videos?.length ??
                            0}{" "}
                          {(playlist.totalVideos ??
                          playlist.videosCount ??
                          playlist.videos?.length ??
                          0) === 1
                            ? "Video"
                            : "Videos"}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <p className="font-semibold text-lg text-white line-clamp-2">
                  {playlist.name}
                </p>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {playlist.description || "No description available"}
                </p>

                {/* Video Previews */}
                {playlist.videos && playlist.videos.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {playlist.videos.slice(0, 2).map((video) => (
                      <div
                        key={video._id}
                        className="flex items-center justify-between text-gray-500 text-sm"
                      >
                        <span className="truncate">{video.title}</span>
                        {video.duration && (
                          <span>
                            {formatDuration(
                              Math.round(video.duration * 100) / 100
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* View Playlist Button */}
                <Link
                  to={`/playlist/${playlist._id}`}
                  className="mt-4 inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                >
                  View Playlist
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Playlist;
