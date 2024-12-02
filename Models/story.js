const mongoose=require('mongoose');

require('dotenv').config();
const mongo=process.env.MONGO_URL;

mongoose.connect(mongo);

const storySchema=new mongoose.Schema({
    story:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    time:{
        type:Date
    }
   ,
   cloudinaryUrl:{
    type:String
},

})

module.exports=mongoose.model('story',storySchema);