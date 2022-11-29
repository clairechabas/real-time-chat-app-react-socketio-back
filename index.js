import express from 'express';
import cors from 'cors';
import http from 'http';
const PORT = 4000;

const app = express();
app.use(cors());

const server = http.createServer(app);

server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
