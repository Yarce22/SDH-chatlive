import io from 'socket.io-client';
import { useNavigate } from 'react-router';
import { UsersConnected } from '../components/UsersConnected';
import { MessagesBox } from '../components/MessagesBox';
import { useEffect } from 'react';
import { Menu } from '../components/Menu';

const socket = io(import.meta.env.VITE_SERVER);

const Chat = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (document.cookie.length === 0) {
      navigate("/register")
    }
  }, [navigate])


  return (
    <section className='flex flex-col px-4 py-2 bg-bgPrimary text-colorText h-screen'>
      <Menu socket={socket} navigate={navigate}/>
      <UsersConnected socket={socket} />
      <MessagesBox socket={socket} />
    </section>
  )
}

export default Chat