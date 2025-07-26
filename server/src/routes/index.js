import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const users = path.join(__dirname, "services", "users.json");

app.get("/users", (req, res) => {
  fs.readFile(users, "utf-8", (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.parse(data))
    }
  })
})
