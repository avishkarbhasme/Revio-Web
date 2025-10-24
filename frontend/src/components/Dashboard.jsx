import React, { useEffect, useState } from "react";
import axios from "axios";
import EditVideo from "./video/EditVideo";
import { IoAddOutline } from "react-icons/io5";
import UploadVideo from "./video/UploadVideo.jsx";

// Example: You may need to update these according to your theme or Tailwind config
const PUBLISHED_CLASS = "bg-green-900 text-green-300 px-3 py-1 rounded-full";
const UNPUBLISHED_CLASS = "bg-orange-900 text-orange-300 px-3 py-1 rounded-full";
const BUTTON_PURPLE = "bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded";


function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videous, setVideous] = useState([]);

  useEffect(() => {
    async function fetchStatsAndVideos() {
      const [statsRes, videosRes] = await Promise.all([
        axios.get("/api/v1/dashboard/stats", { withCredentials: true }),
        axios.get("/api/v1/dashboard/videos", { withCredentials: true })
      ]);
      setStats(statsRes.data.data);
      setVideos(videosRes.data.data);
    }
    fetchStatsAndVideos();
  }, []);

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      // Patch request to toggle published status
      await axios.patch(
        `/api/v1/videos/${videoId}/toggle-publish`,
        { isPublished: !currentStatus },
        { withCredentials: true }
      );

      // Update videos state locally to reflect toggle (immutable update)
      setVideos(videos.map(v => 
        v._id === videoId ? { ...v, isPublished: !currentStatus } : v
      ));
    } catch (err) {
      alert("Failed to update publish status");
    }
  };

const handleDeleteVideo = async (videoId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this video? This action cannot be undone."
  );
  if (!confirmed) return; // user cancelled

  try {
    await axios.delete(`/api/v1/videos/v/${videoId}`, {
      withCredentials: true,
    });
    setVideos(videos.filter((v) => v._id !== videoId));
  } catch (error) {
    alert("Failed to delete video");
  }
};
  const handleUploaded = (newVideo) => {
    setVideous([...videous, newVideo]);
  }

  return (
    <div className="min-h-screen mt-15 bg-black dark:bg-yellow-800 dark:text-green-500 text-white p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome , <strong className=" text-amber-500 dark:text-black"> Revio's</strong> Dashboard</h1>
          <p className="text-sm dark:text-black text-red-500 ">This conveys Revio’s role in enabling users to manage, showcase, and thrive through video content, while emphasizing user empowerment and creative growth.</p>
        </div>
        <button
         onClick={() => setUploading(true)}
         className="flex cursor-pointer items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded shadow hover:bg-purple-800 transition">
          <IoAddOutline size={25}/> 
          Upload video
        </button>
        {uploading && (
        <UploadVideo
          onClose={() => setUploading(false)}
          onUploaded={handleUploaded}
        />
      )}
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total views" icon="👤" value={stats?.totalViews} />
        <StatCard title="Total subscribers" icon="👤" value={stats?.totalSubscribers} />
        <StatCard title="Total likes" icon="💜" value={stats?.totalLikes} />
      </div>
      {/* Videos Table */}
      <div className="bg-[#19191c] rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Uploaded</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Date uploaded</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {videos.map((vid) => (
              <tr key={vid._id} className="border-b border-gray-800 hover:bg-gray-900">
                <td className="px-4">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-10 text-purple-600 cursor-pointer"
                    checked={vid.isPublished}
                    onChange={() => handleTogglePublish(vid._id, vid.isPublished)}
                  />
                </td>
                <td className="px-4 py-2">
                  <span className={vid.isPublished ? PUBLISHED_CLASS : UNPUBLISHED_CLASS}>
                    {vid.isPublished ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center">
                  <img
                    src={vid.thumbnail?.url}
                    className="inline-block w-10 h-10 object-cover rounded-full mr-3"
                    alt="thumbnail"
                  />
                  <span>{vid.title}</span>
                </td>
                <td className="px-4 py-2">
                  <span className="bg-green-900 text-green-200 rounded-full px-2 py-1 mr-2">
                    {vid.likesCount} likes
                  </span>
                  <span className="bg-red-900 text-red-200 rounded-full px-2 py-1">
                    {/* Example: dislikes may need a backend field */}
                    {vid.dislikesCount || 0} dislikes
                  </span>
                </td>
                <td className="px-4 py-2">
                  {`${vid.createdAt?.month}/${vid.createdAt?.day}/${vid.createdAt?.year}`}
                </td>
                <td className="px-6 py-2 dark:text-black flex items-center">
                  <button className=" cursor-pointer border-1 text-red-500 rounded mr-1" 
                  onClick={() => handleDeleteVideo(vid._id)}>Delete</button>
                  

                  {editingVideo && (
                    <EditVideo
                      video={editingVideo}
                      onClose={() => setEditingVideo(null)}
                      onUpdate={(updatedVideo) => {
                        setVideos(videos.map(v => v._id === updatedVideo._id ? updatedVideo : v));
                        setEditingVideo(null);
                      }}
                    />
                  )}
                  {editingVideo && <div className="fixed inset-0 bg-red-500 z-40">Modal active: {editingVideo.title}</div>}

                   <button className=" cursor-pointer border-1 w-13  text-green-500 rounded ml-1"
                   
                   
                   onClick={() => {
                    console.log("video", vid);
                    
                    setEditingVideo(vid)}}
                   >Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, icon, value }) {
  return (
    <div className="bg-[#19191c] rounded-lg p-8 flex flex-col justify-center items-center h-40">
      <div className="flex flex-col items-center mb-3">
        <span className="text-4xl mb-2">{icon}</span>
        <span className="text-lg text-gray-300">{title}</span>
      </div>
      <div className="text-3xl font-bold">{Number(value).toLocaleString()}</div>
    </div>
  );
}

export default Dashboard;
