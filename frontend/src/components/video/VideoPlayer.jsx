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
      .get(`/api/v1/videos/v/${videoId}`,{ withCredentials: true})
      .then((res) => setVideo(res.data.data))
      .catch(() => setVideo(null))
      .finally(() => setLoading(false));
  }, [videoId]);

  if (loading) return <div className="text-white">Loading video...</div>;
  if (!video) return <div className="text-white">Video not found.</div>;

  return (
    <div className="flex mt-4 mm-1 gap-2 relative">
      {/* --- LEFT SIDE: Main Video Content --- */}
      <div className="flex-1 max-w-[800px]">
        <video
          src={video.videoFile?.url}
          controls
          width="560"
          height="315"
          className="w-250 rounded-lg shadow-lg"
          controlsList="nodownload"
        />
        <VideoMeta />
        <CommentCompo />
      </div>

      {/* --- RIGHT SIDE: Video List --- */}
      <div className="w-max sticky mr-0 top-0 h-screen overflow-y-scroll scrollbar-hide">
        <VideoList />
      </div>
    </div>
  );
}

export default VideoPlayer;
