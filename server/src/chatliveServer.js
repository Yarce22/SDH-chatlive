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

    usersConnected.add(socket.id);
    io.emit("users_connected", Array.from(usersConnected));
    
    console.log(usersConnected);
    

    socket.on('send_message', (data) => {
      io.emit('receive_message', data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected " + socket.id);
      usersConnected.delete(socket.id);
      io.emit("users_connected", Array.from(usersConnected));
      console.log(usersConnected);
    })
  });
} 