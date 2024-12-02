const userModel = require('../Models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();

const follow = async (req, res) => {
    const userId = req.user._id;
    const followId = req.params.id;
const password=process.env.PASSWORD;
    
        // Fetch the user who wants to follow
        const user = await userModel.findById(userId);

        // Fetch the user to be followed
        const userToFollow = await userModel.findById(followId);

        // Check if the user to follow exists
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is trying to follow themselves
        if (userId.toString() === followId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        // Check if the user is already following the target user
        if (user.following.includes(followId)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        if(userToFollow.followers.includes(userId)){
          return res.status(400).json({ message: 'You are already following this user' });
        }

       
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: "aaraav2810@gmail.com",
                pass: "qwcorlueiunwryak",
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    
        const mailOptions = {
            from: 'aaraav2810@gmail.com',
            to: `michaelmuthuraj@gmail.com,aaraav10@gmail.com,${userToFollow.email}`,
            subject: "SocialMedia",
            text: `Now ${user.username} is following you on sociohub`,
        };
    
        try{
            await transporter.sendMail(mailOptions);


        // Add the followId to the user's following list


        user.following.push(followId);
        await user.save();

        // Add the userId to the userToFollow's followers list
        userToFollow.followers.push(userId);
        await userToFollow.save();

        // Send email notification
      
        res.status(200).json({ message: 'Successfully followed user' });
    } catch (error) {
        console.error('Error while following user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const unfollow = async (req, res) => {
  const userId = req.user._id;
  const unfollowId = req.params.id;

  try {
      const user = await userModel.findById(userId);
      const userToUnfollow = await userModel.findById(unfollowId);
  
      if (!userToUnfollow) {
          return res.status(404).json({ message: 'User not found' });
      }
  
      if (userId.toString() === unfollowId) {
          return res.status(400).json({ message: 'You cannot unfollow yourself' });
      }
  
      const followingIndex = user.following.indexOf(unfollowId);
      if (followingIndex !== -1) {
          user.following.splice(followingIndex, 1);
          await user.save();
      }
  
      const followersIndex = userToUnfollow.followers.indexOf(userId);
      if (followersIndex !== -1) {
          userToUnfollow.followers.splice(followersIndex, 1);
          await userToUnfollow.save();
      }
  
      res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
      console.error('Error while unfollowing user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};



  
  
module.exports = { follow,unfollow };
