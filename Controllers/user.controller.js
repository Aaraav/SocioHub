const userModel=require('../Models/user');
const {accesstoken,refreshtoken}=require('./tokens.controllers');
const bcrypt=require('bcrypt');


const register = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        if (!username || !email || !password || !fullname) {
            return res.status(401).send('Please complete all details');
        }

        const usertesting = await userModel.findOne({ email: email });

        if (usertesting) {
            return res.status(400).send('User is already registered');
        }

        const newuser = new userModel({
            fullname: fullname,
            username: username,
            email: email,
            password: password
        });

        await newuser.save();

        return res.status(200).json(accesstoken);
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).send('Internal server error');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send("user not registered");
        }

        const validpassword = bcrypt.compare(password, user.password);

        if (!validpassword) {
            return res.status(400).send("wrong password");
        }

        const access_token = await accesstoken(user);
        const refresh_token = await refreshtoken(user);
      
        console.log('Generated Access Token:', access_token);
        
        user.refreshtoken = refresh_token;

        await user.save();

        res.cookie('access_token', access_token, {
            httpOnly: true, // Makes the cookie accessible only via the HTTP protocol
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
            expires: new Date(Date.now() + 30 *24* 60 * 1000), // Expires in 30 minutes
            sameSite: 'strict', // Protects against cross-site request forgery attacks
        });        return res.status(200).json(access_token);
        
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).send("Internal Server Error");
    }
};


const logout=async(req,res,next)=>{
    try{
        const access_token = req.cookies?.access_token || req.headers.authorization;

    res.clearCookie('access_token');


        res.status(200).json({ message: 'Logout successful' });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const profile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user=await userModel.findOne({_id:userId});

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Here, you can choose which user details you want to include in the response
        // For example, excluding sensitive information like the password
        const userData = {
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following:user.following,
            profilestatus:user.profilestatus
            // Add other fields as needed
        };

        return res.status(200).json(userData);
    } catch (error) {
        console.error('Error in profile:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const editprofile=async(req,res)=>{
    const id=req.user._id;

    const {fullname,username,email}=req.body;

    const updatedUser = await userModel.updateOne({ _id: id }, { username, email, fullname });
    
    return res.status(200).send(updatedUser);
}






module.exports={
    register,
    login,
     logout,
    profile,
    editprofile
}