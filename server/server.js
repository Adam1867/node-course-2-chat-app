const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join( __dirname, '../public' );

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer( app );
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.emit('newMessage', {
    from: 'fred@email.com',
    text: 'WAWAW',
    createdAt: 123
  });

  socket.on('createMessage', (message) => {
    console.log(`${message.from}:`, message.text);
  });

  socket.on('disconnect', (socket) => {
    console.log('user disconnected');
  });
});

server.listen( port, () => {
  console.log(`Server is up on port ${port}`);
} );
