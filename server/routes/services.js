const express = require('express');
const {readFileSync} = require("fs");
const servicesRouter = express.Router();
const {checkToken, getUserId} = require('../utils/token');
const database = require('../config');
require('dotenv').config();

const servicesList = [
    "Discord",
    "Open Weather",
    "Time",
    "Gmail",
    "TMDB",
    "News",
    "Joke"
];

const actions = {
    'Discord': [
        {name: 'Contains Text on Channel', url: `${process.env.SERVER_URL}/discord/containText/guildMessage/REPLACE0/REPLACE1`},
        {name: 'Contains Text on DM', url: `${process.env.SERVER_URL}/discord/containText/dm/REPLACE0`}
    ],
    'OpenWeather': [
        {name: 'weather now', url: `${process.env.SERVER_URL}/weather/Weather_today/REPLACE0`},
        {name: 'is Temperature close', url: `${process.env.SERVER_URL}/weather/isTempClose/REPLACE0/REPLACE1`},
        {name: 'is Condition close', url: `${process.env.SERVER_URL}/weather/isConditionClose/REPLACE0/REPLACE1`},
        {name: 'Forecast for days', url: `${process.env.SERVER_URL}/weather/Weather_forecast/REPLACE0/REPLACE1`},
    ],
    'Time': [
        {name: 'Timezone by Interval', url: `${process.env.SERVER_URL}/time/wanted/interval`},
        {name: 'Timezone by Hours', url: `${process.env.SERVER_URL}/time/wanted/hour`},
        {name: 'Timezone by Minutes', url: `${process.env.SERVER_URL}/time/wanted/minute`},
    ],
    'Gmail': [
        {name: 'Actions are not available for this service', url: ''},
    ],
    'TMDB': [
        {name: 'On Theater', url: `${process.env.SERVER_URL}/movie/onTheater/REPLACE0`},
        {name: 'Now Playing', url: `${process.env.SERVER_URL}/movie/now-playing`},
        {name: 'Popular', url: `${process.env.SERVER_URL}/movie/popular`},
        {name: 'Upcoming', url: `${process.env.SERVER_URL}/movie/upcoming`},
    ],
    'News': [
        {name: 'Top headlines', url: `${process.env.SERVER_URL}/news/top-headlines`},
    ],
    'Joke': [
        {name: 'Random Joke', url: `${process.env.SERVER_URL}/joke/random`},
    ],
}

const reactions = {
    'Discord': [
        {name: 'Send Message on Channel', url: `${process.env.SERVER_URL}/discord/sendmessage/REPLACE0/REPLACE1`},
        {name: 'Send Message on DM', url: `${process.env.SERVER_URL}/discord/senddm/REPLACE0`}
    ],
    'OpenWeather': [
        {name: 'Reactions are not available for this service', url: ''},
    ],
    'Time': [
        {name: 'Reactions are not available for this service', url: ''},
    ],
    'Gmail': [
        {name: "Send an Email", url: `${process.env.SERVER_URL}/gmail/send/REPLACE0/REPLACE1`}
    ],
    'TMDB': [
        {name: 'Reactions are not available for this service', url: ''},
    ],
    'News': [
        {name: 'Reactions are not available for this service', url: ''},
    ],
    'Joke': [
        {name: 'Reactions are not available for this service', url: ''},
    ],
}

const imagesList = [];

function initServicesImages()
{
    for (const service of servicesList) {
        if (service.includes(" ")) {
            imagesList.push(readFileSync(`images/${service.split(" ")[0]}${service.split(" ")[1]}.png`));
        } else {
            imagesList.push(readFileSync(`images/${service}.png`));
        }
    }
}

initServicesImages();

servicesRouter.get('/list', async (req, res) => {
    try {
        console.log("[GET] /services/list called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        console.log("Returning services list");
        res.status(200).json(servicesList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.get('/reactions', async (req, res) => {
    try {
        console.log("[GET] /services/reactions called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        console.log("Returning reactions list");
        res.status(200).json(reactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.get('/reaction/:service', async (req, res) => {
    try {
        console.log("[GET] /api/services/reaction/" + req.params.service + " called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const service = req.params.service;
        console.log("Returning reaction list for " + service);
        res.status(200).json(reactions[service]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.get('/actions', async (req, res) => {
    try {
        console.log("[GET] /services/actions called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        console.log("Returning actions list");
        res.status(200).json(actions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.get('/action/:service', async (req, res) => {
    try {
        console.log("[GET] /services/action/" + req.params.service + " called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const service = req.params.service;
        console.log("Returning action list for " + service);
        res.status(200).json(actions[service]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.get('/images', async (req, res) => {
    try {
        console.log("[GET] /auth/services/images called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        console.log("Returning images list");
        res.send(imagesList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.post('/create', async (req, res) => {
    try {
        console.log("[POST] /services/create called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const userId = getUserId(req);
        const action_name = req.body.action_name;
        let action_url = req.body.action_url;
        const reaction_name = req.body.reaction_name;
        let reaction_url = req.body.reaction_url;
        let details = [];
        if (req.body.action_url_params !== undefined) {
            const action_url_params = req.body.action_url_params;
            if (action_url.indexOf("REPLACE0") !== -1)
                action_url = action_url.replace("REPLACE0", action_url_params["REPLACE0"]);
            if (action_url.indexOf("REPLACE1") !== -1)
                action_url = action_url.replace("REPLACE1", action_url_params["REPLACE1"]);
        }
        if (req.body.reaction_url_params !== undefined) {
            const reaction_url_params = req.body.reaction_url_params;
            if (reaction_url.indexOf("REPLACE0") !== -1)
                reaction_url = reaction_url.replace("REPLACE0", reaction_url_params["REPLACE0"]);
            if (reaction_url.indexOf("REPLACE1") !== -1)
                reaction_url = reaction_url.replace("REPLACE1", reaction_url_params["REPLACE1"]);
        }
        if (req.body.details !== undefined) {
            details = req.body.details;
        }
        await database.createService({
            user_id: userId,
            action_name: action_name,
            action_url: action_url,
            reaction_name: reaction_name,
            reaction_url: reaction_url,
            details: details
        });
        res.status(200).json({ message: 'Service created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.get('/zaps', async (req, res) => {
    try {
        console.log("[GET] /services/zaps called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const userId = getUserId(req);
        const zaps = await database.getServicesByUserId(userId);
        res.status(200).json(zaps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.delete('/delete/:id', async (req, res) => {
    try {
        console.log("[DELETE] /services/delete/" + req.params.id + " called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const userId = getUserId(req);
        const id = req.params.id;
        await database.deleteService(userId, id);
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

servicesRouter.post('/switch/status/:id', async (req, res) => {
    try {
        console.log("[POST] /services/switch/status/" + req.params.id + " called from " + req.ip);
        if (checkToken(req, res) !== 200) {
            return;
        }
        const userId = getUserId(req);
        const id = req.params.id;
        await database.switchStatus(userId, id);
        res.status(200).json({ message: 'Service status switched successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = servicesRouter;
