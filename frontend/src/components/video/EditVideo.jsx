import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomFileInput from "../../utils/CustomFileInput";

function EditVideo({ video, onClose, onUpdate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setPreview(video.thumbnail?.url || "");
      setThumbnailFile(null);
    }
  }, [video]);

  // Preview on file select
  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (video?.thumbnail?.url) {
      setPreview(video.thumbnail.url);
    }
  }, [thumbnailFile, video]);

  if (!video) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      const res = await axios.patch(
        `/api/v1/videos/v/${video._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      onUpdate(res.data.data);
      onClose();
    } catch (err) {
      alert("Failed to update video or all fields are required");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-[#1a1a1a] max-h-[95vh] overflow-y-auto rounded-lg p-7 w-full max-w-lg border-2 border-gray-700 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Thumbnail */}
          <label className="text-white text-md mb-2 font-semibold">Thumbnail <span className="text-red-400">*</span></label>
          <div className="mb-5 border-2 border-dashed border-gray-600 rounded-md p-2 flex justify-center items-center bg-[#222]">
            <img
              src={preview}
              alt="thumbnail preview"
              className="max-h-44 w-auto rounded object-contain"
            />
          </div>
          <CustomFileInput
            type="file"
            accept="image/*"
            onChange={e => setThumbnailFile(e.target.files[0])}
            className="mb-5 text-gray-100"
            style={{ background: "#333" }}
          />

          {/* Title */}
          <label className="text-white text-md mb-2 mt-1 font-semibold">Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full p-2 mb-5 bg-[#222] text-white border border-gray-600 rounded"
            style={{ fontSize: "1rem" }}
          />

          {/* Description */}
          <label className="text-white text-md mb-2 font-semibold">Description <span className="text-red-400">*</span></label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full p-2 mb-6 h-32 resize-y bg-[#222] text-white border border-gray-600 rounded"
            style={{ fontSize: "1rem" }}
          />

          {/* Buttons */}
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-black border cursor-pointer border-gray-400 text-gray-100 font-semibold px-6 py-2 rounded hover:bg-gray-900"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-500 cursor-pointer text-white font-semibold px-7 py-2 rounded hover:bg-purple-600"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideo;
