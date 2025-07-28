import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import io from 'socket.io-client';
import {getUsers, deleteUser} from '../services';
import deleteCookie from "../utils/deleteUserCookie"

const socket = io(import.meta.env.VITE_SERVER);

function Chat() {
  const [usersConnected, setUsersConnected] = useState<string[]>([""]);
  const [receiverUser, setReceiverUser] = useState<string>("");
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<{ senderId: string; message: string; room: string }[]>([]);
  const [privateRoom, setPrivateRoom] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const { usersConnected } = await getUsers()
      
      setUsersConnected(usersConnected.filter((user: string) => user !== document.cookie.split("=")[1]))
    }
    fetchUsers()
  }, [usersConnected])

  useEffect(() => {
    socket.on("users_connected", (data) => {
      setUsersConnected((prevUsers) => [...prevUsers, data.name])
    })

    socket.on('receive_private_message', ({ senderId, message, room }) => {
      setReceivedMessages((prevMessages) => [...prevMessages, {senderId, message, room}]);
      setPrivateRoom(room);
    });

    if (document.cookie.length === 0) {
      navigate("/register")
    }

    return () => {
      socket.off('receive_private_message');
      socket.off("users_connected");
    };
  }, [navigate, usersConnected]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim()) {
      socket.emit('send_private_message', { senderId: document.cookie.split("=")[1], message: message.trim() });
      setMessage(''); 
    }
  };

  const handleLogout = async () => {
    socket.emit("disconnect_user")

    await deleteUser(document.cookie.split("=")[1])
    
    deleteCookie("username")
    navigate("/register")
  }

  const startPrivateChat = (senderId: string, receiverId: string) => {
    socket.emit("start_private_chat", { senderId, receiverId });
    setReceiverUser(receiverId)
  } 

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-time Chat with Socket.IO, React, and Vite</h1>
      <section>
        <h2>Users connected:</h2>
        <div>
          {usersConnected.length ? usersConnected.map((user, index) => {
            return (
              <button key={index} onClick={() => startPrivateChat(document.cookie.split("=")[1], user)}>{user}</button>
            )
          }) : <p>No users connected</p>}
        </div>
      </section>

      <form onSubmit={sendMessage} style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>
          Send Message
        </button>
      </form>

      <section style={{ border: '1px solid #ccc', padding: '10px', minHeight: '150px', overflowY: 'auto' }}>
        {receivedMessages.length > 0 ? (
          <>
            <h2>Chat with {receiverUser}</h2>
            {receivedMessages.map((message, index) => {
              return (
                <div key={index}>
                  <p>{message.message}</p>
                </div>
              )
            })}
          </>
        ) : (
          <p>No private chat selected</p>
        )}
      </section>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Chat;