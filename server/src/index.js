import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import routes from './routes/index.js';
import realtimeServer from './chatliveServer.js';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use("/api", routes);
app.use(cors());

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

realtimeServer(server);