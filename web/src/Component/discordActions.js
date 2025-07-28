import React, {useState, useEffect} from 'react';
import {getChannelList, getServerList, getUsersList, isLoggedDiscord} from "../js/discords";

const DiscordActions = ({
                            actionContainer,
                            discordActionSelected,
                            showDiscordLoginAction,
                            styles,
                            discordStyle,
                            actions,
                            accessToken,
                            setDiscordActionSelected,
                            setActionDetailsHome
                        }) => {
    const [discordIsLoggedAction, setDiscordIsLoggedAction] = useState(JSON.parse(localStorage.getItem('discordIsLoggedAction')) || false);
    const [selectedDiscordAction, setSelectedDiscordAction] = useState(localStorage.getItem('selectedDiscordAction') || '');
    const [discordDMBool, setDiscordDMBool] = useState(JSON.parse(localStorage.getItem('discordDMAction')) || false);
    const [discordAction, setDiscordAction] = useState(false);
    const [showDiscordUsersAction, setShowDiscordUsersAction] = useState(JSON.parse(localStorage.getItem('showDiscordUsersAction')) || false);
    const [selectedDiscordUserAction, setSelectedDiscordUserAction] = useState(localStorage.getItem('selectedDiscordUser') || '');
    const [actionType, setActionType] = useState(localStorage.getItem('actionType') || '');
    const [showDiscordChannelAction, setShowDiscordChannelAction] = useState(JSON.parse(localStorage.getItem('showDiscordChannelAction')) || false);
    const [selectedDiscordChannelAction, setSelectedDiscordChannelAction] = useState(localStorage.getItem('selectedDiscordChannelAction') || '');
    const [discordChannelListAction, setDiscordChannelListAction] = useState(JSON.parse(localStorage.getItem('discordChannelListAction')) || []);
    const [selectedDiscordServerAction, setSelectedDiscordServerAction] = useState(localStorage.getItem('selectedDiscordServer') || '');
    const [discordUserListAction, setDiscordUserListAction] = useState(JSON.parse(localStorage.getItem('discordUserListAction')) || []);
    const [discordServerListAction, setDiscordServerListAction] = useState([]);
    const [discordDM, setDiscordDM] = useState(localStorage.getItem('discordDMAction') || '');
    const [actionDetails, setActionDetails] = useState(JSON.parse(localStorage.getItem('actionDetails')) || {
        actionApp: 'Discord',
        "Discord": {
            actionType: '',
            actionUrl: '',
            actionServerId: '',
            actionChannelId: '',
            actionUserId: '',
            actionMessage: ''
        }});

    const handleLoginWithDiscordAction = async () => {
        window.open(`${process.env.REACT_APP_API_URL}/auth/discord/login`, '_self');
    };

    const handleDiscordDm = (event) => {
        const value = event.target.value;
        setDiscordDM(value);
    }

    const handleDiscordActionSelected = (event) => {
        setSelectedDiscordAction(event.target.value);
        const name = event.target.selectedOptions[0].text;
        if (name === "Contains Text on Channel") {
            if (showDiscordChannelAction !== true)
                setDiscordDMBool(false);
            setDiscordAction(true);
            setShowDiscordUsersAction(false);
            setSelectedDiscordUserAction('');
            setActionType("channel");
            setDiscordDMBool(false);
            setShowDiscordChannelAction(true);
        } else if (name === "Contains Text on DM") {
            if (showDiscordUsersAction !== true)
                setDiscordDMBool(false);
            setDiscordAction(true);
            setShowDiscordChannelAction(false);
            setSelectedDiscordChannelAction('');
            setActionType("user");
            setShowDiscordUsersAction(true);
        }
        if (event.target.value === "") {
            alert("Please select an action")
            setDiscordAction(false);
            setDiscordDMBool(false);
            setShowDiscordChannelAction(false);
            setShowDiscordUsersAction(false);
            return;
        }
        setDiscordActionSelected(true);
    };

    const handleDiscordServerChangeAction = (event) => {
        setSelectedDiscordServerAction(event.target.value);
        if (actionType === "channel") {
            setShowDiscordChannelAction(true);
        } else if (actionType === "user") {
            setShowDiscordUsersAction(true);
        }
        setSelectedDiscordChannelAction('');
        setDiscordChannelListAction([]);
        setDiscordUserListAction([]);
    };

    const handleDiscordChannelChangeAction = (event) => {
        setSelectedDiscordChannelAction(event.target.value);
        setDiscordDMBool(true);
    }

    const handleDiscordUserChangeAction = (event) => {
        setSelectedDiscordUserAction(event.target.value);
        setDiscordDMBool(true);
    }

    useEffect(() => {
        if (accessToken === null) {
            if (actionType === "channel") {
                getChannelList(localStorage.getItem("accessToken"), selectedDiscordServerAction)
                    .then((res) => setDiscordChannelListAction(res))
                    .catch((err) => console.error(err));
            }
            else if (actionType === "user")
                getUsersList(localStorage.getItem("accessToken"), selectedDiscordServerAction)
                    .then((res) => setDiscordUserListAction(res))
                    .catch((err) => console.error(err));
        } else {
            if (actionType === "channel")
                getChannelList(accessToken, selectedDiscordServerAction)
                    .then((res) => setDiscordChannelListAction(res))
                    .catch((err) => console.error(err));
            else if (actionType === "user")
                getUsersList(accessToken, selectedDiscordServerAction)
                    .then((res) => setDiscordUserListAction(res))
                    .catch((err) => console.error(err));
        }
    }, [selectedDiscordServerAction, actionType]);

    useEffect(() => {
        if (accessToken === null) {
            getServerList(localStorage.getItem("accessToken"))
                .then((res) => setDiscordServerListAction(res))
                .catch((err) => console.error(err));
        } else {
            getServerList(accessToken)
                .then((res) => setDiscordServerListAction(res))
                .catch((err) => console.error(err));
        }
    }, [discordIsLoggedAction]);

    useEffect(() => {
        localStorage.setItem('discordStyle', discordStyle);
        localStorage.setItem('actionType', actionType);
        localStorage.setItem('showDiscordLoginAction', JSON.stringify(showDiscordLoginAction));
        localStorage.setItem('selectedDiscordUserAction', selectedDiscordUserAction);
        localStorage.setItem('selectedDiscordChannelAction', selectedDiscordChannelAction);
        localStorage.setItem('discordChannelListAction', JSON.stringify(discordChannelListAction));
        localStorage.setItem('discordUserListAction', JSON.stringify(discordUserListAction));
        localStorage.setItem('discordActionSelected', JSON.stringify(discordActionSelected));
        localStorage.setItem('selectedDiscordAction', selectedDiscordAction);
        localStorage.setItem('discordIsLoggedAction', JSON.stringify(discordIsLoggedAction));
        localStorage.setItem('showDiscordChannelAction', JSON.stringify(showDiscordChannelAction));
        localStorage.setItem('showDiscordUsersAction', JSON.stringify(showDiscordUsersAction));
        localStorage.setItem('actionDetails', JSON.stringify(actionDetails));
    }, [
        discordStyle,
        actionType,
        showDiscordLoginAction,
        selectedDiscordUserAction,
        selectedDiscordChannelAction,
        discordChannelListAction,
        discordUserListAction,
        discordActionSelected,
        selectedDiscordAction,
        showDiscordChannelAction,
        showDiscordUsersAction,
        discordIsLoggedAction,
        actionDetails,
    ]);

    useEffect(() => {
        const details = {
            actionApp: 'Discord',
            "Discord": {
                actionType: actionType,
                actionUrl: selectedDiscordAction,
                actionServerId: selectedDiscordServerAction,
                actionChannelId: selectedDiscordChannelAction,
                actionUserId: selectedDiscordUserAction,
                actionMessage: discordDM
            }
        }
        setActionDetails(details);
        setActionDetailsHome(details);
    }, [actionType, selectedDiscordAction, selectedDiscordServerAction, selectedDiscordChannelAction, selectedDiscordUserAction, discordDM]);

    useEffect(() => {
        if (accessToken === null) {
            isLoggedDiscord(localStorage.getItem("accessToken")).then((res) => {
                if (res.message === "Logged") {
                    setDiscordIsLoggedAction(true);
                }
            });
        } else {
            isLoggedDiscord(accessToken).then((res) => {
                if (res.message === "Logged") {
                    setDiscordIsLoggedAction(true);
                }
            });
        }
    }, [accessToken]);
    return (
        <>
            {actionContainer && (
                <div style={styles.actionContainer}>
                    {discordActionSelected && !discordIsLoggedAction && (
                        <button onClick={handleLoginWithDiscordAction}
                                style={{display: showDiscordLoginAction ? 'block' : 'none', ...(showDiscordLoginAction ? styles.handleLoginWithDiscordAction : {}), ...discordStyle.handleLoginWithDiscordAction,}}>
                            Login Discord
                        </button>
                    )}
                    {discordIsLoggedAction  && (
                        <select value={selectedDiscordAction} onChange={handleDiscordActionSelected}
                                style={{display: showDiscordLoginAction ? 'block' : 'none', ...(showDiscordLoginAction ? styles.handleDiscordActionSelected : {}), ...discordStyle.handleDiscordActionSelected,}}>
                            <option value="">Action Discord</option>
                            { actions['Discord'] && actions['Discord'].map((action, index) => (
                                <option key={index} value={action.url}>{action.name}</option>
                            ))}
                        </select>
                    )}
                    {discordAction && (
                        <div style={{zIndex: 1}}>
                            <select value={selectedDiscordServerAction} onChange={handleDiscordServerChangeAction}
                                    style={{display: showDiscordLoginAction ? 'block' : 'none', ...(showDiscordLoginAction ? styles.handleDiscordServerChangeAction : {}), ...discordStyle.handleDiscordServerChangeAction,}}>
                                <option value="" hidden={true}>Select a Discord Server</option>
                                {discordServerListAction.length > 0 && discordServerListAction.map((server, index) => (
                                    <option key={index} value={server.id}>{server.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {showDiscordChannelAction && (
                        <div style={{zIndex: 1}}>
                            <select value={selectedDiscordChannelAction} onChange={handleDiscordChannelChangeAction}
                                    style={{display: showDiscordLoginAction ? 'block' : 'none', ...(showDiscordLoginAction ? styles.handleDiscordChannelChangeAction : {}), ...discordStyle.handleDiscordChannelChangeAction,}}>
                                <option value="" hidden={true}>Select a Discord Channel</option>
                                {discordChannelListAction && discordChannelListAction.map((channel, index) => (
                                    <option key={index} value={channel.id}>{channel.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {showDiscordUsersAction && (
                        <div style={{zIndex: 1}}>
                            <select value={selectedDiscordUserAction} onChange={handleDiscordUserChangeAction}
                                    style={{display: showDiscordLoginAction ? 'block' : 'none', ...(showDiscordLoginAction ? styles.handleDiscordUserChangeAction : {}), ...discordStyle.handleDiscordUserChangeAction,}}>
                                <option value="" hidden={true}>Select a Discord User</option>
                                {discordUserListAction && discordUserListAction.map((user, index) => (
                                    <option key={index} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {discordDMBool && (
                        <div style={{zIndex: 1}}>
                            <input style={{display: showDiscordLoginAction ? 'block' : 'none', ...(showDiscordLoginAction? styles.handleDiscordMessage : {}), }} type={"text"} value={discordDM} onChange={handleDiscordDm} placeholder={"Type here..."}></input>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default DiscordActions;
