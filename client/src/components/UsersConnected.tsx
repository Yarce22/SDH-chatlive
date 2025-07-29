import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers } from "../services"
import { setUsersConnected, setReceiverUser } from "../features/users/userSlice"

import type { RootState } from "../app/store"
import type { Socket } from "socket.io-client"

interface UsersConnectedProps {
  socket: Socket
}

export const UsersConnected: React.FC<UsersConnectedProps> = ({ socket }) => {
  const username = useSelector((state: RootState) => state.user.myUsername);
  const usersConnected = useSelector((state: RootState) => state.user.usersConnected);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGetUsers = async () => {
      try {
        const { usersConnected } = await getUsers();
        const usersFiltered = usersConnected.filter((user: string) => user !== username);
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
  }, [dispatch, username, socket])

  const handleChat = (user: string) => {
    dispatch(setReceiverUser(user))
  }

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