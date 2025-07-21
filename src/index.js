import express from "express";
import https from "https";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = https.createServer(app);

server.listen(3000, () => {
    console.log("Server is running on: http://localhost:3000");
});
