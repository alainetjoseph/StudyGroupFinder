const { Server } = require("socket.io");
const Message = require("./Modals/Message");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://study-group-finder-eta.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join group room
    socket.on("joinGroup", ({ groupId }) => {
      socket.join(groupId);
    });

    // Handle message sending
    socket.on("sendMessage", async ({ groupId, userId, text }) => {
      try {
        const newMessage = await Message.create({
          group: groupId,
          sender: userId,
          text,
        });

        const populated = await newMessage.populate("sender", "name");

        io.to(groupId).emit("receiveMessage", populated);
      } catch (err) {
        console.error("Message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });

  return io;
};

module.exports = initSocket;
