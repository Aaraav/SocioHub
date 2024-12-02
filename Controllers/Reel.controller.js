const reelModel=require('../Models/reel');
const userModel=require('../Models/user');
const fsExtra = require('fs-extra');
const path = require('path');
const cloudinary=require('cloudinary').v2;
const fs=require('fs');

cloudinary.config({
    cloud_name:'dduprrzmb',
    api_key:'752366272453693',
    api_secret:'0W8EckvDgjyrI04JHQdxZn9KHEs'
})
const uploadReel=async(req,res)=>{

    const id=req.user._id;
    const user=await userModel.findOne({_id:id});

    const uploadDir = path.join(__dirname, '..', 'views', 'reels', 'videos');
    const targetPath = path.join(uploadDir, req.file.originalname);
    const uploadOptions = {
        folder: 'reels',
        allowed_formats: ['mp4', 'mkv', 'avi'],
        resource_type: 'video'
      };
    await fsExtra.copyFile(req.file.path, targetPath);
    await fsExtra.remove(req.file.path);
    const newReel=new reelModel({
        reel:`/reels/videos/${req.file.originalname}`,
        caption: req.body.caption,
        user:id
    })

    if (fs.existsSync(targetPath)) {
        cloudinary.uploader.upload(targetPath,uploadOptions, async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ message: 'Failed to upload file', error: error.message });
          }
  
          console.log('File uploaded to Cloudinary:', result);
          console.log('Cloudinary URL:', result.secure_url);
          newReel.cloudinaryUrl = result.url;
          console.log(result.url);

          await newReel.save();
  
          user.reel.push(newReel._id);
          await user.save();
  
          return res.status(200).send(newReel);
        });
      } else {
        console.error('File does not exist:', targetPath);
        res.status(400).json({ error: 'File does not exist' });
      }


    
}

const getreel=async(req,res)=>{
const id=req.user._id;
const reels=await reelModel.find({user:id});

return res.status(200).send(reels);
}

const getallreel=async(req,res)=>{
    const id=req.user._id;
    const user=await userModel.findById(id);

    if(!user){
        return res.status(500).send('Useris not loggined');
    }

    const reels=await reelModel.find();

    return res.status(200).send(reels);

}

module.exports={uploadReel,getreel,getallreel}