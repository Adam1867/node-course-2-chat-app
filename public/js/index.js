var socket = io();

socket.on('connect', function() {
  console.log('connected to server');

  socket.emit('createMessage', {
    from: 'adam@example.com',
    text: 'ayyylmaoooo'
  });
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log(message.from+':', message.text, 'at '+message.createdAt);
});
