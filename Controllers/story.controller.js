const path = require('path'); 
const fsExtra = require('fs-extra'); 
const cron = require('node-cron'); 
const cloudinary=require('cloudinary').v2;
const fs=require('fs');
const userModel = require('../Models/user');
const storyModel = require('../Models/story');

const deleteOldStories = async () => {
  try {
    console.log('Deleting old stories...');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await storyModel.deleteMany({ time: { $lt: twentyFourHoursAgo } });
    console.log('Old stories deleted successfully');
  } catch (error) {
    console.error('Error deleting old stories:', error);
  }
};

cron.schedule('0 * * * *', deleteOldStories);

const uploadstory = async (req, res) => {
  try {
    const id = req.user._id;
    const newuser = await userModel.findOne({ _id: id });
    if (!newuser) {
      return res.status(400).send('User ID is required');
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedStories = [];
    const promises = req.files.map(async (file) => {
      const uploadDir = path.join(__dirname, '..', 'views', 'story', 'stories');
      const targetPath = path.join(uploadDir, file.originalname);
      await fsExtra.move(file.path, targetPath, { overwrite: true });

      const newPost = new storyModel({
        story: `/story/stories/${file.originalname}`,
        user: newuser._id,
        time: Date.now(),
      });

      if (fs.existsSync(targetPath)) {
        await cloudinary.uploader.upload(targetPath, async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            throw error;
          }

          console.log('File uploaded to Cloudinary:', result);
          console.log('Cloudinary URL:', result.secure_url);
          newPost.cloudinaryUrl = result.url;
          newuser.story.push(newPost._id);
          await newuser.save();
          await newPost.save();
          uploadedStories.push(newPost);
        });
      } else {
        console.error('File does not exist:', targetPath);
        throw new Error('File does not exist');
      }
    });

    await Promise.all(promises);
    res.status(200).json({ message: 'Stories uploaded successfully', data: uploadedStories });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error occurred while uploading stories' });
  }
};
const fetchstory=async(req,res)=>{
const id=req.user._id;
 
const user=await userModel.findById(id);

if(!user){
    return res.status(200).send('please login first');
}
const usersfollowing=await userModel.find({_id:user.following});
const story=await storyModel.find({user:user.following});
return res.status(200).json({ story, usersfollowing });

}

module.exports = { uploadstory,fetchstory };
