import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MdImageNotSupported, MdOutlineCloudUpload } from "react-icons/md";
import UpdateInfo from "./UpdateInfo";
import UpdateChannelInfo from "./UpdateChannelInfo";
import UpdatePassword from "./UpdatePassword";

function EditCompo() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`/api/v1/users/c/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setProfile(res.data.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [username]);

  // ✅ Handle Avatar Update
  const handleAvatarUpdate = async () => {
    const token = localStorage.getItem("token");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("avatar", file);

      try {
        setUploading(true);
        const res = await axios.patch("/api/v1/users/avatar", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        const updatedUser = res.data.data;
        setProfile((prev) => ({
          ...prev,
          avatar: updatedUser.avatar,
        }));
        alert("Avatar updated successfully!");
      } catch (error) {
        console.error("Error updating avatar:", error);
        alert("Failed to update avatar");
      } finally {
        setUploading(false);
      }
    };

    fileInput.click();
  };

  // ✅ Handle Cover Image Update
  const handleCoverImageUpdate = async () => {
    const token = localStorage.getItem("token");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("coverImage", file);

      try {
        setUploading(true);
        const res = await axios.patch("/api/v1/users/cover-image", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        const updatedUser = res?.data?.data;
        if (!updatedUser) throw new Error("Invalid response from server");

        setProfile((prev) => ({
          ...prev,
          coverImage: updatedUser.coverImage || prev.coverImage,
        }));

        alert("Cover image updated successfully!");
      } catch (error) {
        console.error("Error updating cover image:", error);
        alert("Failed to update cover image");
      } finally {
        setUploading(false);
      }
    };

    fileInput.click();
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (!profile)
    return <div className="text-center text-red-500">Profile not found</div>;

  return (
    <main className="min-h-screen ml-64 pt-15 border max-sm:ml-0 max-sm:px-0">
      {/* Cover Image */}
      <div
        className="h-56 w-full bg-cover bg-center relative group cursor-pointer max-sm:h-56"
        onClick={handleCoverImageUpdate}
        style={{
          backgroundImage: profile.coverImage
            ? `url(${profile.coverImage})`
            : "none",
          backgroundColor: !profile.coverImage ? "#333" : "transparent",
        }}
      >
        {!profile.coverImage && (
          <div className="h-56 w-full flex items-center justify-center bg-gray-200">
            <MdImageNotSupported size={48} color="#888" />
          </div>
        )}

        {/* Upload overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <MdOutlineCloudUpload size={40} color="#fff" />
        </div>
      </div>

      {/* Avatar */}
      <div
        className="absolute left-75 top-78 z-20 group/avatar cursor-pointer max-sm:left-1/2 max-sm:top-57 max-sm:-translate-x-1/2"
        onClick={(e) => {
          e.stopPropagation();
          handleAvatarUpdate();
        }}
      >
        <div className="relative w-24 h-24">
          <img
            src={profile.avatar || "/default-avatar.png"}
            alt={profile.username}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
            <MdOutlineCloudUpload size={28} color="#fff" />
          </div>
        </div>
      </div>

      {/* Channel Info Card */}
      <div className="bg-gray-900 px-10 py-8 mt-0 relative dark:bg-black flex flex-col md:flex-row items-center justify-between max-sm:px-5">
        <div className="md:ml-36 mt-8 md:mt-0 flex-1 text-center md:text-left">
          <h1 className="text-xl font-semibold text-white">
            {profile.fullName}
          </h1>
          <p className="text-lg text-gray-300">@{profile.username}</p>
          <p className="text-sm text-gray-400 mt-1">
            {profile.subcribersCount || 0} Subscribers {" • "}
            {profile.channelsSubscribedToCount || 0} Subscribed
          </p>
        </div>
        <button
          onClick={() => navigate(`/home/my-profile/${username}`)}
          className="px-5 py-2 rounded-lg font-medium mt-3 md:mt-0 shadow bg-purple-400 text-black hover:bg-purple-600 hover:text-white"
        >
          View channel
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 dark:bg-gray-900 w-full px-10 max-sm:px-5">
        <div className="flex flex-wrap justify-center space-x-10 border-b border-gray-700 max-sm:space-x-4">
          <button
            className={`py-3 font-semibold ${
              activeTab === "personal"
                ? "text-purple-300 border-b-2 border-purple-300"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </button>
          <button
            className={`py-3 font-semibold ${
              activeTab === "channel"
                ? "text-purple-300 border-b-2 border-purple-300"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("channel")}
          >
            Channel Information
          </button>
          <button
            className={`py-3 font-semibold ${
              activeTab === "password"
                ? "text-purple-300 border-b-2 border-purple-300"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {/* Conditional Tab Content */}
        {activeTab === "personal" && (
          <UpdateInfo profile={profile} setProfile={setProfile} />
        )}
        {activeTab === "channel" && <UpdateChannelInfo profile={profile} />}
        {activeTab === "password" && <UpdatePassword />}
      </div>
    </main>
  );
}

export default EditCompo;
