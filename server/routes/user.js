const express = require('express');
const userRouter = express.Router();
const database = require('../config');
const {checkToken, getUserId} = require('../utils/token');

userRouter.get('/info', async (req, res) => {
    try {
        console.log("[GET] /user/info called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const userId = getUserId(req, res);
        const user = await database.getUser(userId);
        console.log("Returning user data");
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = userRouter;
