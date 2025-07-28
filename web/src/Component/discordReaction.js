import React, {useState, useEffect} from 'react';
import {getChannelList, getServerList, getUsersList, isLoggedDiscord} from "../js/discords";

const DiscordReactions = ({
                              showDiscordLogin,
                              styles,
                              reactionContainer,
                              discordReactionSelected,
                              reactions,
                              accessToken,
                              setDiscordReactionSelected,
                              setReactionDetailsHome
                          }) => {
    const [discordIsLogged, setDiscordIsLogged] = useState(JSON.parse(localStorage.getItem('discordIsLogged')) || false);
    const [discordServerList, setDiscordServerList] = useState([]);
    const [selectedDiscordReaction, setSelectedDiscordReaction] = useState(localStorage.getItem('selectedDiscordReaction') || '');
    const [discordReaction, setDiscordReaction] = useState(false);
    const [showDiscordUsers, setShowDiscordUsers] = useState(JSON.parse(localStorage.getItem('showDiscordUsers')) || false);
    const [selectedDiscordUser, setSelectedDiscordUser] = useState(localStorage.getItem('selectedDiscordUser') || '');
    const [reactionType, setReactionType] = useState(localStorage.getItem('reactionType') || '');
    const [showDiscordChannel, setShowDiscordChannel] = useState(JSON.parse(localStorage.getItem('showDiscordChannel')) || false);
    const [selectedDiscordChannel, setSelectedDiscordChannel] = useState(localStorage.getItem('selectedDiscordChannel') || '');
    const [discordDone, setDiscordDone] = useState(JSON.parse(localStorage.getItem('discordDone')) || false);
    const [selectedDiscordServer, setSelectedDiscordServer] = useState(localStorage.getItem('selectedDiscordServer') || '');
    const [discordChannelList, setDiscordChannelList] = useState([]);
    const [discordUserList, setDiscordUserList] = useState([]);
    const [reactionDetails, setReactionDetails] = useState(JSON.parse(localStorage.getItem('reactionDetails')) || {
        reactionApp: 'Discord',
        "Discord": {
            reactionType: '',
            reactionUrl: '',
            reactionServerId: '',
            reactionChannelId: '',
            reactionUserId: ''
        }});

    const handleLoginWithDiscord = async () => {
        window.open(`${process.env.REACT_APP_API_URL}/auth/discord/login`, '_self');
    };

    const handleDiscordReactionSelected = (event) => {
        setSelectedDiscordReaction(event.target.value);
        const name = event.target.selectedOptions[0].text;
        if (name === "Send Message on Channel") {
            setDiscordReaction(true);
            setShowDiscordUsers(false);
            setSelectedDiscordUser('');
            setReactionType("channel");
            setShowDiscordChannel(true);
        } else if (name === "Send Message on DM") {
            setDiscordReaction(true);
            setShowDiscordChannel(false);
            setSelectedDiscordChannel('');
            setReactionType("user");
            setShowDiscordUsers(true);
        }
        if (event.target.value === "") {
            setDiscordReaction(false);
            setShowDiscordChannel(false);
            setShowDiscordUsers(false);
            alert("Please select an action")
            return;
        }
        setDiscordReactionSelected(true);
    }

    const handleDiscordChannelChange = (event) => {
        setSelectedDiscordChannel(event.target.value);
        setDiscordDone(true);
    }

    const handleDiscordUserChange = (event) => {
        setSelectedDiscordUser(event.target.value);
        setDiscordDone(true);
    }

    const handleDiscordServerChange = (event) => {
        setSelectedDiscordServer(event.target.value);
        if (reactionType === "channel") {
            setShowDiscordChannel(true);
        } else if (reactionType === "user") {
            setShowDiscordUsers(true);
        }
        setDiscordDone(false);
        setSelectedDiscordChannel('');
        setDiscordChannelList([]);
        setDiscordUserList([]);
    };

    useEffect(() => {
        if (accessToken === null) {
            getServerList(localStorage.getItem("accessToken"))
                .then((res) => setDiscordServerList(res))
                .catch((err) => console.error(err));
        } else {
            getServerList(accessToken)
                .then((res) => setDiscordServerList(res))
                .catch((err) => console.error(err));
        }
    }, [discordIsLogged]);

    useEffect(() => {
        if (accessToken === null) {
            if (reactionType === "channel")
                getChannelList(localStorage.getItem("accessToken"), selectedDiscordServer)
                    .then((res) => setDiscordChannelList(res))
                    .catch((err) => console.error(err));
            else if (reactionType === "user")
                getUsersList(localStorage.getItem("accessToken"), selectedDiscordServer)
                    .then((res) => setDiscordUserList(res))
                    .catch((err) => console.error(err));
        } else {
            if (reactionType === "channel")
                getChannelList(accessToken, selectedDiscordServer)
                    .then((res) => setDiscordChannelList(res))
                    .catch((err) => console.error(err));
            else if (reactionType === "user")
                getUsersList(accessToken, selectedDiscordServer)
                    .then((res) => setDiscordUserList(res))
                    .catch((err) => console.error(err));
        }
    }, [selectedDiscordServer, reactionType]);

    useEffect(() => {
        localStorage.setItem('showDiscordLogin', JSON.stringify(showDiscordLogin));
        localStorage.setItem('discordReactionSelected', JSON.stringify(discordReactionSelected));
        localStorage.setItem('discordIsLogged', JSON.stringify(discordIsLogged));
        localStorage.setItem('selectedDiscordServer', selectedDiscordServer);
        localStorage.setItem('discordDone', JSON.stringify(discordDone));
        localStorage.setItem('selectedDiscordReaction', selectedDiscordReaction);
        localStorage.setItem('selectedDiscordChannel', selectedDiscordChannel);
        localStorage.setItem('selectedDiscordUser', selectedDiscordUser);
        localStorage.setItem('showDiscordChannel', JSON.stringify(showDiscordChannel));
        localStorage.setItem('showDiscordUsers', JSON.stringify(showDiscordUsers));
        localStorage.setItem('reactionType', reactionType);
        localStorage.setItem('reactionDetails', JSON.stringify(reactionDetails));
    }, [
        showDiscordLogin,
        discordReactionSelected,
        discordIsLogged,
        selectedDiscordServer,
        discordDone,
        selectedDiscordReaction,
        selectedDiscordChannel,
        selectedDiscordUser,
        showDiscordChannel,
        showDiscordUsers,
        reactionType,
        reactionDetails
    ]);

    useEffect(() => {
        const details = {
            reactionApp: 'Discord',
            "Discord": {
                reactionType: reactionType,
                reactionUrl: selectedDiscordReaction,
                reactionServerId: selectedDiscordServer,
                reactionChannelId: selectedDiscordChannel,
                reactionUserId: selectedDiscordUser
            }
        }
        setReactionDetails(details);
        setReactionDetailsHome(details);
    }, [reactionType, selectedDiscordReaction, selectedDiscordServer, selectedDiscordChannel, selectedDiscordUser]);

    useEffect(() => {
        if (accessToken === null) {
            isLoggedDiscord(localStorage.getItem("accessToken")).then((res) => {
                if (res.message === "Logged") {
                    setDiscordIsLogged(true);
                }
            });
        } else {
            isLoggedDiscord(accessToken).then((res) => {
                if (res.message === "Logged") {
                    setDiscordIsLogged(true);
                }
            });
        }
    }, [accessToken]);
    return (

        <>
            {reactionContainer && (
                <div style={styles.reactionContainer}>
                    {discordReactionSelected && !discordIsLogged && (
                        <button onClick={handleLoginWithDiscord}
                                style={{display: showDiscordLogin ? 'block' : 'none', ...(showDiscordLogin ? styles.handleLoginWithDiscord:  {}),}}>
                            Login Discord
                        </button>
                    )}
                    {discordIsLogged && (
                    <select value={selectedDiscordReaction} onChange={handleDiscordReactionSelected}
                            style={{display: showDiscordLogin ? 'block' : 'none', ...(showDiscordLogin ? styles.handleDiscordReactionSelected : {}),}}>
                        <option value="">Reaction Discord</option>
                        { reactions['Discord'] && reactions['Discord'].map((reaction, index) => (
                            <option key={index} value={reaction.url}>{reaction.name}</option>
                        ))}
                    </select>
                    )}
                    {discordReaction && (
                        <div style={{zIndex: 1}}>
                            <select value={selectedDiscordServer} onChange={handleDiscordServerChange}
                                    style={{display: showDiscordLogin ? 'block' : 'none', ...(showDiscordLogin ? styles.handleDiscordServerChange : {}),}}>
                                <option value="" hidden={true}>Select a Discord Server</option>
                                {discordServerList.length > 0 && discordServerList.map((server, index) => (
                                    <option key={index} value={server.id}>{server.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {showDiscordChannel && (
                        <div style={{zIndex: 1}}>
                            <select value={selectedDiscordChannel} onChange={handleDiscordChannelChange}
                                    style={{display: showDiscordLogin ? 'block' : 'none', ...(showDiscordLogin ? styles.handleDiscordChannelChange: {}),}}>
                                <option value="" hidden={true}>Select a Discord Channel</option>
                                {discordChannelList && discordChannelList.map((channel, index) => (
                                    <option key={index} value={channel.id}>{channel.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {showDiscordUsers && (
                        <div style={{zIndex: 1}}>
                            <select value={selectedDiscordUser} onChange={handleDiscordUserChange}
                                    style={{display: showDiscordLogin ? 'block' : 'none', ...(showDiscordLogin ? styles.handleDiscordUserChange : {}),}}>
                                <option value="" hidden={true}>Select a Discord User</option>
                                {discordUserList && discordUserList.map((user, index) => (
                                    <option key={index} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DiscordReactions;
