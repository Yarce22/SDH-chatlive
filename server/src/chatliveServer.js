import { Server } from "socket.io";

const usersConnected = new Set();

export default function realtimeServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    console.log("user connected " + socket.id);
    socket.on("user_register", (data) => {
      console.log(data)
      usersConnected.add(data.name);
      io.emit("users_connected", Array.from(usersConnected));
    })
    
    socket.on('send_message', (data) => {
      console.log(data)
      io.emit('receive_message', data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected " + socket.id);
    })
  });
} 