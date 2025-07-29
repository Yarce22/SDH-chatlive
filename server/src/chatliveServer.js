import { Server } from "socket.io";
import privateRoomChat from "./utils/privateRoomChat.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const usersPath = path.join(__dirname, "../services/users.json");

export default function realtimeServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    socket.privateRoom = "";

    socket.on("user_register", (data) => {
      console.log(data)
      io.emit("user_connected", { username: data.name })
    })
    
    socket.on('send_message', ({ myUsername, receiverUser, message }) => {
      console.log({ myUsername, receiverUser, message })

      const room = privateRoomChat(myUsername, receiverUser)
      socket.privateRoom = room

      socket.join(room)

      io.to(room).emit('receive_message', { myUsername, receiverUser, message, room });
    });

    socket.on("disconnect_user", async (username) => {
      try {

        io.emit("user_disconnected", { username });
      } catch (error) {
        console.log("Error eliminando un usuario", error)
      }
    })

    socket.on("disconnect", () => {
      console.log("user disconnected " + socket.id);
    })
  });
} 