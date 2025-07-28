const database = require('./config');
const axios = require('axios');

const runActionService = async (service) => {
    if (service.action_name === "Discord") {
        const body = {
            'text': JSON.parse(service.details).text,
        }
        const action = await axios.get(service.action_url, { data: body });
        if (action.status === 200) {
            return await action.data;
        }
        return false;
    } else if (service.action_name === "Open Weather" || service.action_name === "TMDB" || service.action_name === "News" || service.action_name === "Joke") {
        const action = await axios.get(service.action_url);
        if (action.status === 200) {
            return await action.data;
        }
        return false;
    } else if (service.action_name === "Time") {
        const body = {
            timeZone: JSON.parse(service.details).timeZone,
            wantedHour: JSON.parse(service.details).wantedHour,
            wantedMinute: JSON.parse(service.details).wantedMinute,
            wantedInterval: JSON.parse(service.details).wantedInterval,
        }
        const action = await axios.get(service.action_url, { data: body });
        if (action.status === 200) {
            return await action.data;
        }
        return false;
    }
    return false;
}

const runReactionService = async (service, message) => {
    if (service.reaction_name === "Discord" || service.reaction_name === "Gmail") {
        const body = {
            'message': message,
        }
        const reaction = await axios.post(service.reaction_url, body);
        if (reaction.status === 200) {
            const data = await reaction.data;
            return await data;
        }
        return false;
    }
    return false;
}

const runService = async (service) => {
    const action = await runActionService(service);
    if (action !== false) {
        if (service.action_name === "Discord") {
            if (service.reaction_name === "Discord" || service.reaction_name === "Gmail") {
                if (JSON.parse(service.details).lastTime === undefined || JSON.parse(service.details).lastTime !== action.time) {
                    await database.updateDetailsServices(service.id, {text: JSON.parse(service.details).text, lastTime: action.time});
                    service.details.lastTime = JSON.stringify(action.time);
                } else {
                    return false;
                }
                const message = "Message from " + action.author + ": " + action.content;
                const reaction = await runReactionService(service, message);
                if (reaction) {
                    return true;
                }
            }
        } else if (service.action_name === "Open Weather" || service.action_name === "TMDB" || service.action_name === "News" || service.action_name === "Joke") {
            if (service.reaction_name === "Discord" || service.reaction_name === "Gmail") {
                if (JSON.parse(service.details).lastTime === undefined) {
                    const time = Date.now();
                    await database.updateDetailsServices(service.id, {lastTime: time});
                } else {
                    const oneHourInMilliseconds = 60 * 60 * 1000;
                    const currentTime = Date.now();

                    if (currentTime - JSON.parse(service.details).lastTime >= oneHourInMilliseconds) {
                        await database.updateDetailsServices(service.id, {lastTime: currentTime});
                    } else {
                        return false;
                    }
                }
                const reaction = await runReactionService(service, action.message);
                if (reaction) {
                    return true;
                }
            }
        } else if (service.action_name === "Time") {
            if (service.reaction_name === "Discord" || service.reaction_name === "Gmail") {
                if (JSON.parse(service.details).wantedHour !== undefined && JSON.parse(service.details).lastTime === undefined) {
                    const time = Date.now();
                    await database.updateDetailsServices(service.id, {timeZone: JSON.parse(service.details).timeZone, wantedHour: service.details.wantedHour, lastTime: time});
                } else if (JSON.parse(service.details).wantedHour !== undefined && JSON.parse(service.details).lastTime !== undefined) {
                    const oneHourInMilliseconds = 60 * 60 * 1000;
                    const currentTime = Date.now();

                    if (currentTime - JSON.parse(service.details).lastTime >= oneHourInMilliseconds) {
                        await database.updateDetailsServices(service.id, {timeZone: JSON.parse(service.details).timeZone, wantedHour: JSON.parse(service.details).wantedHour, lastTime: currentTime});
                    } else {
                        return false;
                    }
                }

                if ((JSON.parse(service.details).wantedMinute !== undefined || JSON.parse(service.details).wantedInterval !== undefined) && JSON.parse(service.details).lastTime === undefined) {
                    const time = Date.now();
                    await database.updateDetailsServices(service.id, {timeZone: JSON.parse(service.details).timeZone, wantedMinute: JSON.parse(service.details).wantedMinute, wantedInterval: JSON.parse(service.details).wantedInterval, lastTime: time});
                } else if ((JSON.parse(service.details).wantedMinute !== undefined || JSON.parse(service.details).wantedInterval !== undefined) && JSON.parse(service.details).lastTime !== undefined) {
                    const oneHourInMilliseconds = 60 * 1000;
                    const currentTime = Date.now();

                    if (currentTime - JSON.parse(service.details).lastTime >= oneHourInMilliseconds) {
                        await database.updateDetailsServices(service.id, {timeZone: JSON.parse(service.details).timeZone, wantedMinute: JSON.parse(service.details).wantedMinute, wantedInterval: JSON.parse(service.details).wantedInterval, lastTime: currentTime});
                    } else {
                        return false;
                    }
                }
                const reaction = await runReactionService(service, action.message);
                if (reaction) {
                    return true;
                }
            }
        }
    }
    return false;
}

const executeServices = async (servicesList) => {
    if (servicesList.length > 0) {
        for (const service of servicesList) {
            if (service.status === true) {
                await runService(service);
            }
        }
    }
}

const run = async () => {
    const servicesList = await database.getServices();
    await executeServices(servicesList);
}

setInterval(run, 1000);
