const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

require('dotenv').config();
const mongo=process.env.MONGO_URL;

mongoose.connect(mongo);


const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        require:true,


    },
    username:{
       type:String,
       require:true,
       unique:true
    },
    email:{
        type:String,
       require:true,
       unique:true
    },
    password:{
        type:String,
        unique:true,
        require:true
    },
    picture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dp'

    },
    refreshtoken:{
        type:String,
    },
    images: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'image' },
        url: String,
      }],

    reel:[{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'reel' },
        url: String, 
       }],

    live:[{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'live' },
         url:String
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
        }],
        following:[{
            type:mongoose.Schema.Types.ObjectId,
        ref:'user'
        }],

    story:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'story'
    }],
    profilestatus:{
        type:Boolean,
        default:true
    }

     


});

userSchema.pre('save', async function (next) {
    try {
        const salt = 10;
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next();
    } catch (error) {
        console.log('Error at the time of hashing password:', error);
        next(error);
    }
});

module.exports=mongoose.model("user",userSchema);

