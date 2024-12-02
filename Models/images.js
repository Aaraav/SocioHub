const mongoose=require('mongoose');

require('dotenv').config();
const mongo=process.env.MONGO_URL;

mongoose.connect(mongo);

const imageSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    caption:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    cloudinaryUrl:{
        type:String
    },
    likes:{
        type:Number,
        default:0
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
   
})

module.exports=mongoose.model('image',imageSchema);