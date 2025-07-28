const express = require('express');
const hourRouter = express.Router();
const axios = require('axios');


hourRouter.get('/zones', async (req, res) => {
    try {
        console.log("[GET] /time/zones called from " + req.ip);

        const response = await axios.get('https://timeapi.io/api/TimeZone/AvailableTimeZones');

        if (response.status === 200) {
            const data = response.data;
            res.status(200).json(data);
            console.log("loading all timezones");
        } else {
            throw new Error(`TimeAPI request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching time from TimeAPI: ' + error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

hourRouter.get('/wanted/hour', async (req, res) => {
    try {
        console.log("[GET] /time/wanted/hour called from " + req.ip);

        const wantedHour = req.body.wantedHour;
        const timeZone = req.body.timeZone;

        const response = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=${timeZone}`);

        if (response.status === 200) {
            const data = response.data;
            const { time } = data;
            const [currentHour, currentMinute] = time.split(":");
            if (currentHour === wantedHour) {
                res.status(200).json({ message: `It's ${wantedHour}:${currentMinute} from ${timeZone}` });
            } else {
                res.status(201).json({ message: "no" });
            }
        } else {
            throw new Error(`TimeAPI request failed with status ${response.status}`);
        }

    } catch (error) {
        console.error('Error fetching time from TimeAPI: ' + error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



hourRouter.get('/wanted/minute', async (req, res) => {
    try {
        console.log("[GET] /time/wanted/minute called from " + req.ip);

        const wantedMinute = req.body.wantedMinute;
        const timeZone = req.body.timeZone;

        const response = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=${timeZone}`);

        if (response.status === 200) {
            const data = response.data;
            const { time } = data;
            const [currentHour, currentMinute] = time.split(":");
            if (currentMinute === wantedMinute) {
                res.status(200).json({ message: `It's ${currentHour}:${wantedMinute} from ${timeZone}` });
            } else {
                res.status(201).json({ message: "no" });
            }
        } else {
            throw new Error(`TimeAPI request failed with status ${response.status}`);
        }

    } catch (error) {
        console.error('Error fetching time from TimeAPI: ' + error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

hourRouter.get('/wanted/interval', async (req, res) => {
    try {
        console.log("[GET] /time/wanted/interval called from " + req.ip);

        const wantedInterval = req.body.wantedInterval;
        const timeZone = req.body.timeZone;

        const response = await axios.get(`https://timeapi.io/api/Time/current/zone?timeZone=${timeZone}`);

        if (response.status === 200) {
            const data = response.data;
            const { time } = data;
            const [currentHour, currentMinute] = time.split(":");

            if (wantedInterval === "00") {
                if (currentMinute === "00") {
                    res.status(200).json({ message: `It's ${currentHour}:${currentMinute} from ${timeZone}` });
                } else {
                    res.status(201).json({ message: "no" });
                }
            } else if (wantedInterval === "15") {
                if (currentMinute === "00" || currentMinute === "15" || currentMinute === "30" || currentMinute === "45") {
                    res.status(200).json({ message: `It's ${currentHour}:${currentMinute} from ${timeZone}` });
                } else {
                    res.status(201).json({ message: "no" });
                }
            } else if (wantedInterval === "30") {
                if (currentMinute === "00" || currentMinute === "30") {
                    res.status(200).json({ message: `It's ${currentHour}:${currentMinute} from ${timeZone}` });
                } else {
                    res.status(201).json({ message: "no" });
                }
            } else {
                res.status(201).json({ message: "Invalid interval" });
            }
        } else {
            throw new Error(`TimeAPI request failed with status ${response.status}`);
        }

    } catch (error) {
        console.error('Error fetching time from TimeAPI: ' + error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = hourRouter;
