import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const usersPath = path.join(__dirname, "./services/users.json");

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

    socket.on("join_room", (room) => {
      if (socket.privateRoom) {
        socket.leave(socket.privateRoom)
      }

      socket.join(room)
      socket.privateRoom = room
    })
    
    socket.on('send_message', ({ myUsername, receiverUser, message, timestamp, room }) => {
      console.log({ sender: myUsername, receiverUser, message, timestamp, room })

      const db = JSON.parse(fs.readFileSync(usersPath, "utf-8"))

      if (!db[room]) {
        db[room] = {
          messages: []
        }
      }

      db[room].messages.push({ message, timestamp, sender: myUsername })

      fs.writeFileSync(usersPath, JSON.stringify(db, null, 2))

      io.to(room).emit('receive_message', db[room].messages);
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