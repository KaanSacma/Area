const weatherRouter = require('express').Router();
const axios = require('axios');
require('dotenv').config();

const weatherApi = {
    key: '54fffb7284b64b8a8b7114535231610',
    base: "https://api.weatherapi.com/v1/",
}

weatherRouter.get('/Weather_today/:place', async (req, res) => {
    try {
        console.log("[GET] /weather/Weather_today/" + req.params.place + " called from " + req.ip);
        const search = req.params.place;
        const response = await axios.get(`${weatherApi.base}current.json?key=${weatherApi.key}&q=${search}&aqi=no`);
        const weatherData = response.data;
        if (weatherData.error) {
            res.status(201).json({ message: `No weather data found for ${search}` });
        }
        const temperature = weatherData.current.temp_c;
        const weatherDescription = weatherData.current.condition.text;

        res.status(200).json({message: `Temperature now: ${temperature}°C, Description: ${weatherDescription}`});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});

weatherRouter.get('/Weather_forecast/:place/:days', async (req, res) => {
    try {
        console.log("[GET] /weather/Weather_forecast/" + req.params.place + "/" + req.params.days + " called from " + req.ip);
        const search = req.params.place;
        const numberOfDays = parseInt(req.params.days, 10);

        const response = await axios.get(`${weatherApi.base}forecast.json?key=${weatherApi.key}&q=${search}&days=${numberOfDays}&aqi=no&alerts=no`);
        const forecastData = response.data;
        if (forecastData.error) {
            res.status(201).json({ message: `No weather data found for ${search}` });
        }

        const message =
            `Date: ${forecastData.forecast.forecastday[0].date}.\nMax Temperature: ${forecastData.forecast.forecastday[0].day.maxtemp_c}°C.\nMin Temperature: ${forecastData.forecast.forecastday[0].day.mintemp_c}°C.\nAvg Temperature: ${forecastData.forecast.forecastday[0].day.avgtemp_c}°C.\nCondition: ${forecastData.forecast.forecastday[0].day.condition.text}.`;

        res.status(200).json({ message: message });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});

weatherRouter.get('/isTempClose/:place/:temp', async (req, res) => {
    try {
        console.log("[GET] /weather/isTempClose/" + req.params.place + "/" + req.params.temp + " called from " + req.ip);
        const search = req.params.place;
        const targetTemp = parseFloat(req.params.temp);

        const response = await axios.get(`${weatherApi.base}current.json?key=${weatherApi.key}&q=${search}&aqi=no`);

        const weatherData = response.data;
        if (weatherData.error) {
            res.status(201).json({ message: `No weather data found for ${search}` });
        }
        const currentTemp = weatherData.current.temp_c;

        const tempDifference = Math.abs(currentTemp - targetTemp);
        const threshold = 2; // Define your threshold for "close" temperature

        if (tempDifference <= threshold) {
            res.status(200).json({ message: `The current temperature is close to ${targetTemp}°C.` });
        } else {
            res.status(201).json({ message: `The current temperature is not close to ${targetTemp}°C.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error checking temperature');
    }
});

weatherRouter.get('/isConditionClose/:place/:condition', async (req, res) => {
    try {
        console.log("[GET] /weather/isConditionClose/" + req.params.place + "/" + req.params.condition + " called from " + req.ip);
        const search = req.params.place;
        const targetCondition = req.params.condition.toLowerCase(); // Convert to lowercase for case-insensitive comparison

        const response = await axios.get(`${weatherApi.base}current.json?key=${weatherApi.key}&q=${search}&aqi=no`);

        const weatherData = response.data;
        if (weatherData.error) {
            res.status(201).json({ message: `No weather data found for ${search}` });
        }
        const currentCondition = weatherData.current.condition.text.toLowerCase(); // Convert to lowercase for case-insensitive comparison

        if (currentCondition === targetCondition) {
            res.status(200).json({ message: `The current condition is ${targetCondition}.` });
        } else {
            res.status(201).json({ message: `The current condition is not ${targetCondition}, but it is ${currentCondition}.`});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error checking weather condition');
    }
});

module.exports = weatherRouter;

