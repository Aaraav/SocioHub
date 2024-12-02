const jwt = require('jsonwebtoken');

const accesstoken = async (user) => {
    try {
        const payload = {
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            _id: user._id
        };
        const secret = process.env.SECRET;

        return jwt.sign(payload, secret, { expiresIn: '1d' });
    } catch (error) {
        console.error('Error generating access token:', error);
        throw error; // Throw the error for handling in the caller function
    }
};

const refreshtoken = async (user) => {
    try {
        const payload = {
            username: user.username,
        };
        const secret = process.env.SECRET;

        return jwt.sign(payload, secret, { expiresIn: '30d' });
    } catch (error) {
        console.error('Error generating refresh token:', error);
        throw error; // Throw the error for handling in the caller function
    }
};

module.exports = { accesstoken, refreshtoken };
