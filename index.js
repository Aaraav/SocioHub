const express = require('express');
const cors = require('cors');
const user = require('./views/main');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173/'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/user', user);
app.use('/images/posts', express.static(path.join(__dirname, 'views', 'images', 'posts')));
app.use('/reels/videos', express.static(path.join(__dirname, 'views', 'reels', 'videos')));
app.use('/live/videos', express.static(path.join(__dirname, 'views', 'live', 'videos')));
app.use('/story/stories', express.static(path.join(__dirname, 'views', 'story', 'stories')));

// Variable to store the reference to the chat server
let chatServer = null;

// Function to create and start the chat server
function startChatServer() {
  const http = require('http');
  const socketio = require('socket.io');
  
  const chatApp = express();
  const server = http.createServer(chatApp);
  
  const io = socketio(server, {
    cors: corsOptions,
  });

  // Initialize chat server routes and socket.io events
  chatApp.get('/', (req, res) => {
    res.send('Hello from Chat server!');
  });

  // Define other routes and socket.io event handlers as necessary...

  // Start the chat server on port 4000
  server.listen(4000, () => {
    console.log('Chat server is running on port 4000');
  });
  
  return server;
}

// Endpoint to start the chat server on port 4000
app.get('/chat/', (req, res) => {
  if (!chatServer) {
    // Create and start the chat server if it's not already running
    chatServer = startChatServer();
    res.send('Chat server started');
  } else {
    res.send('Chat server is already running');
  }
});

// Start the main server
app.listen(port, () => {
  console.log(`Main server is running at port ${port}`);
});
