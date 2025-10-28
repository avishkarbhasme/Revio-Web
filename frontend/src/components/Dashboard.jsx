import React, { useEffect, useState } from "react";
import axios from "axios";
import EditVideo from "./video/EditVideo";
import { IoAddOutline } from "react-icons/io5";
import UploadVideo from "./video/UploadVideo.jsx";

const PUBLISHED_CLASS =
  "bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs sm:text-sm";
const UNPUBLISHED_CLASS =
  "bg-orange-900 text-orange-300 px-3 py-1 rounded-full text-xs sm:text-sm";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchStatsAndVideos() {
      const [statsRes, videosRes] = await Promise.all([
        axios.get("/api/v1/dashboard/stats", { withCredentials: true }),
        axios.get("/api/v1/dashboard/videos", { withCredentials: true }),
      ]);
      setStats(statsRes.data.data);
      setVideos(videosRes.data.data);
    }
    fetchStatsAndVideos();
  }, []);

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      await axios.patch(
        `/api/v1/videos/${videoId}/toggle-publish`,
        { isPublished: !currentStatus },
        { withCredentials: true }
      );

      setVideos(
        videos.map((v) =>
          v._id === videoId ? { ...v, isPublished: !currentStatus } : v
        )
      );
    } catch {
      alert("Failed to update publish status");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      await axios.delete(`/api/v1/videos/v/${videoId}`, {
        withCredentials: true,
      });
      setVideos(videos.filter((v) => v._id !== videoId));
    } catch {
      alert("Failed to delete video");
    }
  };

  return (
    <div className="min-h-screen bg-black mt-16 text-white dark:bg-yellow-800 dark:text-green-500 p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Welcome,{" "}
            <strong className="text-amber-500 dark:text-black">Revio’s</strong>{" "}
            Dashboard
          </h1>
          <p className="text-sm dark:text-black text-red-500">
            This conveys Revio's role in enabling users to Manage, showcase, and thrive to video content, while emphasizing user empowerment and creative growth
          </p>
        </div>

        <button
          onClick={() => setUploading(true)}
          className="flex items-center justify-center gap-2 bg-purple-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded shadow hover:bg-purple-800 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <IoAddOutline size={20} />
          Upload Video
        </button>

        {uploading && (
          <UploadVideo
            onClose={() => setUploading(false)}
            onUploaded={(newVid) => setVideos((prev) => [...prev, newVid])}
          />
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard title="Total Views" icon="👁️" value={stats?.totalViews} />
        <StatCard title="Subscribers" icon="👤" value={stats?.totalSubscribers} />
        <StatCard title="Total Likes" icon="💜" value={stats?.totalLikes} />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#19191c] rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base min-w-[800px]">
          <thead className="sticky top-0 bg-[#19191c] z-10">
            <tr className="border-b border-gray-800">
              <th className="py-3 px-4">Publish</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Uploaded</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((vid) => (
              <tr
                key={vid._id}
                className="border-b border-gray-800 hover:bg-gray-900 transition"
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-600 cursor-pointer"
                    checked={vid.isPublished}
                    onChange={() =>
                      handleTogglePublish(vid._id, vid.isPublished)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      vid.isPublished ? PUBLISHED_CLASS : UNPUBLISHED_CLASS
                    }
                  >
                    {vid.isPublished ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center">
                  <img
                    src={vid.thumbnail?.url}
                    className="inline-block w-10 h-10 object-cover rounded-full mr-3"
                    alt="thumbnail"
                  />
                  <span className="truncate max-w-[200px]">{vid.title}</span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="bg-green-900 text-green-200 rounded-full px-2 py-1 mr-1 text-xs sm:text-sm">
                    {vid.likesCount} likes
                  </span>
                  <span className="bg-red-900 text-red-200 rounded-full px-2 py-1 text-xs sm:text-sm">
                    {vid.dislikesCount || 0} dislikes
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(vid.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex justify-end gap-3">
                  <button
                    className="text-red-500 border border-red-600 hover:underline text-sm"
                    onClick={() => handleDeleteVideo(vid._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-green-500 border border-green-600 hover:underline text-sm"
                    onClick={() => setEditingVideo(vid)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {videos.map((vid) => (
          <div
            key={vid._id}
            className="bg-[#19191c] rounded-lg p-4 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold truncate max-w-[180px]">
                {vid.title}
              </h2>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purple-600"
                checked={vid.isPublished}
                onChange={() => handleTogglePublish(vid._id, vid.isPublished)}
              />
            </div>
            <img
              src={vid.thumbnail?.url}
              alt={vid.title}
              className="w-full h-40 object-cover rounded"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className={
                  vid.isPublished ? PUBLISHED_CLASS : UNPUBLISHED_CLASS
                }
              >
                {vid.isPublished ? "Published" : "Unpublished"}
              </span>
              <span className="bg-green-900 text-green-200 rounded-full px-2 py-1">
                {vid.likesCount} likes
              </span>
              <span className="bg-red-900 text-red-200 rounded-full px-2 py-1">
                {vid.dislikesCount || 0} dislikes
              </span>
            </div>
            <div className="text-gray-400 text-xs">
              Uploaded: {new Date(vid.createdAt).toLocaleDateString()}
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="text-red-500 border border-red-600 text-sm"
                onClick={() => handleDeleteVideo(vid._id)}
              >
                Delete
              </button>
              <button
                className="text-green-500 border border-green-600 text-sm"
                onClick={() => setEditingVideo(vid)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingVideo && (
        <EditVideo
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onUpdate={(updatedVideo) => {
            setVideos((v) =>
              v.map((x) => (x._id === updatedVideo._id ? updatedVideo : x))
            );
            setEditingVideo(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ title, icon, value }) {
  return (
    <div className="bg-[#19191c] rounded-lg p-6 flex flex-col justify-center items-center h-32">
      <div className="flex flex-col items-center mb-2">
        <span className="text-3xl mb-1">{icon}</span>
        <span className="text-sm text-gray-300">{title}</span>
      </div>
      <div className="text-xl font-bold">{Number(value || 0).toLocaleString()}</div>
    </div>
  );
}

export default Dashboard;
