const newsRouter = require('express').Router();
const axios = require('axios');
require('dotenv').config();

newsRouter.get('/top-headlines', async (req, res) => {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
        const titles = response.data.articles.map((article) => article.title);
        const message = `There are ${titles.length} top headlines:\n${titles.join('\n')}`;
        res.status(200).json({message: message});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = newsRouter;
