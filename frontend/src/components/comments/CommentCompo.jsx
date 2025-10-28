import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FcLike } from "react-icons/fc";

function CommentCompo() {
  const { videoId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const [visibleCount, setVisibleCount] = useState(5);
  const COMMENTS_INCREMENT = 5;

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);

    axios
      .get(`/api/v1/comments/c/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        const commentsArray = Array.isArray(res.data.data?.docs)
          ? res.data.data.docs
          : [];
        setComments(commentsArray);
        setError(null);
      })
      .catch((err) => {
        console.error(err.response || err);
        setError("Failed to load comments");
        setComments([]);
      })
      .finally(() => setLoading(false));
  }, [videoId, token]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    axios
      .post(
        `/api/v1/comments/c/${videoId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      )
      .then((res) => {
        const addedComment = res.data.data || res.data;
        setComments((prev) => [addedComment, ...prev]);
        setNewComment("");
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to post comment:", err.response || err);
        setError("Failed to post comment");
      })
      .finally(() => setPosting(false));
  };

  const handleDelete = (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    axios
      .delete(`/api/v1/comments/c/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(() => {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      })
      .catch((err) => {
        console.error("Failed to delete comment:", err.response || err);
        setError("Failed to delete comment");
      });
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditingContent(comment.content || "");
  };

  const handleEditSave = (commentId) => {
    if (!editingContent.trim()) return;

    axios
      .patch(
        `/api/v1/comments/c/${commentId}`,
        { content: editingContent },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      )
      .then((res) => {
        const updatedComment = res.data.data || res.data;
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? updatedComment : c))
        );
        setEditingId(null);
        setEditingContent("");
      })
      .catch((err) => {
        console.error("Failed to update comment:", err.response || err);
        setError("Failed to update comment");
      });
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!commentId) return;

    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, isAnimating: true } : c
      )
    );

    setTimeout(() => {
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, isAnimating: false } : c
        )
      );
    }, 300);

    try {
      const res = await axios.post(
        `/api/v1/likes/toggle/d/${commentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) {
            const liked = !c.isLiked;
            const newLikesCount = liked
              ? (c.likesCount || 0) + 1
              : (c.likesCount || 1) - 1;
            return {
              ...c,
              isLiked: liked,
              likesCount: newLikesCount,
              isAnimating: false,
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
      setError("Could not toggle like");
    }
  };

  return (
    <section className="w-full bg-gray-400 dark:bg-[#18181b] dark:text-white shadow p-4 flex flex-col rounded-md">
      <h2 className="text-lg md:text-xl text-purple-700 font-semibold mb-4">
        Comments
      </h2>

      {loading && <p>Loading comments...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && comments.length === 0 && <p>No comments yet.</p>}

      <ul className="mb-4 space-y-4">
        {Array.isArray(comments) &&
          comments.slice(0, visibleCount).map((comment) => (
            <li
              key={comment._id}
              className="border-b pb-2 flex flex-col gap-1 break-words"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="font-semibold text-black dark:text-yellow-400 text-sm md:text-base">
                  {comment.owner?.username || comment.user || "User"}
                </p>

                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>

              {editingId === comment._id ? (
                <div className="flex flex-col space-y-2">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={2}
                    className="border p-1 rounded resize-none text-black"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEditSave(comment._id)}
                      className="bg-green-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-black py-1 px-3 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm md:text-base text-black dark:text-white break-words">
                  {comment.content}
                </p>
              )}

              {/* Like / Edit / Delete Buttons */}
              <div className="flex flex-wrap gap-3 mt-1 text-sm items-center">
                <button
                  onClick={() => handleToggleCommentLike(comment._id)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <span
                    className={`transition-transform duration-300 ${
                      comment.isAnimating ? "scale-125" : "scale-100"
                    }`}
                  >
                    <FcLike size={20} />
                  </span>
                  <span>{comment.likesCount || 0}</span>
                </button>

                <button
                  onClick={() => startEdit(comment)}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <CiEdit size={20} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <MdDeleteOutline size={20} /> Delete
                </button>
              </div>
            </li>
          ))}
      </ul>

      {visibleCount < comments.length && (
        <button
          onClick={() => setVisibleCount(visibleCount + COMMENTS_INCREMENT)}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 self-center mb-4"
        >
          Show More Comments
        </button>
      )}

      <form onSubmit={handleAddComment} className="flex flex-col space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Write a comment..."
          className="border p-2 rounded resize-none text-black dark:text-white"
          disabled={posting}
        />
        <button
          type="submit"
          disabled={posting || !newComment.trim()}
          className="bg-purple-600 cursor-pointer text-white py-2 rounded disabled:opacity-50 hover:bg-purple-700"
        >
          {posting ? "Posting..." : "Add Comment"}
        </button>
      </form>
    </section>
  );
}

export default CommentCompo;
