import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoMeta from "./VideoMeta.jsx";
import CommentCompo from "../comments/CommentCompo.jsx";
import VideoList from "./VideoList.jsx";

function VideoPlayer() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/v1/videos/v/${videoId}`, { withCredentials: true })
      .then((res) => setVideo(res.data.data))
      .catch(() => setVideo(null))
      .finally(() => setLoading(false));
  }, [videoId]);

  if (loading)
    return <div className="text-white text-center mt-10">Loading video...</div>;
  if (!video)
    return <div className="text-white text-center mt-10">Video not found.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full min-h-screen bg-[#0f0f0f] px-3 sm:px-4 md:px-8 py-4">
      {/* --- LEFT SIDE: Main Video Content --- */}
      <div className="flex-1 w-full max-w-full md:max-w-[70%] mx-auto">
        {/* Video player */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <video
            src={video.videoFile?.url}
            controls
            className="absolute top-0 left-0 w-full h-full object-contain rounded-xl"
            controlsList="nodownload"
          />
        </div>

        {/* Video meta info */}
        <div className="mt-4">
          <VideoMeta />
        </div>

        {/* Comments */}
        <div className="mt-6">
          <CommentCompo />
        </div>
      </div>

      {/* --- RIGHT SIDE: Recommended Video List --- */}
      <div className="md:w-[30%] w-full md:sticky mt-12 md:top-0 md:h-[calc(100vh-2rem)] md:overflow-y-auto scrollbar-hide mx-auto">
        <VideoList />
      </div>
    </div>
  );
}

export default VideoPlayer;
