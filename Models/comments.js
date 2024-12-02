const mongoose = require('mongoose');

require('dotenv').config();
const mongo = process.env.MONGO_URL;

mongoose.connect(mongo);

const commentsSchema = new mongoose.Schema({
    comments: {
        type: [String], 
        required: true
    },
    image: {
       
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'image' 
       
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
   
});

module.exports = mongoose.model('Comment', commentsSchema);


