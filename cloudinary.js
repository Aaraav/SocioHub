import {v2 as cloudinary} from 'cloudinary';
require('dotenv').config();

cloudinary.config({ 
  cloud_name: 'dduprrzmb', 
  api_key:process.env.API_KEY, 
  api_secret:process.env.API_SECRET
});

