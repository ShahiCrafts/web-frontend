import { useState, useEffect } from "react";
import { socket } from "../../services/socket"; // Import the shared socket instance
import axios from "axios";

// Create an Axios instance for API calls.
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Make sure this is your correct API URL
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    console.log(`[useComments] Hook running for postId: ${postId}`);

    // 1. Fetch initial comments via REST API
    const fetchComments = async () => {
      try {
        console.log(
          `[useComments] Fetching initial comments for postId: ${postId}`
        );
        setIsLoading(true);
        const response = await api.get(`/comments/${postId}`);
        setComments(response.data);
        console.log("[useComments] Successfully fetched initial comments.");
      } catch (error) {
        console.error("[useComments] Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();

    // 2. Join the socket room for this post
    console.log(`[useComments] Emitting "joinPostRoom" for postId: ${postId}`);
    socket.emit("joinPostRoom", postId);

    // 3. Define handlers for real-time events
    const handleNewComment = (newComment) => {
      console.log('[useComments] Received "newComment" event:', newComment);
      setComments((prevComments) => [newComment, ...prevComments]);
    };

    const handleCommentLikeUpdate = (updatedComment) => {
      console.log('[useComments] Received "commentLikeUpdate" event:', updatedComment);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id 
            ? updatedComment 
            : comment
        )
      );
    };

    const handleCommentDeleted = (data) => {
      console.log('[useComments] Received "commentDeleted" event:', data);
      setComments((prev) =>
        prev.map((c) =>
          c._id === data.commentId
            ? { ...c, isDeleted: true, content: "[deleted]" }
            : c
        )
      );
    };

    // 4. Register the listeners
    console.log("[useComments] Registering socket event listeners...");
    socket.on("newComment", handleNewComment);
    socket.on("commentLikeUpdate", handleCommentLikeUpdate);
    socket.on("commentDeleted", handleCommentDeleted);

    // 5. Cleanup on unmount
    return () => {
      console.log(
        `[useComments] Cleanup: Leaving room and removing listeners for postId: ${postId}`
      );
      socket.emit("leavePostRoom", postId);
      socket.off("newComment", handleNewComment);
      socket.off("commentLikeUpdate", handleCommentLikeUpdate);
      socket.off("commentDeleted", handleCommentDeleted);
    };
  }, [postId]);

  // Functions to be called from the component to emit events
  const createComment = (content, parentId = null) => {
    const payload = { postId, content, parentId };
    console.log('[useComments] Emitting "createComment":', payload);
    socket.emit("createComment", payload);
  };

  const toggleLike = (commentId) => {
    const payload = { commentId };
    console.log('[useComments] Emitting "toggleLikeComment":', payload);
    socket.emit("toggleLikeComment", payload);
  };

  const deleteComment = (commentId) => {
    const payload = { commentId };
    console.log('[useComments] Emitting "deleteComment":', payload);
    socket.emit("deleteComment", payload);
  };

  return { comments, isLoading, createComment, toggleLike, deleteComment };
};
