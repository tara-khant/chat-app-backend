/**
 * Initialize socket handlers
 * @param {Server} io - Socket.IO server instance
 */
export const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle joining a chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);

      // Notify others in the room
      socket.to(chatId).emit('userJoined', {
        userId: socket.id,
        message: `User joined the chat`,
      });
    });

    // Handle leaving a chat room
    socket.on('leaveChat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left chat ${chatId}`);

      // Notify others in the room
      socket.to(chatId).emit('userLeft', {
        userId: socket.id,
        message: `User left the chat`,
      });
    });

    // Handle sending messages
    socket.on('sendMessage', ({ chatId, message, senderId }) => {
      console.log(`Message in chat ${chatId} from user ${senderId}:`, message);

      // Broadcast message to all users in the chat room
      io.to(chatId).emit('receiveMessage', {
        id: Date.now(),
        chatId,
        senderId,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle typing indicators
    socket.on('typing', ({ chatId, userId, isTyping }) => {
      socket.to(chatId).emit('userTyping', {
        userId,
        isTyping,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
