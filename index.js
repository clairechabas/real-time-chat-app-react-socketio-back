import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
const PORT = 4000;

const app = express();
app.use(cors());

const server = http.createServer(app);

// io server with CORS enabled for GET and POST requests coming from http://localhost:3000.
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Setting our usual suspects.
const ROOM_BOT = '🤖 RoomBot';
let users = [];

// Listening to client connections to io via socket.io-client.
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // event listeners coming here...
  socket.on('join_room', ({ username, room }) => {
    // Adding user to a socket room.
    // Scoket.IO docs: "A room is an arbitrary channel
    // that sockets can join and leave. It can be used
    // to broadcast events to a subset of clients."
    socket.join(room);

    // Engraving the time of this great moment.
    const __createdTime__ = Date.now();

    // Let the whole room know that a new user has joined.
    socket.to(room).emit('receive_message', {
      message: `👋 ${username} has joined the room`,
      username: ROOM_BOT,
      __createdTime__,
    });

    // Welcome the user who just joined the room.
    socket.emit('receive_message', {
      message: `Warm welcome ${username}! 🤗`,
      username: ROOM_BOT,
      __createdTime__,
    });

    // Saving our new user arrival in the room.
    users.push({ id: socket.id, username, room });
    const usersInRoom = users.filter((user) => user.room === room);
    // Message to the whole room (minus our current user)
    socket.to(room).emit('users_in_room', usersInRoom);
    // Message to our current user
    socket.emit('users_in_room', usersInRoom);
  });
});

server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
