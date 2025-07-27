import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import io from 'socket.io-client';
import {getUsers, deleteUser} from '../services';
import deleteCookie from "../utils/deleteUserCookie"

// Connect to the Socket.IO server
const socket = io(import.meta.env.VITE_SERVER); // Replace with your backend URL

function Chat() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [usersConnected, setUsersConnected] = useState<string[]>([""]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const { usersConnected } = await getUsers()
      
      setUsersConnected(usersConnected.filter((user: string) => user !== document.cookie.split("=")[1]))
    }
    fetchUsers()
  }, [usersConnected])

  useEffect(() => {
    // Listen for 'receive_message' event from the server
    socket.on('receive_message', (data) => {
      setReceivedMessages((prevMessages) => [...prevMessages, data.message]);
    });

    socket.on("users_connected", (data) => {
      setUsersConnected((prevUsers) => [...prevUsers, data.name])
    })

    if (document.cookie.length === 0) {
      navigate("/register")
    }

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('receive_message');
      socket.off("users_connected");
    };
  }, [navigate, usersConnected]); // Run once on component mount

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim()) {
      socket.emit('send_message', { message }); // Emit 'send_message' event to the server
      setMessage(''); // Clear the input field
    }
  };

  const handleLogout = async () => {
    socket.emit("disconnect_user")

    await deleteUser(document.cookie.split("=")[1])
    
    deleteCookie("username")
    navigate("/register")
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-time Chat with Socket.IO, React, and Vite</h1>
      <div>
        <h2>Users connected:</h2>
        <ul>
          {usersConnected.map((user, index) => {
            return (
              <li key={index}>{user}</li>
            )
          })}
        </ul>
      </div>
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
      <h2>Messages:</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '150px', overflowY: 'auto' }}>
        {receivedMessages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul>
            {receivedMessages.map((msg, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Chat;