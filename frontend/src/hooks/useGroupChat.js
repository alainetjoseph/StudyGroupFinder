import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { getSocket, connectSocket } from "../services/socketService";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const useGroupChat = (groupId, user) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoadingMessages(true);
      const res = await axios.get(`${BACKEND}/groups/${groupId}/messages`, {
        withCredentials: true
      });
      setMessages(res.data);
      setError(null);
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }, [groupId]);

  const sendMessage = useCallback(({ text, isQuestion }) => {
    if (!groupId || !text.trim()) return;

    const socket = getSocket();
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      tempId,
      sender: user,
      text,
      isQuestion: isQuestion || false,
      createdAt: new Date().toISOString(),
      optimistic: true
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    if (!socket.connected) {
      enqueueSnackbar("Lost connection. Reconnecting...", { variant: "warning" });
      connectSocket();
      // Note: In a real app, you'd queue this message to be sent after connect.
      // For now, we'll rely on the user to send it again or the frontend to retry.
    }

    socket.emit("sendMessage", {
      groupId,
      text,
      isQuestion,
      tempId
    });
  }, [groupId, user]);

  useEffect(() => {
    if (!groupId) return;

    fetchMessages();

    const socket = getSocket();

    const onConnect = () => {
      console.log("Socket connected, joining group:", groupId);
      socket.emit("joinGroup", { groupId });
    };

    const handleReceive = (message) => {
      setMessages((prev) => {
        // If we have a tempId, replace the optimistic message
        if (message.tempId) {
          const exists = prev.some(m => m.tempId === message.tempId || m._id === message.tempId);
          if (exists) {
            return prev.map(m => (m.tempId === message.tempId || m._id === message.tempId) ? message : m);
          }
        }
        
        // Final fallback deduplication based on text and sender if tempId fails for some reason
        const filtered = prev.filter(m => !(m.optimistic && m.text === message.text && (m.sender?._id || m.sender) === (message.sender?._id || message.sender)));
        return [...filtered, message];
      });
    };

    const handleUpdate = (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === data.messageId
            ? { ...m, text: data.text, edited: true }
            : m
        )
      );
    };

    const handleDelete = (data) => {
      setMessages((prev) => prev.filter((m) => m._id !== data.messageId));
    };

    const handleError = (data) => {
      enqueueSnackbar(data.message, { variant: "error" });
    };

    // Ensure we join if already connected
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("receiveMessage", handleReceive);
    socket.on("messageUpdated", handleUpdate);
    socket.on("messageDeleted", handleDelete);
    socket.on("errorMessage", handleError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receiveMessage", handleReceive);
      socket.off("messageUpdated", handleUpdate);
      socket.off("messageDeleted", handleDelete);
      socket.off("errorMessage", handleError);
    };
  }, [groupId, fetchMessages]);

  return {
    messages,
    setMessages,
    loadingMessages,
    error,
    sendMessage,
    refreshMessages: fetchMessages
  };
};
