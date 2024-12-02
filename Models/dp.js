const mongoose=require('mongoose');

require('dotenv').config();
const mongo=process.env.MONGO_URL;

mongoose.connect(mongo);


const dpSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model('dp',dpSchema);