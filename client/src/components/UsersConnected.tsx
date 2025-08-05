import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setReceiverUser, setUsersConnected } from "../features/users/userSlice"
import { faker } from '@faker-js/faker';
import createRoom from "../utils/createRoom"

import type { RootState } from "../app/store"
import type { Socket } from "socket.io-client"
import { setRoom } from "../features/messages/messagesSlice"
import { setOpenChat } from "../features/UI/menuSlice";

interface UsersConnectedProps {
  socket: Socket
}

export const UsersConnected: React.FC<UsersConnectedProps> = ({ socket }) => {
  const myUsername = useSelector((state: RootState) => state.user.myUsername);
  const usersConnected = useSelector((state: RootState) => state.user.usersConnected);
  const chatOpen = useSelector((state: RootState) => state.menu.chatOpen);
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
    dispatch(setOpenChat(true))

    socket.emit("join_room", roomChat)
  }

  return (
    <section className={`${chatOpen ? "hidden" : ""}`}>
      <h2 className="font-bold pb-4">Users connected:</h2>
      <div className={`flex flex-col gap-2`}>
        {usersConnected.length < 1
          ? <p>No users connected</p>
          : usersConnected.map((user: string) => (
            <button
              key={user}
              onClick={() => handleChat(user)}
              className="flex items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={faker.image.avatar()} alt="userProfile" />
              </div>

              <div>
                <p className="font-bold">{user}</p>
              </div>
            </button>
          ))
        }
      </div>
    </section>
  )
}