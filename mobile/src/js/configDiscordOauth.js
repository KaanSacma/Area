import { authorize } from 'react-native-app-auth';
import axios from 'axios';

const config = {
    issuer: 'https://discord.com/api/oauth2/authorize',
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUrl: "mobile://Home",
    scopes: ['identify', 'guilds', 'guilds.members.read', 'bot', 'messages.read'],
    dangerouslyAllowInsecureHttpRequests: true,
    serviceConfiguration: {
        authorizationEndpoint: `https://discord.com/api/oauth2/authorize?client_id=1160658956465733783&permissions=8&redirect_uri=https%3A%2F%2Fareaotek.azurewebsites.net%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20guilds.members.read%20bot%20messages.read`,
        tokenEndpoint: 'https://discord.com/api/oauth2/token',
        revocationEndpoint: 'https://discord.com/api/oauth2/token/revoke'
    }
};

const addDiscordInfo = (id, guilds, accessToken, discordAccessToken, discordRefreshToken) => {
    axios.post(`${process.env.API_URL}/auth/discord/add`, {
        id: id,
        guilds: guilds,
        access_token: discordAccessToken,
        refresh_token: discordRefreshToken
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${accessToken}`,
        }
    }).catch((error) => {
        console.error("addDiscordInfo Error:", error);
    });
}

const getUserId = async (accessToken) => {
    const user = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return await user.data.id;
}

const getGuildsOwnerList = async (accessToken) => {
    return await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }).then((response) => {
        const guilds = response.data;
        const guildsOwnerList = [];
        for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].owner === true) {
                const guildInfo = {}
                guildInfo.id = guilds[i].id;
                guildInfo.name = guilds[i].name;
                guildsOwnerList.push(guildInfo);
            }
        }
        return guildsOwnerList;
    }).catch((error) => {
        console.error(error);
    });
}

export async function signInWithDiscord(access_token) {
    try {
        const result = await authorize(config);
        if (result.accessToken) {
            await getUserId(result.accessToken).then((id) => {
                getGuildsOwnerList(result.accessToken).then((guilds) => {
                    addDiscordInfo(id, guilds, access_token, result.accessToken, result.refreshToken);
                });
            });
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        console.error('Discord authentication error:', error);
        throw error;
    }
}
