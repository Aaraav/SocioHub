const userModel = require('../Models/user');
const dpModel=require('../Models/dp');
const mongoose=require('mongoose');
const fsExtra = require('fs-extra');
const path = require('path');

const uploaddp=async(req,res)=>{
    const id=req.user._id;
     const user=await userModel.findById(id);

     const uploadDir = path.join(__dirname, '..', 'views', 'images', 'posts');
    const targetPath = path.join(uploadDir, req.file.originalname);

    await fsExtra.copyFile(req.file.path, targetPath);
    await fsExtra.remove(req.file.path); // Remove the temporary file

    // if(user.picture){
    //     // await dpModel.findByIdAndDelete(user.picture);
    // }

    const dp=new dpModel({
        image: `/images/posts/${req.file.originalname}`,
        user:user._id
    })

    await dp.save();

    user.picture=dp._id;
    await user.save();

    return res.status(200).send(dp);



}

const getalluploadeddp=async(req,res)=>{

    const id=req.user._id;

    const dps=await dpModel.find({user:id});
    console.log(dps);

    return res.status(200).send(dps);
}

const getdp = async (req, res) => {
    try {
        const userId = req.user._id;
        const pictureId = req.params.picture;

        // Check if pictureId is not provided or not a valid ObjectId
        if (!pictureId || !mongoose.Types.ObjectId.isValid(pictureId)) {
            return res.status(400).send("Invalid picture ID");
        }

        // Assuming dpModel is your Mongoose model for user profile pictures
        const userDp = await dpModel.findOne({ _id: pictureId, user: userId });

        // Check if userDp is null, meaning the picture with the provided ID does not belong to the user
        if (!userDp) {
            return res.status(404).send("User profile picture not found");
        }

        // Assuming userDp.image contains the URL or binary data of the image
        return res.send(userDp.image);
    } catch (error) {
        console.error("Error fetching user profile picture:", error);
        return res.status(500).send("Internal Server Error");
    }
};

const getofotheruser=async(req,res)=>{
    const id=req.user._id;
    const pic=req.params.id;
const user=req.params.userId;
    const userPic=await dpModel.find({_id:pic,user:user});

    if(!userPic){
        return res.send({message:'no uploaded any pic yet'});
    }

    return res.send(userPic);

}


module.exports={uploaddp,getalluploadeddp,getdp,getofotheruser};