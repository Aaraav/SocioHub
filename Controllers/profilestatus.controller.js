const userModel = require('../Models/user');

const status = async (req, res) => {
    const userId = req.user._id; 
    const {status}=req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update profile status for the current user
        user.profilestatus = status; // Always set profile status to true
        await user.save();


        // Update profile status for followers
        const followers = user.followers; // Assuming followers is an array of follower user IDs
        await userModel.updateMany({ _id: { $in: followers } }, { profilestatus: true }); // Set profile status to true for all followers

        res.status(200).json({});
    } catch (error) {
        console.error('Error updating profile status:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { status };
