import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../utils/ThemeToggle";
import NonAuthChatbot from "../components/chatbot/NonAuthChatbot";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      const response = await axios.post(
        "/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );

      // Login success: redirect to home page
      await navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <nav className="dark:text-gray-100 h-16 dark:bg-black flex flex-row justify-between items-center px-4">
        <button className="bg-amber-500 rounded border-black border-2 px-4 py-2">
          <Link to="/">Back Home</Link>
        </button>
        <div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="dark:bg-gray-500 dark:text-gray-100 flex flex-col sm:flex-row min-h-screen justify-center items-center bg-gray-200 p-4 sm:p-0 space-y-4 sm:space-y-0 sm:space-x-8">
        
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {error && <div className="text-red-600 text-center">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-green-600 dark:hover:bg-green-700 hover:bg-blue-700 text-white p-3 cursor-pointer rounded font-semibold transition"
          >
            Login
          </button>

          <div className="flex flex-col sm:flex-row justify-between text-sm mt-4 gap-2 sm:gap-0">
            <Link
              to="/forgot-password"
              className="text-blue-600 dark:text-red-600 hover:underline cursor-pointer text-center sm:text-left"
            >
              Forgot Password?
            </Link>
            <Link
              to="/register"
              className="text-blue-600 hover:underline dark:text-red-600 cursor-pointer text-center sm:text-right"
            >
              Register
            </Link>
          </div>
        </form>

        {/* Chatbot below form on mobile, side by side on larger screens */}
        <div className="w-full sm:w-auto">
          <NonAuthChatbot />
        </div>
      </div>
    </>
  );
}

export default Login;
