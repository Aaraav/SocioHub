const liveModel=require('../Models/live');
const userModel=require('../Models/user');
const fsExtra = require('fs-extra');
const path = require('path');

const uploadlivee=async(req,res)=>{
    const id=req.user._id;
    const user=await userModel.findOne({_id:id});

    const uploadDir = path.join(__dirname, '..', 'views', 'live', 'videos');
    const targetPath = path.join(uploadDir, req.file.originalname);

    await fsExtra.copyFile(req.file.path, targetPath);
    await fsExtra.remove(req.file.path);

    const newReel=new liveModel({
        live:`/live/videos/${req.file.originalname}`,
        user:id
    })

    await newReel.save();
    user.live.push(newReel._id);
    await user.save();

    return res.status(200).send(newReel);}

module.exports={
    uploadlivee
}