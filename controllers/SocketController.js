const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('likePost', (data) => {
      console.log('Post liked:', data);
      const parsedData = JSON.parse(data); // Parse the data string into a JSON object
      const userId = parsedData.userId;
      console.log(userId);
      
      // Emit a notification event to the recipient user
      io.to(userId).emit("notification", {
        recipientUserId: userId,
        message: "Someone liked your post",
      });
      
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('hello', 'Hello from server!');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export default handleSocketConnection;
