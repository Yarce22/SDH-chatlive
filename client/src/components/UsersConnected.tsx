import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setReceiverUser, setUsersConnected } from "../features/users/userSlice"
import createRoom from "../utils/createRoom"

import type { RootState } from "../app/store"
import type { Socket } from "socket.io-client"
import { setRoom } from "../features/messages/messagesSlice"

interface UsersConnectedProps {
  socket: Socket
}

export const UsersConnected: React.FC<UsersConnectedProps> = ({ socket }) => {
  const myUsername = useSelector((state: RootState) => state.user.myUsername);
  const usersConnected = useSelector((state: RootState) => state.user.usersConnected);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("request_users");

    const handleUsersUpdate = (users: string[]) => {
      dispatch(setUsersConnected(users.filter((user: string) => user !== myUsername)))
    }

    socket.on("user_connected", handleUsersUpdate);
    socket.on("user_disconnected", handleUsersUpdate);
    socket.on("users_list", handleUsersUpdate);

    return () => {
      socket.off("user_connected")
      socket.off("user_disconnected")
      socket.off("users_list")
    }
  }, [dispatch, socket, myUsername])

  const handleChat = (user: string) => {
    const roomChat = createRoom(myUsername, user)

    dispatch(setRoom(roomChat))
    dispatch(setReceiverUser(user))

    socket.emit("join_room", roomChat)
  }

  return (
    <section>
      <h2>Users connected:</h2>
      <div>
        {usersConnected.length < 1
          ? <p>No users connected</p>
          : usersConnected.map((user: string) => (
            <button key={user} onClick={() => handleChat(user)}>{user}</button>
          ))
        }
      </div>
    </section>
  )
}