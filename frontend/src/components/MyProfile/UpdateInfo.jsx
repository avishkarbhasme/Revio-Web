import React, { useState } from "react";
import axios from "axios";

function UpdateInfo({ profile, setProfile }) {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    username: profile?.username || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Check if at least one field has a value
    if (!formData.fullName && !formData.email && !formData.username) {
      setError("Please provide at least one field to update.");
      setLoading(false);
      return;
    }

    // Only include fields that have values in the payload
    const payload = {};
    if (formData.fullName) payload.fullName = formData.fullName;
    if (formData.email) payload.email = formData.email;
    if (formData.username) payload.username = formData.username;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "/api/v1/users/update-account",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Update profile state with new data
      setProfile((prev) => ({
        ...prev,
        ...res.data.data, // Merge updated fields
      }));
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 dark:bg-black text-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Update Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
        <div className="text-green-500">All fields are not requried to udate the information ,you change any of them</div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your username"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium shadow ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default UpdateInfo;