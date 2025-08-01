import { Server } from "socket.io";
import { subscribeToRoomMessages, sendMessage } from './services/messagesServices.js';

export default function realtimeServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  const connectedUsers = new Set()
  
  io.on('connection', (socket) => {
    socket.privateRoom = "";
    socket.username = "";
    socket.unsubscribeMessages = null;
    socket.hasMore = true

    socket.on("register_user", ({ name }) => {
      console.log(name)

      const isUniqueUser = connectedUsers.has(name)

      if (isUniqueUser) {
        socket.emit("user_exists", { isUniqueUser })
        return
      }

      connectedUsers.add(name)
      socket.username = name
      socket.emit("user_exists", { isUniqueUser })

      io.emit("user_connected", Array.from(connectedUsers))
    })

    socket.on("request_users", () => {
      socket.emit("users_list", Array.from(connectedUsers));
    });

    socket.on("join_room", (room) => {
      console.log(room)
      try {
        if (socket.unsubscribeMessages) {
          socket.unsubscribeMessages();
        }
    
        if (socket.privateRoom) {
          socket.leave(socket.privateRoom);
        }
    
        socket.join(room);
        socket.privateRoom = room;
    
        socket.unsubscribeMessages = subscribeToRoomMessages(room, ({messages, hasMore}) => {
          socket.hasMore = hasMore
          socket.emit('room_messages', messages);
        }, 20);
    
        console.log(`Usuario ${socket.username} se unió a la sala ${room}`);
    
      } catch (error) {
        console.error('Error al unirse a la sala:', error);
        socket.emit('error', { message: 'Error al unirse a la sala' });
      }
    });
    
    socket.on('send_message', async ({ myUsername, message, timestamp, room }) => {
      sendMessage(room, message, timestamp, myUsername)
    });

    socket.on("user_disconnected", (user) => {
      connectedUsers.delete(user);
      io.emit("user_disconnected", Array.from(connectedUsers));
    })

    socket.on("disconnect", () => {
      console.log("user disconnected " + socket.id);
      if (socket.unsubscribeMessages) {
        socket.unsubscribeMessages();
      }
    })
  });
} 