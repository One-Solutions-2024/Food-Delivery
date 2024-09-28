const socketIO = require('socket.io');

const setupSocket = (server) => {
  const io = socketIO(server);

  // Listen for new connections
  io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);

    // Listen for a custom event from the client
    socket.on('customEvent', (data) => {
      console.log('Custom event received: ', data);
      // You can emit an event back to the client or to all connected clients
      io.emit('customEventResponse', { message: 'Event received!', data });
    });

    // Listen for disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected: ', socket.id);
    });

    // Optionally, you can set up other events here
    socket.on('error', (error) => {
      console.error('Socket error: ', error);
    });
  });

  return io;
};

module.exports = setupSocket;
