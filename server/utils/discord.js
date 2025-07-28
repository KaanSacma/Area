const axios = require('axios');
const client = require('../discord');

const getGuildsOwnerList = async (access_token) => {
    return await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${access_token}`,
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

const getGuildsChannelsList = async (guildId) => {
    const guild = await client.guilds.fetch(guildId);
    const channels = await guild.channels.fetch();
    const channelsList = [];
    channels.forEach(channel => {
        client.channels.fetch(channel.id).then((currentChannel) => {
            if (currentChannel.type === 0) {
                const channelInfo = {};
                channelInfo.id = channel.id;
                channelInfo.name = channel.name;
                channelsList.push(channelInfo);
            }
        });
    });
    return channelsList;
}

const getUsersOnGuild = async (guildId) => {
    const guild = await client.guilds.fetch(guildId);
    const members = await guild.members.fetch();
    const membersList = [];
    members.forEach(member => {
        const memberInfo = {};
        memberInfo.id = member.id;
        memberInfo.name = member.user.username;
        membersList.push(memberInfo);
    });
    return membersList;
}

module.exports = {
    getGuildsOwnerList,
    getGuildsChannelsList,
    getUsersOnGuild
}
