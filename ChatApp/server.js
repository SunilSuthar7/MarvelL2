// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Listen for incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for a message from the client
  socket.on('chat message', (data) => {
    const { name, message } = data;
    console.log(`Message from ${name}: ${message}`);
    
    // Broadcast the message to all connected clients with the user's name
    io.emit('chat message', { id: socket.id, name, message });
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
