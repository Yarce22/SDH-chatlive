import { useEffect, useState } from "react";
import { getUsers } from "../services";

export const useUniqueUser = (user: string) => {
    const [uniqueUser, setUniqueUser] = useState<boolean>()

    useEffect(() => {
        const fetchGetUsers = async () => {
            try {
                const { usersConnected } = await getUsers();
                setUniqueUser(usersConnected.includes(user))
            } catch (error) {
                console.log("Error cargando los usuarios conectados", error)
            }
        }
        fetchGetUsers()
    }, [user])

    return { uniqueUser }
}
