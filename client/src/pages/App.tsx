import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io('http://localhost:3000'); // Replace with your backend URL

function App() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [usersConnected, setUsersConnected] = useState([]);

  useEffect(() => {
    // Listen for 'receive_message' event from the server
    socket.on('receive_message', (data) => {
      setReceivedMessages((prevMessages) => [...prevMessages, data.message]);
    });

    socket.on("users_connected", (userIds) => {
      setUsersConnected(userIds);
    })

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('receive_message');
    };
  }, []); // Run once on component mount

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { message }); // Emit 'send_message' event to the server
      setMessage(''); // Clear the input field
    }
  };

  console.log(usersConnected);
  

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-time Chat with Socket.IO, React, and Vite</h1>
      <div>
        <h2>Users connected:</h2>
        <ul>
          {usersConnected.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={sendMessage} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          Send Message
        </button>
      </div>
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
    </div>
  );
}

export default App;