const jokeRouter = require('express').Router();
const axios = require('axios');

jokeRouter.get('/random', async (req, res) => {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
        if (response.status !== 200) {
                res.status(201).json({ message: 'No Joke' });
        }
        const joke = await response.data;
        if (joke === undefined) {
            res.status(201).json({ message: 'No Joke' });
        }
        if (joke.error === true) {
            res.status(201).json({ message: 'No Joke' });
        }
        const message = `${joke.joke}`;
        res.status(200).json({message: message});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = jokeRouter;
