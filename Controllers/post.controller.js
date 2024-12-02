const userModel = require('../Models/user');
const images = require('../Models/images');
const likeModel = require('../Models/likes');
 const fs=require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const redis=require('ioredis');
const client=new redis();
const cloudinary=require('cloudinary').v2;

cloudinary.config({
    cloud_name:'dduprrzmb',
    api_key:'752366272453693',
    api_secret:'0W8EckvDgjyrI04JHQdxZn9KHEs'
})

const uploadimage = async (req, res) => {
  try {
    const id = req.user._id;
    const newuser = await userModel.findOne({ _id: id });
    if (!newuser) {
      return res.status(400).send('User ID is required');
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const uploadDir = path.join(__dirname, '..', 'views', 'images', 'posts');
    const targetPath = path.join(uploadDir, req.file.originalname);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await fs.promises.copyFile(req.file.path, targetPath);
    await fs.promises.unlink(req.file.path); // Remove the temporary file

    const newPost = new images({
      image: `/images/posts/${req.file.originalname}`,
      PostText: req.body.caption,
      user: newuser._id
    });

    if (fs.existsSync(targetPath)) {
      cloudinary.uploader.upload(targetPath, async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Failed to upload file', error: error.message });
        }

        console.log('File uploaded to Cloudinary:', result);
        console.log('Cloudinary URL:', result.secure_url);
        newPost.cloudinaryUrl = result.url;
        await newPost.save();

        newuser.images.push(newPost._id);
        await newuser.save();

        res.status(200).json({ message: 'Image uploaded successfully', data: newPost });
      });
    } else {
      console.error('File does not exist:', targetPath);
      res.status(400).json({ error: 'File does not exist' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error occurred while uploading image' });
  }
};
const getpost = async (req, res) => {
  try {
    // const cachevalue=await client.get('posts');
    // if(cachevalue) return res.json(JSON.parse(cachevalue));


    const id = req.user._id;
    const userImages = await images.find({ user: id });

    if (!userImages.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalLikes = await likeModel.countDocuments({ _id: userImages._id });

    const formattedUserImages = userImages.map(image => ({
      _id: image._id,
      url: `http://localhost:2800${image.image}`,
      likes: image.likes,
      cloudinaryUrl:image.cloudinaryUrl
    }));

    // await client.set('posts',JSON.stringify(formattedUserImages));
    // await client.expires('posts',30);

    res.status(200).json({ images: formattedUserImages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error occurred while fetching images' });
  }
};

const getallposts=async(req,res)=>{
  try {
    const id = req.user._id;
    const userImages = await images.find();

    if (!userImages.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const totalLikes = await likeModel.countDocuments({ _id: userImages._id });

    const formattedUserImages = userImages.map(image => ({
      _id: image._id,
      url: `http://localhost:2800${image.image}`,
      likes: image.likes,
      user:image.user,
      cloudinaryUrl:image.cloudinaryUrl
    }));

    res.status(200).json({ images: formattedUserImages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error occurred while fetching images' });
  }

}

module.exports = {uploadimage,getpost,getallposts};