import React, { useState } from "react";
import axios from "axios";

function Report() {
  const [type, setType] = useState("video");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !description) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }
    try {
      const res = await axios.post("/api/v1/reports/create", { type, reason, description });
      setSuccess(res.data.message);
      setError("");
      setType("video");
      setReason("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen mt-15 bg-gray-700 dark:bg-gray-900 p-6 flex justify-center items-start">
      <div className="w-full max-w-lg bg-[#1a1a1a] p-8 rounded-lg border border-gray-700 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Report Content</h1>

        {error && <div className="bg-red-600 text-white p-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-600 text-white p-2 mb-4 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-white font-semibold" htmlFor="type-select">
            Report Type
          </label>
          <select
            id="type-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="video">Video</option>
            <option value="comment">Comment</option>
          </select>

          <label className="text-white font-semibold" htmlFor="reason-select">
            Reason <span className="text-red-400">*</span>
          </label>
          <select
            id="reason-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select a reason</option>
            <option value="spam">Spam</option>
            <option value="harassment">Harassment</option>
            <option value="inappropriate">Inappropriate Content</option>
            <option value="copyright">Copyright Violation</option>
            <option value="other">Other</option>
          </select>

          <label className="text-white font-semibold" htmlFor="description-textarea">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Paste the url of video or username, Provide more details..."
            className="p-3 rounded bg-gray-800 text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded mt-2 transition-colors duration-200"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default Report;
