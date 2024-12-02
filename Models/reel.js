const mongoose=require('mongoose');

require('dotenv').config();
const mongo=process.env.MONGO_URL;

mongoose.connect(mongo);

const ReelSchema=new mongoose.Schema({
    reel:{
        type:String,
        required:true

    },
    caption:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    cloudinaryUrl:{
        type:String
    },

   
})

module.exports=mongoose.model('reel',ReelSchema);