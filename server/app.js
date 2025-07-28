const express = require('express');
const cors = require('cors');
const useragent = require('express-useragent');
const authRouter = require('./routes/auth');
const servicesRouter = require('./routes/services');
const userRouter = require('./routes/user');
const discordRouter = require('./routes/discord');
const movieRouter = require('./routes/MovieAPI');
const weatherRouter = require('./routes/WeatherAPI');
const gmailRouter = require('./routes/gmail');
const newsRouter = require('./routes/NewsAPI');
const hourRouter = require('./routes/hour');
const jokeRouter = require('./routes/joke');

require('./config');
require('./discord');
require('./automaticServices');

const port = 8080;
const app = express();
app.use(cors({
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
}));
app.use(express.json());
app.use(express.static('images'));
app.use(useragent.express());

app.use('/auth', authRouter);
app.use('/services', servicesRouter);
app.use('/user', userRouter);
app.use('/discord', discordRouter);
app.use('/movie', movieRouter);
app.use('/weather', weatherRouter);
app.use('/gmail', gmailRouter);
app.use('/news', newsRouter);
app.use('/time', hourRouter);
app.use('/joke', jokeRouter);

app.all('/about.json', (req, res) => {
    res.status(200).json({
        client: {
            host: req.ip,
            port: req.socket.localPort,
            userAgent: req.useragent.source,
        },
        server: {
            current_time: Date.now(),
            services: [
                {
                    name: 'Discord',
                    actions: [
                        {
                            name: 'Send Message on Channel',
                            description: 'Send a message to a channel',
                        },
                        {
                            name: 'Send Message on DM',
                            description: 'Send a message to a dm',
                        },
                    ],
                    reactions: [
                        {
                            name: 'Contains Text on Channel',
                            description: 'Check if a message contains a text on a channel',
                        },
                        {
                            name: 'Contains Text on DM',
                            description: 'Check if a message contains a text on a dm',
                        },
                    ],
                },
                {
                    name: 'TMDB',
                    actions: [
                        {
                            name: 'On Theater',
                            description: 'Check if the movie is on theater',
                        },
                        {
                            name: 'Now Playing',
                            description: 'Get movies now playing',
                        },
                        {
                            name: 'Popular',
                            description: 'Get popular movies',
                        },
                        {
                            name: 'Upcoming',
                            description: 'Get upcoming movies',
                        },
                    ],
                },
                {
                    name: 'OpenWeather',
                    actions: [
                        {
                            name: 'weather now',
                            description: 'Get the weather',
                        },
                        {
                            name: 'is Temperature close',
                            description: 'Check if the temperature is close',
                        },
                        {
                            name: 'is Condition close',
                            description: 'Check if the condition is close',
                        },
                        {
                            name: 'Forecast for days',
                            description: 'Get the forecast for days',
                        },
                    ],
                },
                {
                    name: 'Time',
                    actions: [
                        {
                            name: 'Timezone by Interval',
                            description: 'Get the timezone by interval',
                        },
                        {
                            name: 'Timezone by Hours',
                            description: 'Get the timezone by hours',
                        },
                        {
                            name: 'Timezone by Minutes',
                            description: 'Get the timezone by minutes',
                        },
                    ],
                },
                {
                    name: 'Gmail',
                    actions: [
                        {
                            name: 'Send an Email',
                            description: 'Send an email',
                        },
                    ],
                },
                {
                    name: 'News',
                    actions: [
                        {
                            name: 'Top headlines',
                            description: 'Get the top headlines',
                        },
                    ],
                },
                {
                    name: 'Joke',
                    actions: [
                        {
                            name: 'Random Joke',
                            description: 'Get a random joke',
                        },
                    ],
                },
            ],
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
