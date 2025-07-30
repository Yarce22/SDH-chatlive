import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMessages, getUsers } from "../services"
import { setUsersConnected, setReceiverUser } from "../features/users/userSlice"
import createRoom from "../utils/createRoom"

import type { RootState } from "../app/store"
import type { Socket } from "socket.io-client"
import { setMessages, setRoom } from "../features/messages/messagesSlice"

interface UsersConnectedProps {
  socket: Socket
}

export const UsersConnected: React.FC<UsersConnectedProps> = ({ socket }) => {
  const myUsername = useSelector((state: RootState) => state.user.myUsername);
  const usersConnected = useSelector((state: RootState) => state.user.usersConnected);
  const room = useSelector((state: RootState) => state.messages.room);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGetUsers = async () => {
      try {
        const { usersConnected } = await getUsers();
        const usersFiltered = usersConnected.filter((user: string) => user !== myUsername);
        dispatch(setUsersConnected(usersFiltered))
      } catch (error) {
        console.log("Error cargando los usuarios conectados", error)
      }
    }

    fetchGetUsers()

    socket.on("user_connected", fetchGetUsers)
    socket.on("user_disconnected", fetchGetUsers)

    return () => {
      socket.off("user_connected", fetchGetUsers)
      socket.off("user_disconnected", fetchGetUsers)
    }
  }, [dispatch, myUsername, socket])

  const handleChat = (user: string) => {
    const roomChat = createRoom(myUsername, user)

    const fetchGetMessages = async () => {
      try {
        const { messages } = await getMessages(roomChat);
        if (!messages) {
          dispatch(setMessages([]))
        } else {
          dispatch(setMessages(messages))
        }
      } catch (error) {
        console.log("Error cargando los mensajes", error)
      }
    }

    fetchGetMessages()

    dispatch(setRoom(roomChat))
    dispatch(setReceiverUser(user))

    socket.emit("join_room", roomChat)
  }
  
  console.log("room", room);
  return (
    <section>
      <h2>Users connected:</h2>
      <div>
        {usersConnected.map((user: string) => (
          <button key={user} onClick={() => handleChat(user)}>{user}</button>
        ))}
      </div>
    </section>
  )
}