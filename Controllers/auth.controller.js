const jwt = require('jsonwebtoken');
const userModel = require('../Models/user');

const authorization = async (req, res, next) => {
    try {
        const access_token = req.cookies?.access_token || req.headers.authorization;
        const tokenType = req.cookies ? 'cookie' : 'header';
        let actualToken;
        
        if (tokenType === 'header') {
          actualToken = access_token.split(' ')[1];
        } else {
          actualToken = access_token;
        }
        
        console.log(`Actual Access Token (${tokenType}):`, actualToken); 
        
       
  
  
      if (!access_token) {
        return res.status(400).json("Please log in first");
      }
  console.log(process.env.SECRET);
      jwt.verify(actualToken, process.env.SECRET, async (err, decoded) => {
        if (err) {
            

  
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json('Access token has expired');
          } else {
            return res.status(401).json({ error: err.message });
          }
        }
  
        try {
          if (!decoded || !decoded._id) {
            return res.status(401).json('Invalid token payload');
          }
  
          const user = await userModel.findOne({ _id: decoded._id });
          if (!user) {
            return res.status(401).json('User not found');
          }
  
          req.user = user;
          next();
        } catch (error) {
          console.error('Error finding user:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    } catch (error) {
      console.error('Error in authorization:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = authorization;