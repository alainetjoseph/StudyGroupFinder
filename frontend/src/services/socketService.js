import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      autoConnect: false, // Lazy connect
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    console.log("Socket initialized (autoConnect: false)");
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
