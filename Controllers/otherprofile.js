const userModel=require('../Models/user');
const images = require('../Models/images'); // Import the image model
const reelModel=require('../Models/reel');

const otherprofile = async (req, res) => {
    try {
        const userId = req.user._id;
        const id=req.params.id;

        const user=await userModel.findOne({_id:id});

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Here, you can choose which user details you want to include in the response
        // For example, excluding sensitive information like the password
        const userData = {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            followers: user.followers,
            following:user.following,
            picture:user.picture,
            profilestatus:user.profilestatus

            // Add other fields as needed
        };

        return res.status(200).json(userData);
    } catch (error) {
        console.error('Error in profile:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const othergetpost = async (req, res) => {
  try {
    const id = req.user._id;
    const otherid=req.params.id;
    const userImages = await images.find({ user: otherid });

    if (!userImages.length) {
      return res.status(404).json({ error: 'No posts found' });
    }


    const formattedUserImages = userImages.map(image => ({
      _id: image._id,
      url: `http://localhost:2800${image.image}`,
      likes:image.likes,
      user:image.user
    }));

    res.status(200).json({ images: formattedUserImages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error occurred while fetching images' });
  }
};

const othergetreel=async(req,res)=>{
  const otherid=req.params.id;
  if(otherid){
  const reels=await reelModel.find({user:otherid});
  if (!reels.length) {
    return res.status(404).json({ error: 'No reels found' });
  }
  return res.status(200).send(reels);
  }
  else{
    return res.send({message:'error'});
  }
}
module.exports={
    otherprofile,
    othergetpost,
    othergetreel

}