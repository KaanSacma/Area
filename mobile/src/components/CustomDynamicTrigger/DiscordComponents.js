import React, {useEffect, useState} from 'react';
import { View, Button, StyleSheet, Text} from 'react-native';
import CustomInputDropDown from "../CustomInputDropDown";
import CustomInput from "../CustomInput";
import { signInWithDiscord } from "../../js/configDiscordOauth";
import { getServerList, getChannelList, getUsersList } from "../../js/discord";
import {getActionsServices} from "../../js/services";

const DiscordComponents = ({
                               AccessToken,
                               setActionDetails,
                               triggerFunction,
                               setTriggerFunction,
                               connectedToDiscord,
                               setConnectedToDiscord,
                               dropDownDiscordActions,
                               setDropDownDiscordActions,
                               dropDownServers,
                               setDropDownServers,
                               dropDownChannels,
                               setDropDownChannels,
                               dropDownUsers,
                               setDropDownUsers,
                               serverFunction,
                               setServerFunction,
                               channelFunction,
                               setChannelFunction,
                               userFunction,
                               setUserFunction,
                               message,
                               setMessage,
                               triggerApp
                           }) => {

    const [actions, setActions] = useState([]);
    const [selectedTrigger, setSelectedTrigger] = useState(null);

    const actionDetails = {
        actionApp: '',
        "Discord": {
            actionType: '',
            actionUrl: '',
            actionServerId: '',
            actionChannelId: '',
            actionUserId: '',
            actionMessage: ''
        },
    }

    const getDiscordActionUrl = (actionName) => {
        for (let i = 0; i < dropDownDiscordActions.length; i++) {
            if (dropDownDiscordActions[i].label === actionName) {
                return dropDownDiscordActions[i].url;
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
        if (actions.length > 0 || AccessToken === null) {
            return;
        }
        getActionsServices(AccessToken).then((res) => {
            setActions(res);
            if (connectedToDiscord) {
                const dropdownDiscordActions = [];
                for (let i = 0; i < res["Discord"].length; i++) {
                    dropdownDiscordActions.push({ label: res["Discord"][i].name, url: res["Discord"][i].url });
                }
                setDropDownDiscordActions(dropdownDiscordActions);
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
        actionDetails.actionApp = triggerApp;
        if (triggerApp === 'Discord') {
            if (triggerFunction !== '') {
                actionDetails["Discord"].actionUrl = getDiscordActionUrl(triggerFunction);
            }
            if (serverFunction !== '') {
                actionDetails["Discord"].actionServerId = getDiscordServerId(serverFunction);
            }
            if (channelFunction !== '') {
                actionDetails["Discord"].actionChannelId = getDiscordChannelId(channelFunction);
                actionDetails["Discord"].actionType = 'channel';
            }
            if (userFunction !== '') {
                actionDetails["Discord"].actionUserId = getDiscordUserId(userFunction);
                actionDetails["Discord"].actionType = 'user';
            }
            if (message !== '') {
                actionDetails["Discord"].actionMessage = message;
            }
            setActionDetails(actionDetails);
        }
    }, [triggerApp, triggerFunction, serverFunction, channelFunction, userFunction, message]);

    return (
        <View style={styles.container}>
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
                        {dropDownDiscordActions.length > 0 && (
                            <CustomInputDropDown
                                inputValue={triggerFunction}
                                setInputValue={setTriggerFunction}
                                placeholder="Select Trigger"
                                dropdownOptions={dropDownDiscordActions}
                                inputSize={{ width: 310, height: 60 }}
                            />
                        )}
                    </View>
                    {triggerFunction === 'Contains Text on Channel' && (
                        <View style={styles.channelContainer}>
                            <Text>Select Server:</Text>
                            <CustomInputDropDown
                                inputValue={serverFunction}
                                setInputValue={setServerFunction}
                                placeholder="Select Server"
                                dropdownOptions={dropDownServers}
                                inputSize={{ width: 310, height: 60 }}
                            />
                            {serverFunction && (
                                <View>
                                    <Text>Select Channel:</Text>
                                    <CustomInputDropDown
                                        inputValue={channelFunction}
                                        setInputValue={setChannelFunction}
                                        placeholder="Select Channel"
                                        dropdownOptions={dropDownChannels}
                                        inputSize={{ width: 310, height: 60 }}
                                    />
                                </View>
                            )}
                            {channelFunction && (
                                <View>
                                    <Text>Enter Message:</Text>
                                    <CustomInput
                                        inputValue={message}
                                        setInputValue={setMessage}
                                        placeholder="Message"
                                        placeholderColor="grey"
                                        inputSize={{ width: 310, height: 60 }}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                    {triggerFunction === 'Contains Text on DM' && (
                        <View style={styles.channelDropdownContainer}>
                            <Text>Select Server:</Text>
                            <CustomInputDropDown
                                inputValue={serverFunction}
                                setInputValue={setServerFunction}
                                placeholder="Select Server"
                                dropdownOptions={dropDownServers}
                                inputSize={{ width: 310, height: 60 }}
                            />
                            {serverFunction && (
                                <View>
                                    <Text>Select User:</Text>
                                    <CustomInputDropDown
                                        inputValue={userFunction}
                                        setInputValue={setUserFunction}
                                        placeholder="Select User"
                                        dropdownOptions={dropDownUsers}
                                        inputSize={{ width: 310, height: 60 }}
                                    />
                                </View>
                            )}
                            {userFunction && (
                                <View>
                                    <Text>Enter Message:</Text>
                                    <CustomInput
                                        inputValue={message}
                                        setInputValue={setMessage}
                                        placeholder="Message"
                                        placeholderColor="grey"
                                        inputSize={{ width: '50%', height: 60 }}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}



const styles = StyleSheet.create({
    actionDropdownContainer: {
        zIndex: 3,
        width: '100%',
        marginBottom: 20,
    },
    channelDropdownContainer: {
        zIndex: 1,
        width: '100%',
        marginBottom: 20,
    },
    githubContainer: {
        zIndex:20,
        width: '100%',
        marginBottom: 20,
    },
    githubDropdownContainer: {
        zIndex: 20,
        width: '100%',
        marginBottom: 20,
    },
    discordDropdownContainer: {
        zIndex: 5,
        width: 350,
        marginBottom: 20,
    },
    connectButtonContainer: {
        marginBottom: 20,
    },
});

export default DiscordComponents;
