import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CustomFileInput from "../utils/CustomFileInput";
import ThemeToggle from "../utils/ThemeToggle";
import NonAuthChatbot from "../components/chatbot/NonAuthChatbot";


function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarName, setAvatarName] = useState("No file chosen");
  const [coverImageName, setCoverImageName] = useState("No file chosen");
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarName(file ? file.name : "No file chosen");
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
    } else {
      setCoverImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !username || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (!avatar) {
      setError("Please upload an avatar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("avatar", avatar);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
      await axios.post("/api/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <>
    <nav className=" dark:text-gray-100 h-15 dark:bg-black flex flex-direction-row justify-between ">
      <button className="bg-amber-500 m-2 w-25 rounded border-black border-2"><Link to="/">Back Home</Link></button>
      <div className="m-2"><ThemeToggle/></div>
    </nav>
    <div className="flex dark:bg-gray-800 dark:text-gray-100 min-h-screen justify-center items-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-400 m-10  dark:text-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div>
          <label className="block mb-1 font-semibold">Avatar <span className="text-red-500">*</span></label>
          <CustomFileInput
            label="avatar"
            onChange={handleAvatarChange}
            required
          />

          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="mt-2 h-16 w-16 rounded-full object-cover border"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Cover Image </label>
          <CustomFileInput
            label={"coverImage"}
            onChange={handleCoverImageChange}
            className="w-full"
          />
          {coverImagePreview && (
            <img
              src={coverImagePreview}
              alt="Cover Preview"
              className="mt-2 h-16 w-28 object-cover border"
            />
          )}
        </div>

        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white py-3 rounded font-semibold transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 cursor-pointer hover:underline">
            Login
          </Link>
        </p>
      </form>
      <NonAuthChatbot/>
    </div>
    </>
  );
}

export default Signup;
