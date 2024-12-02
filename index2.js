const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const Chat = require('./Models/chat');
const authorization = require('./Controllers/auth.controller');

const app = express();
const server = http.createServer(app);

// Set up CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Adjust the origin based on your client's URL
  
  Credential:true // Specify the allowed HTTP methods
};

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Enable CORS for Socket.IO
const io = socketio(server, {
  cors: corsOptions,
});

const port = 4000;

// Initialize an object to store socket IDs mapped to user IDs
const socketUserMap = {};

// Initialize an object to store messages temporarily
const pendingMessages = {};

// GET route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Add a route to fetch chat messages by user ID
app.get('/chats/:id/:userId', async (req, res) => {
    try {
        const id=req.params.id;
      const userId = req.params.userId;
      const chats = await Chat.find({ senderId: id, receiverId: userId });
      return res.json(chats);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/chats/:id',async (req, res) => {
  try {
      const id=req.params.id;
      const chats = await Chat.find({ $or: [{ senderId: id }, { receiverId: id }] });
      return res.json(chats);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  

io.on('connection', (socket) => {
  console.log('A client connected', socket.id);

  // Listen for 'setUserId' event to set the userId
  socket.on('setUserId', (userId) => {
    // Store the socket ID mapped to the user ID
    socketUserMap[userId] = socket.id;
    console.log('receiver connected with userId:', userId);



    // Check if there are pending messages for this user and deliver them
    // if (userId in pendingMessages) {
    //   pendingMessages[userId].forEach((message) => {
    //     socket.emit('receiveMessage', message);
    //   });
    //   // Clear pending messages after delivering them
    //   delete pendingMessages[userId];
    // }
  });
  console.log('socketUserMap',socketUserMap);

  // Listen for 'message' event to handle messages
  socket.on('message', async ({ message, userId, senderId }) => {
    // console.log('Message received:', message);
    // console.log('senderId',senderId);

    try {
      const chat = await Chat.findOneAndUpdate(
        { senderId, receiverId: userId },
        { $push: { message } },
        { upsert: true, new: true }
      );

      // Retrieve the receiver's socket ID and emit the message
      const socketId = socketUserMap[senderId];
           console.log('userId',userId);

      console.log('socketId',socketId);
      console.log('socketUserMap[senderId]',socketUserMap[senderId]);
      if (socketId) {
        io.to(socketId).emit('receiveMessage', {message:message,senderId:senderId});
        io.to(socketId).emit('notification',{message:message,senderId:senderId});
      } else {
        // If the user is not connected, store the message temporarily
        // if (!(userId in pendingMessages)) {
        //   pendingMessages[userId] = [];
        // }
        // pendingMessages[userId].push(message);
        console.log('User with userId', userId, 'is not connected. Message stored temporarily.');
      }
      
      // console.log('Message saved to the chat:', chat);

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

 

  socket.on('disconnect', () => {
    // Remove the socket ID mapping when a user disconnects
    const disconnectedUserId = Object.keys(socketUserMap).find(userId => socketUserMap[userId] === socket.id);
    delete socketUserMap[disconnectedUserId];
    console.log('User disconnected:', disconnectedUserId);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
