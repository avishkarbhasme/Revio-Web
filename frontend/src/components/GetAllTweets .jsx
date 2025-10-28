import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetAllTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTweet, setNewTweet] = useState('');
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch logged-in user ID first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/v1/users/current-user', { withCredentials: true });
        setUserId(res.data.data._id);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to get user");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch all tweets
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await axios.get('/api/v1/tweets/all', { withCredentials: true });
        setTweets(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch tweets");
      } finally {
        setLoading(false);
      }
   };
    fetchTweets();
  }, []); // no userId needed


  // Create tweet
  const handleCreateTweet = async () => {
    if (!newTweet.trim()) return;
    try {
      const res = await axios.post('/api/v1/tweets/create', { content: newTweet }, { withCredentials: true });
      setTweets([res.data.data, ...tweets]);
      setNewTweet('');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create tweet');
    }
  };

  // Update tweet
  const handleUpdateTweet = async (tweetId) => {
    if (!editingContent.trim()) return;
    try {
      const res = await axios.patch(`/api/v1/tweets/${tweetId}`, { content: editingContent }, { withCredentials: true });
      setTweets(tweets.map(t => t._id === tweetId ? res.data.data : t));
      setEditingTweetId(null);
      setEditingContent('');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update tweet');
    }
  };

  // Delete tweet
  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    try {
      await axios.delete(`/api/v1/tweets/${tweetId}`, { withCredentials: true });
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete tweet");
    }
  };

  // Toggle like
  const handleToggleLike = async (tweetId) => {
    try {
      const res = await axios.post(`/api/v1/likes/toggle/t/${tweetId}`, {}, { withCredentials: true });
      const { isLiked } = res.data.data;
      setTweets(prev => prev.map(t => t._id === tweetId ? { ...t, isLiked } : t));
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to toggle like");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white text-xl animate-pulse">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-400 text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 mt-15 text-white px-4 py-12 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">My Tweets</h1>

        {/* Create Tweet */}
        <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleCreateTweet} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">Tweet</button>
        </div>

        {tweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-2xl font-semibold mb-4">No tweets posted</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tweets.map(tweet => (
              <div key={tweet._id} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">

                {/* Avatar & Username */}
                <div className="flex items-center mb-4">
                  <img
                    src={tweet.ownerDetails?.avatar || ''}
                    alt={tweet.ownerDetails?.username || 'User Avatar'}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <span className="font-semibold text-green-400">@{tweet.ownerDetails?.username || 'Unknown User'}</span>
                </div>

                {/* Tweet Content */}
                {editingTweetId === tweet._id ? (
                  <>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex mt-3 space-x-2">
                      <button onClick={() => handleUpdateTweet(tweet._id)} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">Save</button>
                      <button onClick={() => { setEditingTweetId(null); setEditingContent(''); }} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-white text-lg mb-4">{tweet.content}</p>

                    {/* Likes */}
                    <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
                      <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleToggleLike(tweet._id)}
                          className={`font-medium ${tweet.isLiked ? 'text-red-400' : 'text-gray-400'} hover:text-red-500`}
                        >
                          ❤️ {tweet.likesCount || 0}
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-2">
                      <button onClick={() => { setEditingTweetId(tweet._id); setEditingContent(tweet.content); }} className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 text-black">Edit</button>
                      <button onClick={() => handleDeleteTweet(tweet._id)} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllTweets;
