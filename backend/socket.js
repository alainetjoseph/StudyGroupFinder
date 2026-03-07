const { Server } = require("socket.io");
const Message = require("./Modals/Message");

let io;

// const initSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: [
//         "http://localhost:5173",
//         "https://study-group-finder-eta.vercel.app",
//       ],
//       credentials: true,
//     },
//   });
const allowedOrigins = [
  "http://localhost:5173",
  "https://study-group-finder-eta.vercel.app"
];
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          origin.startsWith("http://192.168.")
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
  });

  const app = require('./app');
  io.use((socket, next) => {
    app.sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  io.use((socket, next) => {
    if (socket.request.session && socket.request.session.user) {
      next();
    } else {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join group room
    socket.on("joinGroup", ({ groupId }) => {
      console.log("join group", groupId)
      socket.join(groupId);
    });

    socket.on("leaveGroup", ({ groupId }) => {
      console.log("leaving group", groupId)
      socket.leave(groupId);
    });



    // Handle message sending
    socket.on("sendMessage", async ({ groupId, text, isQuestion }) => {
      try {
        const Groups = require("./Modals/Groups");
        const groupCheck = await Groups.findById(groupId);
        if (groupCheck && groupCheck.isLocked) {
          socket.emit("errorMessage", { error: "GROUP_LOCKED", message: "This group is locked." });
          return;
        }

        const userId = socket.request.session.user;
        const newMessage = await Message.create({
          group: groupId,
          sender: userId,
          text: text,
          isQuestion: isQuestion || false
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

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
