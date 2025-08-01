import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const usersPath = path.join(__dirname, "../services/users.json");

export const getMessagesController = async (req, res) => {
  try {
    const room = req.params.room

    fs.readFile(usersPath, "utf-8", (err, data) => {
      if (err) console.log("Error obteniendo los usuarios conectados", err)

      const users = JSON.parse(data)
      res.json(users[room])
    })
  } catch (error) {
    console.log("Error obteniendo los usuarios conectados", error)
    res.status(500).json({error: "Error obteniendo los usuarios conectados"})
  }
}