const getUsers = async () => {
  try {
    const data = await fetch(`${import.meta.env.VITE_SERVER}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const users = await data.json();
    return users;
  } catch (error) {
    console.log("Error obteniendo los usuarios conectados", error);
    return { error: "Error obteniendo los usuarios conectados" };
  }
}

const postUser = async (body: object) => {
  try {
    const data = await fetch(`${import.meta.env.VITE_SERVER}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const users = await data.json();
    return users;
  } catch (error) {
    console.log("Error agregando un usuario", error);
    return { error: "Error agregando un usuario" };
  }
}

const deleteUser = async (user: string) => {
  try { 
    const data = await fetch(`${import.meta.env.VITE_SERVER}/api/users/${user}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const users = await data.json();
    return users;
  } catch (error) {
    console.log("Error eliminando un usuario", error);
    return { error: "Error eliminando un usuario" };
  }
}

export { getUsers, postUser, deleteUser }
