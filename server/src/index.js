import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import routes from './routes/index.js';
import realtimeServer from './chatliveServer.js';

const app = express();
const server = createServer(app);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La política CORS para este sitio no permite acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to SDH ChatLive Server :D!");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

realtimeServer(server);