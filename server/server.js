const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join( __dirname, '../public' );

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer( app );
const io = socketIO(server);

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString, isUniqueName } = require('./utils/validation');
const { Users } = require('./utils/users');

const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

  socket.on('join', (params, callback) => {
    if ( !isRealString(params.name) || !isRealString(params.room) ) {
      return callback('Name and Room are required.');
    }
    if ( !isUniqueName(params.name, users.users) ) {
      return callback('Name already taken.');
    }

    const room = params.room.toLowerCase();

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, room);

    io.to(room).emit('updateUserList', users.getUserList(room));
    // socket.leave(room);

    // io.emit - send to everyone
    // socket.broadcast.emit - send to everyone except current user
    // socket.emit - send to one user
    // io.to(room) - send to everyone with specific room
    // socket.broadcast.to(room) - send to everyone with specific room except current user

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app dirtbag'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);
    if ( user && isRealString(message.text) ) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);
    if ( user ) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if ( user ) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

});

server.listen( port, () => {
  console.log(`Server is up on port ${port}`);
} );

// list current chat rooms
// browser notifications
// local storage of user
// switch between rooms?
// react frontend
