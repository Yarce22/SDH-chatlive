const getUsers = async () => {
  try {
    const data = await fetch("http://localhost:3000/api/users");
    const users = await data.json();
    return users;
  } catch (error) {
    console.log("Error obteniendo los usuarios conectados", error);
    return { error: "Error obteniendo los usuarios conectados" };
  }
}

export default getUsers
