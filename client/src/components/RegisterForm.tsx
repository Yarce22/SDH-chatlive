import io from 'socket.io-client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/users/userSlice';

import type { RootState } from '../app/store';
import type { NavigateFunction } from 'react-router';

const socket = io(import.meta.env.VITE_SERVER)

export const RegisterForm = ({ navigate }: { navigate: NavigateFunction }) => {
  const myUsername = useSelector((state: RootState) => state.user.myUsername);
  const dispatch = useDispatch()

  useEffect(() => {
    socket.on("user_exists", ({ isUniqueUser }) => {
      if (isUniqueUser) {
        alert("El nombre de usuario ya existe")
      } else {
        navigate("/")
      }
    })

    return () => {
      socket.off("user_exists")
    }
  }, [navigate])

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const specialCharsRegex = /[@#$%^&*()_+=\-\[\]{};':"\\|,.<>/?~`]/;
    const hasSpecialChars = specialCharsRegex.test(myUsername.trim());

    if (hasSpecialChars) {
      alert("El nombre de usuario no debe contener caracteres especiales");
      return;
    }

    if (myUsername.trim() !== "") {
      document.cookie = "username=" + myUsername;
      socket.emit("register_user", { name: myUsername.trim() })
    } else {
      alert("Por favor, introduce un nombre de usuario")
    }
  }

  return (
    <>
      <form onSubmit={handleRegister} className='flex flex-col gap-2'>
          <label htmlFor="name" className='text-colorText font-semibold text-2xl'>Name:</label>
          <input
              type="text"
              name="name"
              id="name"
              value={myUsername}
              onChange={(e) => dispatch(setUser(e.target.value))}
              className='border-2 border-colorText rounded-md p-2 text-colorText font-semibold text-xl focus:outline-none focus:border-colorText'
          />

          <button
            type="submit"
            className='mt-5 bg-colorText text-bgPrimary rounded-md p-2 font-bold cursor-pointer hover:scale-105 transition-all active:bg-transparent active:text-colorText active:border-colorText active:border-2 text-2xl'
          >
            Register
          </button>
      </form>
    </>
  )
}
