import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import userEstructure from "../utils/userEstructure.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const usersPath = path.join(__dirname, "../services/users.json");

export const getUsersController = async (req, res) => {
  try {
    fs.readFile(usersPath, "utf-8", (err, data) => {
      const users = JSON.parse(data)
      res.json(users)
    })
  } catch (error) {
    console.log("Error obteniendo los usuarios conectados", error)
    res.status(500).json({error: "Error obteniendo los usuarios conectados"})
  }
}

export const postUserController = async (req, res) => {
  try {
    const newUser = req.body;

    const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

    if (users.usersConnected.includes(newUser.name)) return res.status(400).json({error: "Nombre de usuario ya esta en uso"})

    users.usersConnected.push(newUser.name);
    users[newUser.privateRoom] = userEstructure(newUser.name)
    
    fs.writeFile(usersPath, JSON.stringify(users), (err) => {
      if (err) {
        console.log("Error agregando un usuario", err)
        res.status(500).json({error: "Error agregando un usuario"})
      }
    })
    res.status(201).json({message: "Usuario agregado exitosamente"})
  } catch (error) {
    console.log("Error agregando un usuario", error)
    res.status(500).json({error: "Error agregando un usuario"})
  }
}

export const deleteUserController = async (req, res) => {
  try {
    const userName = req.params.name

    const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

    users.usersConnected = users.usersConnected.filter((user) => user !== userName)

    fs.writeFile(usersPath, JSON.stringify(users), (err) => {
      if (err) {
        console.log("Error eliminando un usuario", err)
        res.status(500).json({error: "Error eliminando un usuario"})
      }
    })
    
    res.status(200).json({message: "Usuario eliminado exitosamente"})
  } catch (error) {
    console.log("Error eliminando un usuario", error)
    res.status(500).json({error: "Error eliminando un usuario"})
  }
}
    