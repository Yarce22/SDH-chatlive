import io from 'socket.io-client';
import { useNavigate } from 'react-router';
import { UsersConnected } from '../components/UsersConnected';
import { MessagesBox } from '../components/MessagesBox';
import { LogoutButton } from '../components/LogoutButton';
import { useEffect } from 'react';

const socket = io(import.meta.env.VITE_SERVER);

const Chat = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (document.cookie.length === 0) {
      navigate("/register")
    }
  }, [navigate])


  return (
    <section>
      <UsersConnected socket={socket} />
      <MessagesBox socket={socket} />
      <LogoutButton socket={socket} navigate={navigate}/>
    </section>
  )
}

export default Chat