import { Server } from "socket.io";
import privateRoomChat from "./utils/privateRoomChat.js";

const usersConnected = new Set();

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
      usersConnected.add(data.name);
      io.emit("users_connected", Array.from(usersConnected));
    })

    socket.on("start_private_chat", ({ senderId, receiverId }) => {
      console.log({ senderId, receiverId })
      const roomName = privateRoomChat(senderId, receiverId)
      console.log(roomName);
      
      socket.join(roomName);
      socket.privateRoom = roomName;
    })
    
    socket.on('send_private_message', ({ message }) => {
      
      const room = socket.privateRoom;

      console.log({ message, room })

      io.to(room).emit('receive_private_message', { message, room });
    });

    socket.on("disconnect_user", () => {
      console.log("user disconnected " + socket.id);
      usersConnected.delete(socket.id);
      io.emit("users_connected", Array.from(usersConnected));
    })

    socket.on("disconnect", () => {
      console.log("user disconnected " + socket.id);
    })
  });
} 