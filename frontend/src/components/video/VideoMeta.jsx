import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatTimeAgo } from "../../utils/Helper";
import { useParams } from "react-router-dom";
import { GrLike, GrDislike } from "react-icons/gr";

function VideoMeta() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch video data (includes channel info)
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/v1/videos/v/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setVideo(res.data.data);
      } catch (err) {
        console.error("Error fetching video:", err);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId, token]);

  // ✅ Like toggle
  const handleToggleLike = async () => {
    if (!video?._id) return;
    setLiking(true);
    try {
      const res = await axios.post(
        `/api/v1/likes/toggle/v/${video._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      const updated = res.data.data || {};
      setVideo((prev) => ({
        ...prev,
        likesCount: updated.likesCount ?? prev.likesCount,
        isLiked: updated.isLiked ?? !prev.isLiked,
      }));
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setLiking(false);
    }
  };

  // ✅ Subscribe toggle (calls your route: POST /api/v1/subscriptions/c/:channelId)
  const handleToggleSubscribe = async () => {
    if (!video?.owner?._id) return; // channelId comes from video.owner._id
    setSubscribing(true);

    try {
      const res = await axios.post(
        `/api/v1/subscriptions/c/${video.owner._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const { subscribed } = res.data.data;

      setVideo((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          isSubscribed: subscribed,
          subscribersCount: subscribed
            ? prev.owner.subscribersCount + 1
            : prev.owner.subscribersCount - 1,
        },
      }));
    } catch (err) {
      console.error("Subscription toggle failed:", err);
    } finally {
      setSubscribing(false);
    }
  };

  // ✅ Loading states
  if (loading)
    return (
      <div className="w-[560px] h-[315px] flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );

  if (!video)
    return (
      <div className="w-[560px] h-[315px] flex items-center justify-center bg-gray-900 text-white">
        Video not found.
      </div>
    );
 
return (
    <div className="w-200 bg-[#18181b] text-white rounded border-b-4 shadow p-4 flex flex-col">
      {/* Title and Views */}
      <h2 className="text-xl font-semibold mb-1">{video.title}</h2>
      <span className="text-xs text-gray-300">
        {video.views} Views · {formatTimeAgo(video.createdAt)}
      </span>

      {/* Owner + Buttons */}
      <div className="flex items-center justify-between mt-3 mb-2">
        {/* Left: Avatar + Name + Subscribers */}
        <div className="flex items-center space-x-3">
          <img
            src={video.owner?.avatar || "/default-avatar.png"}
            alt={video.owner?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium">{video.owner?.name}</span>
            <span className="text-xs text-gray-400">
              {video.owner?.subscribersCount ?? 0} subscribers
            </span>
          </div>
        </div>

        {/* Right: Subscribe + Like/Dislike */}
        <div className="flex space-x-2">
          {/* Subscribe Button */}
          <button
            onClick={handleToggleSubscribe}
            disabled={subscribing}
            className={`px-5 py-2 rounded-lg font-medium shadow transition ${
              video.owner?.isSubscribed
                ? "bg-red-500 text-white hover:bg-red-700"
                : "bg-purple-400 text-black hover:bg-purple-600 hover:text-white"
            }`}
          >
            {subscribing
              ? "Processing..."
              : video.owner?.isSubscribed
              ? "Subscribed"
              : "Subscribe"}
          </button>

          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            disabled={liking}
            className={`flex cursor-pointer items-center space-x-1 px-3 py-1 rounded transition ${
              video.isLiked ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <GrLike />
            <span>{video.likesCount}</span>
          </button>

          {/* Dislike Button */}
          <button
            disabled
            className="flex cursor-pointer items-center space-x-1 px-3 py-1 rounded bg-gray-700 opacity-50"
          >
            <GrDislike />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-200 line-clamp-3">
        {video.description}
      </p>
    </div>
  );
}

export default VideoMeta;
