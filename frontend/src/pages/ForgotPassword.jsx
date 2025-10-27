import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ThemeToggle from "../utils/ThemeToggle";
import NonAuthChatbot from "../components/chatbot/NonAuthChatbot";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username && !email) {
      setError("Please provide either username or email.");
      return;
    }

    if (!newPassword) {
      setError("Please enter the new password.");
      return;
    }

    try {
      await axios.post(
        "/api/v1/users/forgot-password",
        { username, email, newPassword }
      );
      setSuccess("Password reset successful. You can now login.");
      setUsername("");
      setEmail("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
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
        className="bg-white dark:bg-cyan-800 dark:text-black p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <input
          type="text"
          placeholder="Username "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition"
        >
          Reset Password
        </button>
         {/* Forgot Password and Sign Up options */}
        <div className="flex justify-between text-sm mt-4">
          
          <Link
            to="/"
            className="text-blue-600 dark:text-yellow-600 text-xl hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
      <NonAuthChatbot/>
    </div>
    </>
  );
}

export default ForgotPassword;
