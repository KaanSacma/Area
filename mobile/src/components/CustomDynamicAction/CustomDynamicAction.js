import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import CustomInputDropDown from "../CustomInputDropDown";
import { signInWithDiscord } from "../../js/configDiscordOauth";
import {getActionsServices, getReactionsServices} from "../../js/services";
import {getServerList, getChannelList, getUsersList} from "../../js/discord";
import CustomInput from "../CustomInput";

const DynamicActionComponent = ({ actionApp, AccessToken, setReactionDetails }) => {
    const [selectedAction, setSelectedAction] = useState(null);
    const [actionFunction, setActionFunction] = useState('');
    const [channelFunction, setChannelFunction] = useState('');
    const [serverFunction, setServerFunction] = useState('');
    const [userFunction, setUserFunction] = useState('');
    const [connectedToDiscord, setConnectedToDiscord] = useState(false);
    const [reactions, setReactions] = useState([]);
    const [dropDownDiscordReactions, setDropDownDiscordReactions] = useState([]);
    const [dropDownServers, setDropDownServers] = useState([]);
    const [dropDownChannels, setDropDownChannels] = useState([]);
    const [dropDownUsers, setDropDownUsers] = useState([]);
    const [GmailFunction, setGmailFunction] = useState('');
    const [GmailSubjectFunction, setGmailSubjectFunction] = useState('');
    const [dropDownGmailActions, setDropDownGmailActions] = useState([]);

    const reactionDetails = {
        reactionApp: '',
        "Discord": {
            reactionType: '',
            reactionUrl: '',
            reactionServerId: '',
            reactionChannelId: '',
            reactionUserId: ''
        },
        "Gmail": {
            reactionType: '',
            reactionUrl: '',
            Gmail: '',
            GmailSubject: '',
        },
    }

    const getDiscordReactionUrl = (actionName) => {
        for (let i = 0; i < dropDownDiscordReactions.length; i++) {
            if (dropDownDiscordReactions[i].label === actionName) {
                return dropDownDiscordReactions[i].url;
            }
        }
        return null;
    }

    const getDiscordServerId = (serverName) => {
        for (let i = 0; i < dropDownServers.length; i++) {
            if (dropDownServers[i].label === serverName) {
                return dropDownServers[i].id;
            }
        }
        return null;
    }

    const getDiscordChannelId = (channelName) => {
        for (let i = 0; i < dropDownChannels.length; i++) {
            if (dropDownChannels[i].label === channelName) {
                return dropDownChannels[i].id;
            }
        }
        return null;
    }

    const getDiscordUserId = (userName) => {
        for (let i = 0; i < dropDownUsers.length; i++) {
            if (dropDownUsers[i].label === userName) {
                return dropDownUsers[i].id;
            }
        }
        return null;
    }

    useEffect(() => {
        if (reactions.length > 0 || AccessToken === null) {
            return;
        }
        getReactionsServices(AccessToken).then((res) => {
            setReactions(res);
            if (connectedToDiscord) {
                const dropdownDiscordReactions = [];
                for (let i = 0; i < res["Discord"].length; i++) {
                    dropdownDiscordReactions.push({ label: res["Discord"][i].name, url: res["Discord"][i].url });
                }
                setDropDownDiscordReactions(dropdownDiscordReactions);
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [AccessToken, connectedToDiscord]);

    useEffect(() => {
        if (connectedToDiscord) {
            if (dropDownServers.length > 0 || AccessToken === null) {
                return;
            }
            getServerList(AccessToken).then((res) => {
                const dropdownServers = [];
                for (let i = 0; i < res.length; i++) {
                    dropdownServers.push({ label: res[i].name, id: res[i].id });
                }
                setDropDownServers(dropdownServers);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [connectedToDiscord, AccessToken]);

    useEffect(() => {
        if (serverFunction === '' || AccessToken === null || !connectedToDiscord) {
            return;
        }
        const serverId = getDiscordServerId(serverFunction);
        if (serverId === null) {
            return;
        }
        getChannelList(AccessToken, serverId).then((res) => {
            const dropdownChannels = [];
            for (let i = 0; i < res.length; i++) {
                dropdownChannels.push({ label: res[i].name, id: res[i].id });
            }
            setDropDownChannels(dropdownChannels);
        }).catch((err) => {
            console.log(err);
        });
        getUsersList(AccessToken, serverId).then((res) => {
            const dropdownUsers = [];
            for (let i = 0; i < res.length; i++) {
                dropdownUsers.push({ label: res[i].name, id: res[i].id });
            }
            setDropDownUsers(dropdownUsers);
        }).catch((err) => {
            console.error(err);
        });
    }, [connectedToDiscord, serverFunction]);

    useEffect(() => {
        reactionDetails.reactionApp = actionApp;
        if (actionApp === 'Discord') {
            if (actionFunction !== '') {
                reactionDetails["Discord"].reactionUrl = getDiscordReactionUrl(actionFunction);
            }
            if (serverFunction !== '') {
                reactionDetails["Discord"].reactionServerId = getDiscordServerId(serverFunction);
            }
            if (channelFunction !== '') {
                reactionDetails["Discord"].reactionChannelId = getDiscordChannelId(channelFunction);
                reactionDetails["Discord"].reactionType = 'channel';
            }
            if (userFunction !== '') {
                reactionDetails["Discord"].reactionUserId = getDiscordUserId(userFunction);
                reactionDetails["Discord"].reactionType = 'user';
            }
            setReactionDetails(reactionDetails);
        }
    }, [actionApp, actionFunction, channelFunction, serverFunction, userFunction]);

    const getGmailActionUrl = () => {
        for (let i = 0; i < dropDownGmailActions.length; i++) {
            if (dropDownGmailActions[i].label === actionFunction) {
                return dropDownGmailActions[i].url;
            }
        }
        return null;
    }

    const getGmailAction = (Gmail) => {
        setGmailFunction(Gmail);
    }

    const getGmailSubjectAction = (GmailSubject) => {
        setGmailSubjectFunction(GmailSubject);
    }

    useEffect(() => {
        if (reactions.length > 0 || AccessToken === null) {
            return;
        }
        getReactionsServices(AccessToken).then((res) => {
            setReactions(res);
            const dropDownGmailActions = [];
            for (let i = 0; i < res["Gmail"].length; i++) {
                dropDownGmailActions.push({label: res["Gmail"][i].name, url: res["Gmail"][i].url});
            }
            setDropDownGmailActions(dropDownGmailActions);
        }).catch((err) => {
            console.log(err);
        });
    }, [AccessToken]);


    useEffect(() => {
        reactionDetails.reactionApp = actionApp;
        if (actionApp === 'Gmail') {
            if (actionFunction !== '') {
                reactionDetails["Gmail"].reactionUrl = getGmailActionUrl();
            }
            if (GmailFunction !== '') {
                reactionDetails["Gmail"].Gmail = GmailFunction;
                reactionDetails["Gmail"].GmailSubject = GmailSubjectFunction;
            }

            setReactionDetails(reactionDetails);
        }
    }, [actionApp, actionFunction, GmailFunction, GmailSubjectFunction]);

    if (actionApp === 'Discord') {
        return (
            <View style={styles.githubContainer}>
                {!connectedToDiscord ? (
                    <View style={styles.connectButtonContainer}>
                        <Button
                            title="Connect to Discord"
                            onPress={() => {
                                signInWithDiscord(AccessToken).then(() => {
                                    setConnectedToDiscord(true);
                                });
                            }}
                        />
                    </View>
                ) : (
                    <View>
                        <View style={styles.actionDropdownContainer}>
                            {dropDownDiscordReactions.length > 0 && (
                                <CustomInputDropDown
                                    inputValue={actionFunction}
                                    setInputValue={setActionFunction}
                                    placeholder="Select Action"
                                    dropdownOptions={dropDownDiscordReactions}
                                    inputSize={{ width: 200 , height: 60 }}
                                />
                            )}
                        </View>
                        {actionFunction === 'Send Message on Channel' && (
                            <View style={styles.githubContainer}>
                                <Text>Server:</Text>
                                <View style={styles.channelDropdownContainer}>
                                    {dropDownServers.length > 0 && (
                                        <CustomInputDropDown
                                            inputValue={serverFunction}
                                            setInputValue={setServerFunction}
                                            placeholder="Select Server"
                                            dropdownOptions={dropDownServers}
                                            inputSize={{ width: 310, height: 60 }}
                                        />
                                    )}
                                </View>
                                {serverFunction && ( // Only render the channel dropdown if a server is selected
                                    <View style={styles.channelDropdownContainer}>
                                        {dropDownChannels.length > 0 && (
                                            <CustomInputDropDown
                                                inputValue={channelFunction}
                                                setInputValue={setChannelFunction}
                                                placeholder="Select Channel"
                                                dropdownOptions={dropDownChannels}
                                                inputSize={{ width: 310, height: 60 }}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                        {actionFunction === 'Send Message on DM' && (
                            <View style={styles.githubContainer}>
                                <Text>Server:</Text>
                                <View style={styles.channelDropdownContainer}>
                                    {dropDownServers.length > 0 && (
                                        <CustomInputDropDown
                                            inputValue={serverFunction}
                                            setInputValue={setServerFunction}
                                            placeholder="Select Server"
                                            dropdownOptions={dropDownServers}
                                            inputSize={{ width: 310, height: 60 }}
                                        />
                                    )}
                                </View>
                                {serverFunction && ( // Only render the channel dropdown if a server is selected
                                    <View style={styles.channelDropdownContainer}>
                                        {dropDownUsers.length > 0 && (
                                            <CustomInputDropDown
                                                inputValue={userFunction}
                                                setInputValue={setUserFunction}
                                                placeholder="Select User"
                                                dropdownOptions={dropDownUsers}
                                                inputSize={{ width: 310, height: 60 }}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    } else if (actionApp === 'Gmail') {
        return (
            <View style={styles.githubContainer}>
                <CustomInputDropDown
                    inputValue={actionFunction}
                    setInputValue={setActionFunction}
                    placeholder={'Gmail Action'}
                    dropdownOptions={dropDownGmailActions}
                    inputSize={{ width: 310, height: 60 }}
                />
                {actionFunction === 'Send an Email' && (
                    <View>
                        <CustomInput
                            inputValue={GmailFunction}
                            setInputValue={setGmailFunction}
                            placeholder={'Gmail'}
                            size={{ width: 310, height: 60 }}
                        />
                        <CustomInput
                            inputValue={GmailSubjectFunction}
                            setInputValue={setGmailSubjectFunction}
                            placeholder={'Gmail Subject'}
                            size={{ width: 310, height: 60 }}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    githubContainer: {
        width: '100%',
        marginBottom: 20,
    },
    githubDropdownContainer: {
        width: '100%',
        marginBottom: 20,
    },
    discordDropdownContainer: {
        zIndex: 5,
        width: 350,
        marginBottom: 20,
    },
});

export default DynamicActionComponent;
