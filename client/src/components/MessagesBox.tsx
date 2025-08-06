import { useEffect, useRef } from "react"
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
  
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
    <section className={`${chatOpen ? "flex flex-col h-screen" : "hidden"}`}>
      <div className="flex items-center gap-2 p-4 border-b">
        <BackArrow />
        <h2 className="font-bold text-2xl">Chat with {receiverUser}</h2>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-14rem)]"
      >
        {receiverUser ? (
          <ul className="flex flex-col gap-2">
            {messages.map(({ message, sender, timestamp }) => {
              if (sender === myUsername) {
                return (
                  <li
                    key={timestamp}
                    className="relative flex justify-self-start w-3/4 gap-2 bg-messageSender p-2 rounded-br-lg rounded-bl-lg rounded-tr-lg"
                  >
                    <p>{message}</p>
                    <p className="absolute bottom-1 right-2 text-xs opacity-75">{new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  </li>
                )
              } else {
                return (
                  <li
                    key={timestamp}
                    className="relative flex ml-auto w-3/4 gap-2 bg-messageReceiver p-2 rounded-br-lg rounded-bl-lg rounded-tl-lg"
                  >
                    <p>{message}</p>
                    <p className="absolute bottom-1 right-2 text-xs opacity-75">{new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  </li>
                )
              }
            })}
          </ul>
        ) : (
          <p>Select a user to chat</p>
        )}
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 w-full"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => dispatch(setMessage(e.target.value))}
            placeholder="Escribe un mensaje"
            className="flex-1 border-2 border-colorText rounded-md p-2 text-colorText focus:outline-none focus:border-colorText focus:border-2"
          />
          <button 
            type="submit" 
            className="bg-colorText text-bgPrimary rounded-md px-4 font-bold cursor-pointer hover:bg-opacity-90 active:bg-opacity-80"
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  )
}
