import { BurgerIcon } from "./BurgerIcon"
import { LogoutButton } from "./LogoutButton"

import type { Socket } from "socket.io-client"
import type { NavigateFunction } from "react-router"

interface LogoutButtonProps {
  socket: Socket
  navigate: NavigateFunction
}

const Menu: React.FC<LogoutButtonProps> = ({ socket, navigate }: LogoutButtonProps) => {
  return (
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-xl font-bold">SDH-ChatLive</h1>
      
      <div className="flex gap-2">
        <LogoutButton socket={socket} navigate={navigate}/>
        <BurgerIcon />
      </div>
    </header>
  )
}

export { Menu }
