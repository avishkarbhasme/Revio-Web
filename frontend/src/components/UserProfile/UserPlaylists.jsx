import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserPlaylists = ({ userId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("UserPlaylists userId:", userId);
        if (!userId) {
          setError("No user ID provided");
          setLoading(false);
          return;
        }

        // ✅ Fetch playlists
        const playlistResponse = await axios.get(`/api/v1/playlist/u/${userId}`, {
          withCredentials: true,
        });
        console.log("Playlists response:", playlistResponse.data);
        const playlistData = Array.isArray(playlistResponse.data.data)
          ? playlistResponse.data.data
          : [];
        setPlaylists(playlistData);

        // ✅ Fetch videos (for adding to playlists)
        const videoResponse = await axios.get("/api/v1/dashboard/videos", {
          withCredentials: true,
        });
        console.log("Videos response:", videoResponse.data);
        const videoData = Array.isArray(videoResponse.data.data)
          ? videoResponse.data.data
          : Array.isArray(videoResponse.data.data?.videos)
          ? videoResponse.data.data.videos
          : [];
        setVideos(videoData);

        setLoading(false);
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Failed to fetch data";
        setError(message);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ✅ Create playlist
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/v1/playlist/create",
        {
          name: newPlaylist.name,
          description: newPlaylist.description,
        },
        { withCredentials: true }
      );
      setPlaylists([...playlists, response.data.data]);
      setNewPlaylist({ name: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    }
  };

  // ✅ Update playlist
  const handleUpdatePlaylist = async (playlistId) => {
    try {
      if (!editingPlaylist.name) {
        setError("Playlist name is required");
        return;
      }
      const response = await axios.patch(
        `/api/v1/playlist/${playlistId}`,
        {
          name: editingPlaylist.name,
          description: editingPlaylist.description,
        },
        { withCredentials: true }
      );
      setPlaylists(
        playlists.map((p) =>
          p._id === playlistId ? { ...p, ...response.data.data } : p
        )
      );
      setEditingPlaylist(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update playlist");
    }
  };

  // ✅ Delete playlist
  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/v1/playlist/${playlistId}`, {
        withCredentials: true,
      });
      setPlaylists(playlists.filter((p) => p._id !== playlistId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete playlist");
    }
  };

  // ✅ Add video to playlist
  const handleAddVideo = async (videoId, playlistId) => {
    try {
      if (!videoId || !playlistId) {
        setError("Please select a video and playlist");
        return;
      }
      setAddLoading(true);
      await axios.patch(`/api/v1/playlist/add/${videoId}/${playlistId}`, {}, { withCredentials: true });
      setPlaylists(
        playlists.map((p) =>
          p._id === playlistId
            ? { ...p, videos: [...(p.videos || []), videoId], videosCount: (p.videosCount || 0) + 1 }
            : p
        )
      );
      setSelectedVideo("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add video to playlist");
    } finally {
      setAddLoading(false);
    }
  };

  // ✅ Remove video from playlist
  const handleRemoveVideo = async (videoId, playlistId) => {
    try {
      if (!videoId || !playlistId) {
        setError("Please select a video and playlist");
        return;
      }
      await axios.patch(`/api/v1/playlist/remove/${videoId}/${playlistId}`, {}, { withCredentials: true });
      setPlaylists(
        playlists.map((p) =>
          p._id === playlistId
            ? {
                ...p,
                videos: (p.videos || []).filter((id) => id !== videoId),
                videosCount: Math.max(0, (p.videosCount || 0) - 1),
              }
            : p
        )
      );
      setSelectedVideo("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove video");
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;

  if (error)
    return (
      <div className="text-center text-red-500">
        {error}
        <button onClick={() => setError(null)} className="ml-4 text-blue-500 underline">
          Clear Error
        </button>
      </div>
    );

  // 🧠 Debug logs
  

  return (
    <div className="container dark:bg-black mx-auto px-4 py-8 bg-gray-900">
      <h1 className="text-3xl font-bold text-white mb-8">Channel Playlists</h1>

      {/* ✅ Create Playlist */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Create New Playlist</h2>
        <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4 max-w-md">
          <input
            type="text"
            placeholder="Playlist Name"
            value={newPlaylist.name}
            onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
            required
          />
          <textarea
            placeholder="Playlist Description"
            value={newPlaylist.description}
            onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Playlist
          </button>
        </form>
      </div>

      {/* ✅ Video selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Manage Videos</h2>
        {Array.isArray(videos) && videos.length > 0 ? (
          <select
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white w-full max-w-md"
            disabled={addLoading}
          >
            <option value="">Select a video</option>
            {videos.map((video) => (
              <option key={video._id} value={video._id}>
                {video.title || `Video ${video._id}`}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-400">No videos available</p>
        )}
      </div>

      {/* ✅ Playlist cards */}
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="bg-purple-200 p-4 rounded-full mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </span>
          <p className="text-white font-semibold text-lg mt-2 mb-2">No playlists created</p>
          <p className="text-gray-400 text-center max-w-xs">
            This page has yet to create a playlist. Search another page to find more playlists.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => {
            const thumbnailSrc =
              playlist.thumbnail?.url ||
              (typeof playlist.thumbnail === "string" && playlist.thumbnail) ||
              playlist.videos?.[0]?.thumbnail?.url ||
              "/default-thumbnail.png";

            return (
              <div
                key={playlist._id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={thumbnailSrc}
                  alt={playlist.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  {editingPlaylist && editingPlaylist._id === playlist._id ? (
                    <div className="flex flex-col gap-2 mb-4">
                      <input
                        type="text"
                        value={editingPlaylist.name}
                        onChange={(e) =>
                          setEditingPlaylist({ ...editingPlaylist, name: e.target.value })
                        }
                        className="p-2 rounded bg-gray-700 text-white"
                      />
                      <textarea
                        value={editingPlaylist.description}
                        onChange={(e) =>
                          setEditingPlaylist({
                            ...editingPlaylist,
                            description: e.target.value,
                          })
                        }
                        className="p-2 rounded bg-gray-700 text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdatePlaylist(playlist._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPlaylist(null)}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold text-white">{playlist.name}</h2>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {playlist.description}
                      </p>
                      <div className="flex justify-between items-center text-gray-400 text-sm">
                        <span>
                          {playlist.createdAt
                            ? new Date(playlist.createdAt).toLocaleDateString()
                            : playlist.updatedAt
                            ? new Date(playlist.updatedAt).toLocaleDateString()
                            : "—"}
                        </span>
                        <span>
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

                      <div className="flex gap-2 mt-3">
                        <Link
                          to={`/playlist/${playlist._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          View Playlist
                        </Link>
                        <button
                          onClick={() =>
                            setEditingPlaylist({
                              _id: playlist._id,
                              name: playlist.name,
                              description: playlist.description,
                            })
                          }
                          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(playlist._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAddVideo(selectedVideo, playlist._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          disabled={!selectedVideo || addLoading}
                        >
                          {addLoading ? "Adding..." : "Add Video"}
                        </button>
                        <button
                          onClick={() => handleRemoveVideo(selectedVideo, playlist._id)}
                          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                          disabled={!selectedVideo}
                        >
                          Remove Video
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPlaylists;
