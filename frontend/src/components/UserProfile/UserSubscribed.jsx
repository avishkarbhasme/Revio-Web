import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserSubscribed = ({ subscriberId }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
 
  
        if (!subscriberId) {
          setError("No subscriber ID provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/v1/subscriptions/u/${subscriberId}`, {
      
          withCredentials: true,
        });
        setSubscribers(response.data.data || []);
        setLoading(false);
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to fetch subscribers";
        setError(message);
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [subscriberId]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto dark:bg-black px-4 py-8 bg-gray-900 min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">Channel Subscribers</h1>
      {subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="bg-purple-200 p-4 rounded-full mb-4">
            <svg fill="currentColor" width="36" height="36" viewBox="0 0 20 20">
              <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001.707.707l11-6a1 1 0 000-1.414l-11-6A1 1 0 004 3zm1.03 12V5.07l9.31 5.465-9.31 5.465z" />
            </svg>
          </span>
          <p className="text-white font-semibold text-lg mt-2 mb-2">No subscribed channels</p>
          <p className="text-gray-400 text-center max-w-xs">
            This page has yet to subscribe to any channels. Search another page to find more subscribers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.subscriber._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6 flex items-center">
                <img
                  src={subscriber.subscriber?.avatar || "/default-avatar.png"}
                  alt={subscriber.subscriber.username}
                  className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-700"
                />
                <div className="flex-1">
                  <Link
                    to={`/c/${subscriber.subscriber.username}`}
                    className="text-white font-semibold text-lg hover:text-purple-400 transition-colors"
                  >
                    {subscriber.subscriber.username}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">
                    Full Name: {subscriber.subscriber.fullName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Subscribers: {subscriber.subscriber.subscribersCount}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-700">
                <Link
                  to={`/home/profile/${subscriber.subscriber?.username}`}
                  className="w-full inline-block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSubscribed;