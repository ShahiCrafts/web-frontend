import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";

export function useChat(conversationType, conversationId, currentUserId) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/messages`, {
        params: { conversationType, conversationId },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  }, [conversationType, conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("joinRoom", conversationId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leaveRoom", conversationId);
      socket.off("newMessage");
    };
  }, [socket, conversationId]);

  const sendMessage = (text, attachments = []) => {
    if (!socket || !conversationId) return;
    socket.emit("sendMessage", {
      conversationType,
      conversationId,
      author: currentUserId,
      text,
      attachments,
    });
  };

  return { messages, loading, sendMessage };
}
