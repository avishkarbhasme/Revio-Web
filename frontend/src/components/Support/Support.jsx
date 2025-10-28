import React, { useState } from "react";
import axios from "axios";

function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/v1/support", {
        name,
        email,
        subject,
        message,
      });
      setSuccess(res.data?.message || "Your message has been sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      if (!err.response) {
        setError("Network error. Please try again.");
      } else {
        setError(err.response.data?.message || "Failed to send message.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 dark:bg-gray-900 flex justify-center mt-12 items-center p-4 min-w-full">
      <div className="w-full max-w-lg bg-[#1a1a1a] p-8 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Support</h1>

        {error && <div className="bg-red-600 text-white p-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-600 text-white p-2 mb-4 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />

          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="p-3 rounded bg-gray-800 text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded mt-2 transition-all duration-200 w-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Support;
