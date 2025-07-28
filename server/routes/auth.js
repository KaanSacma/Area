const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/token');
const database = require('../config');
const axios = require('axios');
const { sign } = require('jsonwebtoken');
const { getGuildsOwnerList } = require('../utils/discord');
const { checkToken, getUserId } = require('../utils/token');
const client = require('../discord');

authRouter.post('/register', async (req, res) => {
    try {
        console.log("[POST] /auth/register called from " + req.ip)
        const users = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            birthdate: req.body.birthdate,
            sex: req.body.sex
        }
        await database.createUser(users);
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        console.log("[POST] /auth/login called from " + req.ip);
        const username = req.body.username;
        const password = req.body.password;
        const user = await database.getUserByUsername(username);

        if (!user) {
            console.log("Invalid username or password");
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Invalid username or password");
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user.id);
        console.log("Login successful");
        res.status(200).json({ access_token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

authRouter.get('/discord/login', async (req, res) => {
    const url = "https://discord.com/api/oauth2/authorize?client_id=1160658956465733783&permissions=8&redirect_uri=https%3A%2F%2Fareaotek.azurewebsites.net%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20guilds.members.read%20bot%20messages.read";
    res.redirect(url);
});

authRouter.get('/discord/callback', async (req, res) => {
    console.log("[GET] /auth/discord/callback called from " + req.ip);
    if (!req.query.code) {
        console.log("No code provided");
        return res.status(401).json({ message: 'No code provided' });
    }
    const { code } = req.query;
    const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
    });
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/x-www-form-urlencoded'
    };
    const response = await axios.post('https://discord.com/api/oauth2/token', params, { headers });
    const user = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${response.data.access_token}`,
        }
    });
    const {id} = user.data;
    const guilds = await getGuildsOwnerList(response.data.access_token);
    const userAgent = req.useragent;
    const isMobile = userAgent.isMobile;
    if (isMobile) {
        res.redirect("com.mobile://home?" + `id=${id}&guilds=${JSON.stringify(guilds)}&access_token=${response.data.access_token}&refresh_token=${response.data.refresh_token}`);
    } else {
        res.redirect("http://localhost:3000/home?" + `id=${id}&guilds=${JSON.stringify(guilds)}&access_token=${response.data.access_token}&refresh_token=${response.data.refresh_token}`);
    }
});

authRouter.post('/discord/add', async (req, res) => {
    try {
        console.log("[POST] /auth/discord/add called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const userId = getUserId(req);
        const id = req.body.id;
        const guilds = req.body.guilds;
        const access_token = req.body.access_token;
        const refresh_token = req.body.refresh_token;
        const joined_guilds = [];
        client.guilds.cache.forEach((guild) => {
            for (let i = 0; i < guilds.length; i++) {
                if (guilds[i].id === guild.id) {
                    joined_guilds.push(guilds[i]);
                }
            }
        });
        const existingDiscord = await database.isDiscordExist(id);
        if (existingDiscord) {
            await database.updateDiscord(id, {user_id: userId, access_token: access_token, refresh_token: refresh_token, guilds: guilds, joined_guilds: joined_guilds});
            return res.status(200).json({ message: 'Discord already exist and Updated' });
        }
        await database.createDiscord({id: id, user_id: userId, access_token: access_token, refresh_token: refresh_token, guilds: guilds, joined_guilds: joined_guilds});
        res.status(200).json({ message: 'Discord added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = authRouter;
