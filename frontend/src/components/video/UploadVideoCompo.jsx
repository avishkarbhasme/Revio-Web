import React, { useState } from "react";
import axios from "axios";
import CustomFileInput from "../../utils/CustomFileInput";

function UploadVideoCompo({ onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Preview video file on selection
  React.useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  // Preview thumbnail file on selection
  React.useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [thumbnailFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !videoFile || !thumbnailFile) {
      alert("All fields including video and thumbnail files are required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnailFile);

      const res = await axios.post(
        "/api/v1/videos/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      onUploaded(res.data.data); // pass uploaded video back to parent component
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-[#1a1a1a] p-7 w-full max-w-lg rounded-lg border border-gray-700 shadow-xl max-h-[95vh] overflow-auto">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Title */}
          <label className="text-white mb-2 font-semibold">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-5 p-2 bg-[#222] text-white border border-gray-600 rounded"
            style={{ fontSize: "1rem" }}
          />

          {/* Description */}
          <label className="text-white mb-2 font-semibold">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mb-5 p-2 h-32 resize-y bg-[#222] text-white border border-gray-600 rounded"
            style={{ fontSize: "1rem" }}
          />

          {/* Video File */}
          <label className="text-white mb-2 font-semibold">
            Video File <span className="text-red-400">*</span>
          </label>
          <CustomFileInput
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            className="mb-3"
          />
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="mb-5 max-h-48 rounded"
            />
          )}

          {/* Thumbnail File */}
          <label className=" text-white mb-2 font-semibold">
            Thumbnail <span className="text-red-400">*</span>
          </label>
          <CustomFileInput  
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            required
            className="mb-3 m-1"
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="mb-5 max-h-32 rounded object-contain"
            />
          )}

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-black border mt-2 cursor-pointer border-gray-400 text-gray-100 font-semibold px-6 py-2 rounded hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-500 cursor-pointer text-white font-semibold px-7 py-2 rounded hover:bg-purple-600"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideoCompo;
