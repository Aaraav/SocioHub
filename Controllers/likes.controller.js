const likeModel = require('../Models/likes');
const userModel = require('../Models/user');
const imageModel = require('../Models/images');

const postlikes = async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(req.user._id);

  if (!user) {
return res.status(400).json({ error: 'User not found' });
  }

  const existingLike = await likeModel.findOne({ user: user._id, image: id });
  if (existingLike) {
    const id=existingLike._id;
    const imageId=existingLike.image._id;
    await imageModel.findByIdAndUpdate(imageId, {
      $inc: { likes: -1 }, 
      $expr: { $gte: ['$likes', 1] } 
    });    await likeModel.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Image unliked successfully' });
  }

  else{

  const newLike = await likeModel.create({
    user: user._id,
    image: id,
    likes: 1,
  });

  if(newLike.likes==-1){
    newLike.likes=0;
  };

  await newLike.save();
    
  // Increment like count for the image
  await imageModel.findByIdAndUpdate(id, { $inc: { likes: 1 } });
  await newLike.save();
  return res.status(200).json(newLike);

}


};

const getlikes=async(req,res)=>{

  const imageId=req.params.id;

  const totalLikes = await imageModel.countDocuments({ _id: imageId });

console.log(totalLikes);

  return res.send(totalLikes);


}

module.exports = { postlikes,getlikes };