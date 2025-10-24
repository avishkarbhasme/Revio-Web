import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { formatDuration } from "../../utils/Helper";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`/api/v1/playlist/${playlistId}`, {
          withCredentials: true,
        });
        setPlaylist(res.data.data);
      } catch (err) {
        console.error("Error fetching playlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  if (!playlist)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-400">
        <div className="text-xl font-medium">Playlist not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {playlist.name}
        </h1>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl">
          {playlist.description}
        </p>

        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-100">
          Videos
        </h2>
        {playlist.videos?.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlist.videos.map((video) => (
              <li
                key={video._id}
                className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail?.url || "/default-thumbnail.png"}
                    alt={video.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
                      {formatDuration(Math.round(video.duration * 100) / 100)}
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <p className="font-semibold text-lg text-white line-clamp-2">
                    {video.title}
                  </p>

                  {/* Creator info */}
                  {video.owner && (
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      {video.owner.avatar?.url && (
                        <img
                          src={video.owner.avatar.url}
                          alt={video.owner.username}
                          className="w-8 h-8 rounded-full border border-gray-600"
                        />
                      )}
                      <span className="hover:text-blue-400 transition-colors">
                        @{video.owner.username}
                      </span>
                    </div>
                  )}

                  {/* Views and time */}
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>{video.views ?? 0} Views</span>
                    <span>
                      {video.createdAt
                        ? new Date(video.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {/* Watch Now Button */}
                  <Link
                    to={`/watchNow/v/${video._id}`}
                    className="mt-4 inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                  >
                    Watch Video
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-lg">No videos added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails;