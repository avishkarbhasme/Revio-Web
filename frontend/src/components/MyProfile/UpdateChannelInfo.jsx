import React, { useEffect, useState } from "react";
import axios from "axios";

function UpdateChannelInfo() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get("/api/v1/healthcheck/check");
        setStatus(res.data?.message || "API is healthy ✅");
      } catch (err) {
        setError("Failed to connect to backend ❌");
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Server Health Check</h1>
        {loading ? (
          <p className="text-gray-400 animate-pulse">Checking server status...</p>
        ) : error ? (
          <p className="text-red-400 font-medium">{error}</p>
        ) : (
          <p className="text-green-400 font-medium">{status}</p>
        )}
      </div>
    </div>
  );
}

export default UpdateChannelInfo;
