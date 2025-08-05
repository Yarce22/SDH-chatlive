import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setMessage, setMessages } from "../features/messages/messagesSlice"
import { BackArrow } from "./BackArrow"

import type { Socket } from "socket.io-client"
import type { RootState } from "../app/store"

interface MessagesProps {
  socket: Socket
}

export const MessagesBox: React.FC<MessagesProps> = ({ socket }) => {
  const { myUsername } = useSelector((state: RootState) => state.user)
  const { receiverUser } = useSelector((state: RootState) => state.user)
  const { message } = useSelector((state: RootState) => state.messages)
  const { messages } = useSelector((state: RootState) => state.messages)
  const { room } = useSelector((state: RootState) => state.messages)
  const chatOpen = useSelector((state: RootState) => state.menu.chatOpen)
  const dispatch = useDispatch()

useEffect(() => {
  socket.on('room_messages', (messages) => {
    dispatch(setMessages(messages));
  });

  return () => {
    socket.off('room_messages');
  };
}, [socket, dispatch]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!message.trim()) return;

  const messageData = {
    myUsername,
    receiverUser,
    message,
    timestamp: new Date().toISOString(),
    room
  };

  try {
    socket.emit("send_message", messageData);
    
    dispatch(setMessage(""));
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }
};

  return (
    <section className={`${chatOpen ? "block" : "hidden"}`}>
      <div className="flex items-center gap-2">
        <BackArrow />
        <h2 className="font-bold text-2xl pb-1">Chat with {receiverUser}</h2>
      </div>
      {receiverUser ? (
        <>
          <ul>
            {messages.map(({ message }, index: number) => (
              <li key={index}>{message}</li>
            ))}
          </ul>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => dispatch(setMessage(e.target.value))}
              placeholder="Escribe un mensaje" />
            <button type="submit">Enviar</button>
          </form>
        </>
      ) : (
        <p>Select a user to chat</p>
      )}
    </section>
  )
}
