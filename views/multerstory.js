const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2; // Import cloudinary module

// Cloudinary configuration
// cloudinary.config({
//   cloud_name: 'dduprrzmb',
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// });

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'story', 'stories');
    // Check if the directory exists, create it if not
    fs.access(uploadDir, (err) => {
      if (err) {
        fs.mkdir(uploadDir, { recursive: true }, (error) => {
          if (error) {
            console.error('Error creating directory:', error);
            return cb(error, null);
          }
          cb(null, uploadDir);
        });
      } else {
        cb(null, uploadDir);
      }
    });
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    cb(null, uniqueFilename + path.extname(file.originalname));
  }
});

// Multer upload configuration
const uploadstoryy = multer({ storage: storage });

// Middleware to upload image to Cloudinary
// const uploadToCloudinary = async (req, res, next) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     req.cloudinaryUrl = result.secure_url; // Save the Cloudinary URL in the request object
//     next();
//   } catch (error) {
//     console.error('Error uploading to Cloudinary:', error);
//     res.status(500).json({ error:'Internal Server Error' });
//   }
// };

module.exports = { uploadstoryy, 
  // uploadToCloudinary
 };