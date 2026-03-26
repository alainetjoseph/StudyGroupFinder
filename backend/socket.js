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
    // Avoid using socket.request.res as per requirement
    app.sessionMiddleware(socket.request, {}, next);
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
    socket.on("joinGroup", async ({ groupId }) => {
      try {
        const userId = socket.request.session.user;
        const Groups = require("./Modals/Groups");
        const group = await Groups.findById(groupId);

        if (!group) {
          return socket.emit("errorMessage", { message: "Group not found" });
        }

        const isMember = group.members.some(m => String(m) === String(userId));
        if (!isMember) {
          return socket.emit("errorMessage", { message: "Unauthorized: You are not a member of this group" });
        }

        console.log("join group", groupId);
        socket.join(groupId);
      } catch (err) {
        console.error("Join group error:", err);
        socket.emit("errorMessage", { message: "Failed to join group" });
      }
    });

    socket.on("leaveGroup", ({ groupId }) => {
      console.log("leaving group", groupId);
      socket.leave(groupId);
    });



    // Handle message sending
    socket.on("sendMessage", async ({ groupId, text, isQuestion, tempId }) => {
      try {
        const userId = socket.request.session.user;
        const Groups = require("./Modals/Groups");
        const groupCheck = await Groups.findById(groupId);

        if (!groupCheck) {
          return socket.emit("errorMessage", { message: "Group not found" });
        }

        // Validate membership
        const isMember = groupCheck.members.some(m => String(m) === String(userId));
        if (!isMember) {
          return socket.emit("errorMessage", { message: "Unauthorized: You cannot send messages to this group" });
        }

        if (groupCheck.isLocked) {
          socket.emit("errorMessage", { error: "GROUP_LOCKED", message: "This group is locked." });
          return;
        }

        const newMessage = await Message.create({
          group: groupId,
          sender: userId,
          text: text,
          isQuestion: isQuestion || false
        });

        const populated = await newMessage.populate("sender", "name");

        // Convert to plain object and add tempId for frontend deduplication
        const messageData = populated.toObject();
        if (tempId) {
          messageData.tempId = tempId;
        }

        io.to(groupId).emit("receiveMessage", messageData);
      } catch (err) {
        console.error("Message error:", err);
        socket.emit("errorMessage", { message: "Failed to send message" });
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
