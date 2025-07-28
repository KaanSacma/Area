const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
    const expiresIn = 30 * 24 * 60 * 60;
    return jwt.sign({userId}, process.env.SECRET_TOKEN_JWT, {expiresIn: expiresIn});
}

const verifyToken = (token) => {
    if (!token) {
        return 401;
    }

    return jwt.verify(token, process.env.SECRET_TOKEN_JWT, (err, decodedToken) => {
        if (err) {
            return 403;
        }
        return 200;
    });
}

const checkToken = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const status = verifyToken(token);
    if (status !== 200) {
        console.log('Invalid/Missing token');
        return res.status(status).json({ message: 'Invalid/Missing token' });
    }
    return status;
}

const getUserId = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    return decodedToken.userId;
}

module.exports = {generateToken, checkToken, getUserId};
