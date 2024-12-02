const userModel = require('../Models/user');

const getallusers = async (req, res) => {
    try {
        const { username } = req.params;
        const users = await userModel.find({ username: { $regex: username, $options: 'i' } });
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { getallusers };
