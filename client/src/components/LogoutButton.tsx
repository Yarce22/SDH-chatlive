import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../features/users/userSlice"
import deleteCookie from "../utils/deleteUserCookie"
import logoutIcon from "../assets/logoutIcon.png"

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
    socket.emit("user_disconnected", username)

    dispatch(setUser(""))
    deleteCookie("username")
    navigate("/register")
  }

  return (
    <button
      onClick={handleLogout}
      className="w-5 h-5  "
    >
      <img src={logoutIcon} alt="logout-icon" />
    </button>
  )
}