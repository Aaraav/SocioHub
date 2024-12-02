const mongoose=require('mongoose');

require('dotenv').config();
const mongo=process.env.MONGO_URL;

mongoose.connect(mongo);

const likesScema=new mongoose.Schema({
    likes:{
        type:Number
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    image:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'image'
    }
})



module.exports=mongoose.model('Likes',likesScema);