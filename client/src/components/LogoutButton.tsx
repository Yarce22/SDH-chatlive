import { useDispatch, useSelector } from "react-redux"
import { deleteUser } from "../services"
import { setUser } from "../features/users/userSlice"
import deleteCookie from "../utils/deleteUserCookie"

import type { NavigateFunction } from "react-router"
import type { RootState } from "../app/store"
import type { Socket } from "socket.io-client"

interface LogoutButtonProps {
  socket: Socket
  navigate: NavigateFunction
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ socket, navigate }) => {
  const username = useSelector((state: RootState) => state.user.myUsername)
  const dispatch = useDispatch()

  const handleLogout = () => {
    const fetchDeleteUser = async () => {
      try {
        await deleteUser(username)
        socket.emit("disconnect_user", username)
      } catch (error) {
        return console.log("Error eliminando el usuario", error)
      }
    }
    fetchDeleteUser()

    dispatch(setUser(""))
    deleteCookie("username")
    navigate("/register")
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}