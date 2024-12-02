const mongoose = require('mongoose');
require('dotenv').config();
const mongo = process.env.MONGO_URL;

mongoose.connect(mongo);

// Define the schema for the chat messages
const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the sender
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the receiver
    required: true
  },
  message: [{
    type: String,
    required: true
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create the Chat model based on the schema
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
