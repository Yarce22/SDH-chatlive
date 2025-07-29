import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setMessage, setMessages, setRoom } from "../features/messages/messagesSlice"

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
  const dispatch = useDispatch()

  useEffect(() => {
    socket.on("receive_message", ({ message, room }) => {
      dispatch(setMessages([...messages, message]))
      dispatch(setRoom(room))
    })
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    socket.emit("send_message", { myUsername, receiverUser, message })

    dispatch(setMessage(""))
  }

  console.log(messages);

  return (
    <section>
      {receiverUser ? (
        <>
          <h2>Chat with {receiverUser}</h2>
          <ul>
            {messages.map((message: string, index: number) => (
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
