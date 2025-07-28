import axios from 'axios';

const addDiscordInfo = (id, guilds, accessToken, discordAccessToken, discordRefreshToken) => {
    axios.post(`${process.env.REACT_APP_API_URL}/auth/discord/add`, {id: id, guilds: guilds, access_token: discordAccessToken, refresh_token: discordRefreshToken}, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    }).then(r => window.open(`http://localhost:3000/home`, '_self')).catch(e => console.log(e));
}

const isLoggedDiscord = async (accessToken) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/discord/isLogged`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await response.data;
}

const getServerList = async (accessToken) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/discord/getguilds`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await response.data;
}

const getChannelList = async (accessToken, guildId) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/discord/getchannels/${guildId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await response.data;
}

const getUsersList = async (accessToken, guildId) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/discord/getusers/${guildId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await response.data;
}

export { addDiscordInfo, getServerList, getChannelList, getUsersList, isLoggedDiscord};
