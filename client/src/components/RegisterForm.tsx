import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/users/userSlice';
import { postUser } from '../services';
import { useUniqueUser } from '../hooks/useUniqueUser';


import type { RootState } from '../app/store';
import type { NavigateFunction } from 'react-router';

const socket = io(import.meta.env.VITE_SERVER)

export const RegisterForm = ({ navigate }: { navigate: NavigateFunction }) => {
  const username = useSelector((state: RootState) => state.user.myUsername);
  const dispatch = useDispatch()

  const { uniqueUser } = useUniqueUser(username)

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (uniqueUser) {
      alert("El nombre de usuario ya existe")
      return
    }

    if (username.trim() !== "") {
      document.cookie = "username=" + username;

      socket.emit("user_register", { name: username.trim() })

      const fetchPostUser = async () => {
        try {
          await postUser({ name: username.trim() })
          navigate("/")
        } catch (error) {
          return console.log("Error registrando el usuario", error)
        }
      }
      fetchPostUser()
    } else {
      alert("Por favor, introduce un nombre de usuario")
    }
  }

  return (
      <form onSubmit={handleRegister}>
          <label htmlFor="name">Name</label>
          <input
              type="text"
              name="name"
              id="name"
              value={username}
              onChange={(e) => dispatch(setUser(e.target.value))}
          />

          <button type="submit">Register</button>
      </form>
  )
}
