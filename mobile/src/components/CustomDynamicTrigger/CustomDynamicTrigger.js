import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import CustomInputDropDown from "../CustomInputDropDown";
import CustomInput from "../CustomInput";
import { signInWithDiscord } from "../../js/configDiscordOauth";
import {getActionsServices} from "../../js/services";
import {getServerList, getChannelList, getUsersList} from "../../js/discord";
import DiscordComponents from "./DiscordComponents";
import OpenWeatherComponents from "./OpenWeatherComponents";
import TMDBComponent from "./TMDBComponent";

const DynamicTriggerComponent = ({ triggerApp, AccessToken, setActionDetails }) => {
    const [selectedTrigger, setSelectedTrigger] = useState(null);
    const [triggerFunction, setTriggerFunction] = useState('');
    const [connectedToDiscord, setConnectedToDiscord] = useState(false);
    const [channelFunction, setChannelFunction] = useState('');
    const [serverFunction, setServerFunction] = useState('');
    const [userFunction, setUserFunction] = useState('');
    const [message, setMessage] = useState('');
    const [actions, setActions] = useState([]);
    const [dropDownDiscordActions, setDropDownDiscordActions] = useState([]);
    const [dropDownServers, setDropDownServers] = useState([]);
    const [dropDownChannels, setDropDownChannels] = useState([]);
    const [dropDownUsers, setDropDownUsers] = useState([]);
    const [dropDownWeatherActions, setDropDownWeatherActions] = useState([]);
    const [dropDownCondition, setDropDownCondition] = useState([]);
    const [daysFunction, setDaysFunction] = useState('');
    const [tempFunction, setTempFunction] = useState('');
    const [conditionFunction, setConditionFunction] = useState('');
    const [placeFunction, setPlaceFunction] = useState('');
    const [MovieNameFunction, setMovieNameFunction] = useState('');
    const [dropDownMovieActions, setDropDownMovieActions] = useState([]);
    const [dropDownTimeActions, setDropDownTimeActions] = useState([]);
    const [dropDownNewsActions, setDropDownNewsActions] = useState([]);
    const [dropDownJokeActions, setDropDownJokeActions] = useState([]);

    const actionDetails = {
        actionApp: '',
        "Time": {
            actionType: '',
            actionUrl: '',
        },
        "News": {
            actionType: '',
            actionUrl: '',
        },
        "Joke": {
            actionType: '',
            actionUrl: '',
        },
    }

    const getTimeActionUrl = () => {
        for (let i = 0; i < dropDownTimeActions.length; i++) {
            if (dropDownTimeActions[i].label === triggerFunction) {
                return dropDownTimeActions[i].url;
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
            const dropdownTimeActions = [];
            for (let i = 0; i < res["Time"].length; i++) {
                dropdownTimeActions.push({label: res["Time"][i].name, url: res["Time"][i].url});
            }
            setDropDownTimeActions(dropdownTimeActions);
        }).catch((err) => {
            console.log(err);
        });
    }, [AccessToken]);

    useEffect(() => {
        actionDetails.actionApp = triggerApp;
        if (triggerApp === 'Time') {
            if (triggerFunction !== '') {
                actionDetails["Time"].actionUrl = getTimeActionUrl();
            }
            setActionDetails(actionDetails);
        }
    }, [setActionDetails, triggerApp, triggerFunction]);

    const getNewsActionUrl = () => {
        for (let i = 0; i < dropDownNewsActions.length; i++) {
            if (dropDownNewsActions[i].label === triggerFunction) {
                return dropDownNewsActions[i].url;
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
            const dropdownNewsActions = [];
            for (let i = 0; i < res["News"].length; i++) {
                dropdownNewsActions.push({label: res["News"][i].name, url: res["News"][i].url});
            }
            setDropDownNewsActions(dropdownNewsActions);
        }).catch((err) => {
            console.log(err);
        });
    }, [AccessToken]);

    useEffect(() => {
        actionDetails.actionApp = triggerApp;
        if (triggerApp === 'News') {
            if (triggerFunction !== '') {
                actionDetails["News"].actionUrl = getNewsActionUrl();
            }
            setActionDetails(actionDetails);
        }
    }, [setActionDetails, triggerApp, triggerFunction]);

    const getJokeActionUrl = () => {
        for (let i = 0; i < dropDownJokeActions.length; i++) {
            if (dropDownJokeActions[i].label === triggerFunction) {
                return dropDownJokeActions[i].url;
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
            const dropdownJokeActions = [];
            for (let i = 0; i < res["Joke"].length; i++) {
                dropdownJokeActions.push({label: res["Joke"][i].name, url: res["Joke"][i].url});
            }
            setDropDownJokeActions(dropdownJokeActions);
        }).catch((err) => {
            console.log(err);
        });
    }, [AccessToken]);

    useEffect(() => {
        actionDetails.actionApp = triggerApp;
        if (triggerApp === 'Joke') {
            if (triggerFunction !== '') {
                actionDetails["Joke"].actionUrl = getJokeActionUrl();
            }
            setActionDetails(actionDetails);
        }
    }, [setActionDetails, triggerApp, triggerFunction]);

    if (triggerApp === 'Discord') {
        return (
            <View style={styles.githubContainer}>
                <DiscordComponents
                    AccessToken={AccessToken}
                    setActionDetails={setActionDetails}
                    triggerFunction={triggerFunction}
                    setTriggerFunction={setTriggerFunction}
                    connectedToDiscord={connectedToDiscord}
                    setConnectedToDiscord={setConnectedToDiscord}
                    dropDownDiscordActions={dropDownDiscordActions}
                    setDropDownDiscordActions={setDropDownDiscordActions}
                    dropDownServers={dropDownServers}
                    setDropDownServers={setDropDownServers}
                    dropDownChannels={dropDownChannels}
                    setDropDownChannels={setDropDownChannels}
                    dropDownUsers={dropDownUsers}
                    setDropDownUsers={setDropDownUsers}
                    serverFunction={serverFunction}
                    setServerFunction={setServerFunction}
                    channelFunction={channelFunction}
                    setChannelFunction={setChannelFunction}
                    userFunction={userFunction}
                    setUserFunction={setUserFunction}
                    message={message}
                    setMessage={setMessage}
                    triggerApp={triggerApp}
                />
            </View>
        );
    } else if (triggerApp === 'Open Weather') {
        return (
            <View style={styles.githubContainer}>
                <OpenWeatherComponents
                    // Pass the required props for OpenWeatherComponents
                    AccessToken={AccessToken}
                    setActionDetails={setActionDetails}
                    triggerApp={triggerApp}
                    dropDownWeatherActions={dropDownWeatherActions}
                    setDropDownWeatherActions={setDropDownWeatherActions}
                    triggerFunction={triggerFunction}
                    setTriggerFunction={setTriggerFunction}
                    placeFunction={placeFunction}
                    setPlaceFunction={setPlaceFunction}
                    daysFunction={daysFunction}
                    setDaysFunction={setDaysFunction}
                    dropDownCondition={dropDownCondition}
                    setDropDownCondition={setDropDownCondition}
                    tempFunction={tempFunction}
                    setTempFunction={setTempFunction}
                    conditionFunction={conditionFunction}
                    setConditionFunction={setConditionFunction}
                />
            </View>
        );
    } else if (triggerApp === 'TMDB') {
        return (
            <View style={styles.githubContainer}>
                <TMDBComponent
                    AccessToken={AccessToken}
                    setActionDetails={setActionDetails}
                    triggerApp={triggerApp}
                    dropDownMovieActions={dropDownMovieActions}
                    setDropDownMovieActions={setDropDownMovieActions}
                    triggerFunction={triggerFunction}
                    setTriggerFunction={setTriggerFunction}
                    MovieNameFunction={MovieNameFunction}
                    setMovieNameFunction={setMovieNameFunction}
                />
            </View>
        );
    } else if (triggerApp === 'Time') {
        return (
            <View style={styles.githubContainer}>
                <CustomInputDropDown
                    inputValue={triggerFunction}
                    setInputValue={setTriggerFunction}
                    placeholder="Select Trigger"
                    dropdownOptions={dropDownTimeActions}
                    inputSize={{ width: 310, height: 60 }}
                />
            </View>
        );
    } else if (triggerApp === 'News') {
        return (
            <View style={styles.githubContainer}>
                <CustomInputDropDown
                    inputValue={triggerFunction}
                    setInputValue={setTriggerFunction}
                    placeholder="Select Trigger"
                    dropdownOptions={dropDownNewsActions}
                    inputSize={{ width: 310, height: 60 }}
                />
            </View>
        );
    } else if (triggerApp === 'Joke') {
        return (
            <View style={styles.githubContainer}>
                <CustomInputDropDown
                    inputValue={triggerFunction}
                    setInputValue={setTriggerFunction}
                    placeholder="Select Trigger"
                    dropdownOptions={dropDownJokeActions}
                    inputSize={{ width: 310, height: 60 }}
                />
            </View>
        );
    }
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

export default DynamicTriggerComponent;
