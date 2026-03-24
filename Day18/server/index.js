const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chatbot-beta-five-75.vercel.app"],
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: ["http://localhost:5173", "https://chatbot-beta-five-75.vercel.app"] }));
app.use(express.json());

// --- In-memory data store ---
const channels = [
  { id: "1", name: "general", description: "General discussion for everyone" },
  { id: "2", name: "tech-talk", description: "All things technology" },
  { id: "3", name: "random", description: "Random stuff goes here" },
  { id: "4", name: "announcements", description: "Important announcements" },
];

const messages = {
  "1": [
    { id: "m1", channelId: "1", author: "Alice", text: "Hey everyone! Welcome to the general channel 👋", timestamp: Date.now() - 300000, avatar: "A" },
    { id: "m2", channelId: "1", author: "Bob", text: "Thanks! Happy to be here 😊", timestamp: Date.now() - 250000, avatar: "B" },
    { id: "m3", channelId: "1", author: "Charlie", text: "This chat app is really cool!", timestamp: Date.now() - 120000, avatar: "C" },
  ],
  "2": [
    { id: "m4", channelId: "2", author: "Alice", text: "Anyone tried the new RTK Query features?", timestamp: Date.now() - 600000, avatar: "A" },
    { id: "m5", channelId: "2", author: "Dave", text: "Yes! The cache invalidation is so smooth now.", timestamp: Date.now() - 500000, avatar: "D" },
    { id: "m6", channelId: "2", author: "Bob", text: "Socket.IO + RTK Query is a killer combo 🔥", timestamp: Date.now() - 400000, avatar: "B" },
  ],
  "3": [
    { id: "m7", channelId: "3", author: "Charlie", text: "Did anyone see that movie last night?", timestamp: Date.now() - 900000, avatar: "C" },
    { id: "m8", channelId: "3", author: "Eve", text: "Which one? 🎬", timestamp: Date.now() - 850000, avatar: "E" },
  ],
  "4": [
    { id: "m9", channelId: "4", author: "Admin", text: "🎉 Welcome to our new chat platform! Please read the rules.", timestamp: Date.now() - 1200000, avatar: "AD" },
  ],
};

// --- REST API Endpoints ---
app.get("/api/channels", (req, res) => {
  res.json(channels);
});

app.get("/api/channels/:id/messages", (req, res) => {
  const { id } = req.params;
  const channelMessages = messages[id] || [];
  res.json(channelMessages);
});

// --- Socket.IO ---
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join a channel room
  socket.on("join_channel", (channelId) => {
    // Leave all existing rooms (except own socket room)
    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });
    socket.join(channelId);
    console.log(`🚪 Socket ${socket.id} joined channel: ${channelId}`);
  });

  // Handle a sent message
  socket.on("send_message", ({ channelId, author, text }) => {
    const newMessage = {
      id: `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      channelId,
      author,
      text,
      timestamp: Date.now(),
      avatar: author.charAt(0).toUpperCase(),
    };

    // Store it in memory
    if (!messages[channelId]) messages[channelId] = [];
    messages[channelId].push(newMessage);

    // Broadcast to everyone in the channel room
    io.to(channelId).emit("receive_message", newMessage);
    console.log(`💬 [Channel ${channelId}] ${author}: ${text}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
