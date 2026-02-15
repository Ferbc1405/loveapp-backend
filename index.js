import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("💜 Usuario conectado:", socket.id);

  socket.on("join-pair", (pairId) => {
    socket.join(pairId);
    console.log("🔗 Unido al pair:", pairId);
  });

  socket.on("send-pulse", ({ pairId, type }) => {
    socket.to(pairId).emit("receive-pulse", {
      type,
      at: Date.now()
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Usuario desconectado:", socket.id);
  });
});

// 🔥 CLAVE PARA RENDER / PRODUCCIÓN
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend + Socket listo en puerto ${PORT}`);
});