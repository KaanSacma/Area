const client = require('../discord');
const discordRouter = require('express').Router();
const database = require('../config');
const { checkToken, getUserId } = require('../utils/token');
const { getGuildsChannelsList, getUsersOnGuild } = require('../utils/discord');

discordRouter.get('/isLogged', async (req, res) => {
    try {
        console.log("[GET] /discord/isLogged called from " + req.ip);
        if (!checkToken(req, res)) {
            return res.status(201).json({ message: 'Unauthorized' });
        }
        const userId = getUserId(req);
        const discord = await database.getDiscordByUserId(userId);
        if (!discord) {
            return res.status(201).json({ message: 'Discord not found' });
        }
        res.status(200).json({ message: 'Logged' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discordRouter.get('/containText/guildMessage/:guildId/:channelId', async (req, res) => {
    try {
        console.log("[GET] /discord/containText/guildMessage/" + req.params.guildId + "/" + req.params.channelId + " called from " + req.ip);
        const guildId = req.params.guildId;
        const channelId = req.params.channelId;
        const text = req.body.text;
        const guild = await client.guilds.fetch(guildId);
        const channel = await guild.channels.fetch(channelId);
        const messages = await channel.messages.fetch({ limit: 1 });
        const lastChannelMessage = messages.first();
        if (lastChannelMessage === null) {
            return res.status(201).json({ message: 'Messages not found' });
        }
        if (lastChannelMessage.content.includes(text) === false) {
            return res.status(201).json({ message: 'Messages not found' });
        }
        const message = {};
        message.id = lastChannelMessage.id;
        message.content = lastChannelMessage.content;
        message.author = lastChannelMessage.author.username;
        message.time = lastChannelMessage.createdAt;
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discordRouter.get('/containText/dm/:userId', async (req, res) => {
    try {
        console.log("[GET] /discord/containText/dm/" + req.params.userId + " called from " + req.ip);
        const userId = req.params.userId;
        const text = req.body.text;
        const user = await client.users.fetch(userId);
        const dm = await user.createDM();
        const lastDmMessage = await dm.lastMessage;
        if (lastDmMessage === null) {
            console.log("Message is null");
            return res.status(201).json({ message: 'Messages not found' });
        }
        if (lastDmMessage.content.includes(text) === false) {
            console.log(text + " is not in this:", lastDmMessage.content);
            return res.status(201).json({ message: 'Messages not found' });
        }
        const message = {};
        message.id = lastDmMessage.id;
        message.content = lastDmMessage.content;
        message.author = lastDmMessage.author.username;
        message.time = lastDmMessage.createdAt;
        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discordRouter.post('/sendmessage/:guildId/:channelId', async (req, res) => {
    try {
        console.log("[POST] /discord/sendmessage/" + req.params.guildId + "/" + req.params.channelId + " called from " + req.ip);
        const guildId = req.params.guildId;
        const channelId = req.params.channelId;
        const message = req.body.message;
        const guild = await client.guilds.fetch(guildId);
        const channel = await guild.channels.fetch(channelId);
        await channel.send(message);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discordRouter.post('/senddm/:userId', async (req, res) => {
    try {
        console.log("[POST] /discord/senddm/" + req.params.userId + " called from " + req.ip);
        const userId = req.params.userId;
        const message = req.body.message;
        const user = await client.users.fetch(userId);
        await user.send(message);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discordRouter.get('/getguilds', async (req, res) => {
    try {
        console.log("[GET] /discord/getguilds called from " + req.ip);
        if (!checkToken(req, res)) {
            return res.status(201).json({ message: 'Unauthorized' });
        }
        const userId = getUserId(req);
        if (!userId) {
            return res.status(201).json({ message: 'Unauthorized' });
        }
        const discord = await database.getDiscordByUserId(userId);
        if (!discord) {
            return res.status(201).json({ message: 'Discord not found' });
        }
        const guilds = JSON.parse(discord.joined_guilds);
        res.status(200).json(guilds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discordRouter.get('/getusers/:guildId', async (req, res) => {
    try {
        console.log("[GET] /discord/getusers/" + req.params.guildId + " called from " + req.ip);
        if (!checkToken(req, res)) {
            return res.status(201).json({ message: 'Unauthorized' });
        }
        const guildId = req.params.guildId;
        const users = await getUsersOnGuild(guildId);
        if (!users) {
            return res.status(201).json({ message: 'Users not found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discordRouter.get('/getchannels/:guildId', async (req, res) => {
    try {
        console.log("[GET] /discord/getchannels/" + req.params.guildId + " called from " + req.ip);
        if (!checkToken(req, res)) {
            return res.status(201).json({ message: 'Unauthorized' });
        }
        const guildId = req.params.guildId;
        const channels = await getGuildsChannelsList(guildId);
        if (!channels) {
            return res.status(201).json({ message: 'Channels not found' });
        }
        res.status(200).json(channels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = discordRouter;
