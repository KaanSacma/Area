import axios from 'axios';

const getServerList = async (accessToken) => {
    const response = await axios.get(`${process.env.API_URL}/discord/getguilds`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await response.data;
}

const getChannelList = async (accessToken, guildId) => {
    const response = await axios.get(`${process.env.API_URL}/discord/getchannels/${guildId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await response.data;
}

const getUsersList = async (accessToken, guildId) => {
    const response = await axios.get(`${process.env.API_URL}/discord/getusers/${guildId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await response.data;
}

export {getServerList, getChannelList, getUsersList};
