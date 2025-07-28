import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import io from 'socket.io-client';
import { postUser } from '../services';

const socket = io(import.meta.env.VITE_SERVER)

export default function Register() {
    const [name, setName] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        if(document.cookie.length > 0) {
            navigate("/")
        }
    }, [navigate])
    
    const sendUserRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (name.trim() !== "") {
            document.cookie = "username=" + name;

            socket.emit("user_register", { name: name.trim() })
            
            const fetchUsers = async () => {
                try {
                    await postUser({ name: name.trim(), privateRoom })
                    navigate("/")
                } catch (error) {
                    return console.log("Error agregando un usuario", error)
                }
            }
            fetchUsers()
        } else {
            alert("Por favor, introduce un nombre de usuario")
        }
    }

    return (
        <section>
            {/* <div>
                <img src="" alt="" />
            </div> */}

            <form onSubmit={sendUserRegister}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button type="submit">Register</button>
            </form>

            <div>
                <h1>Welcome to SDH ChatLive.</h1>
            </div>
        </section>
    )
}