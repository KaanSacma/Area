import React, {useContext, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, ScrollView } from 'react-native';
import CustomOpacityButton from "../../components/CustomOpacityButton";
import CustomNavigationBar from "../../components/CustomNavigationBar";
import CustomInputDropDown from "../../components/CustomInputDropDown";
import DynamicTriggerComponent from "../../components/CustomDynamicTrigger/CustomDynamicTrigger";
import DynamicActionComponent from "../../components/CustomDynamicAction/CustomDynamicAction";
import ZapListContext from '../../components/ZaptListContext/ZaptListContext';
import {getListServices, getImagesServices, toBase64} from "../../js/services";
import { YellowBox } from 'react-native';
import { LogBox } from 'react-native';
import axios from "axios";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import navigationContainer from "@react-navigation/native/src/NavigationContainer";
import {act} from "react-test-renderer";


LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.'
]);
// Your other code here...

const SearchAREAScreen = ({ navigation, AccessToken }) => {
    const [triggerApp, setTriggerApp] = useState('');
    const [actionApp, setActionApp] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const {zapList, setZapList } = useContext(ZapListContext);
    const [zapListFront, setZapListFront] = useState([]);
    const [DisplayZaps, setDisplayZaps] = useState(null);
    const [zapListChanged, setZapListChanged] = useState(false);
    const [actionDetails, setActionDetails] = useState([]);
    const [reactionDetails, setReactionDetails] = useState([]);
    const [selectedTrigger, setSelectedTrigger] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);

    const handleSetZap = async () => {
        if (triggerApp !== '' && actionApp !== '') {
            let body = {};
            if (actionDetails.actionApp === 'Discord') {
                body["action_name"] = "Discord";
                if (actionDetails["Discord"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["Discord"].actionUrl;
                if (actionDetails["Discord"].actionType === "channel") {
                    if (actionDetails["Discord"].actionServerId === '' || actionDetails["Discord"].actionChannelId === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Discord"].actionServerId, "REPLACE1" : actionDetails["Discord"].actionChannelId };
                } else if (actionDetails["Discord"].actionType === "user") {
                    if (actionDetails["Discord"].actionUserId === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Discord"].actionUserId };
                }
                body["details"] = { "text" : actionDetails["Discord"].actionMessage };
            } else if (actionDetails.actionApp === 'Open Weather') {
                body["action_name"] = "Open Weather";
                if (actionDetails["OpenWeather"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["OpenWeather"].actionUrl;
                if (actionDetails["OpenWeather"].actionType === "place") {
                    if (actionDetails["OpenWeather"].place === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["OpenWeather"].place };
                }
                if (actionDetails["OpenWeather"].actionType === "days") {
                    if (actionDetails["OpenWeather"].days === '' ||
                        actionDetails["OpenWeather"].place === '' ||
                        isNaN(actionDetails["OpenWeather"].days) ||
                        actionDetails["OpenWeather"].days < 1 ||
                        actionDetails["OpenWeather"].days > 7) {
                        return;
                    }
                    body["action_url_params"] = {
                        "REPLACE0" : actionDetails["OpenWeather"].place,
                        "REPLACE1" : actionDetails["OpenWeather"].days
                    };
                }
                if (actionDetails["OpenWeather"].actionType === "temp") {
                    if (actionDetails["OpenWeather"].temp === '' || actionDetails["OpenWeather"].place === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["OpenWeather"].place };
                    body["action_url_params"] = { "REPLACE1" : actionDetails["OpenWeather"].temp };
                }
                if (actionDetails["OpenWeather"].actionType === "condition") {
                    if (actionDetails["OpenWeather"].condition === '' || actionDetails["OpenWeather"].place === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["OpenWeather"].place };
                    body["action_url_params"] = { "REPLACE1" : actionDetails["OpenWeather"].condition };
                }
            } else if (actionDetails.actionApp === 'TMDB') {
                body["action_name"] = "TMDB";
                if (actionDetails["TMDB"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["TMDB"].actionUrl;
                if (actionDetails["TMDB"].actionType === "MovieName") {
                    if (actionDetails["TMDB"].MovieName === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["TMDB"].MovieName };
                }
            } else if (actionDetails.actionApp === 'Time') {
                body["action_name"] = "Time";
                if (actionDetails["Time"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["Time"].actionUrl;
            } else if (actionDetails.actionApp === 'News') {
                body["action_name"] = "News";
                if (actionDetails["News"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["News"].actionUrl;
            } else if (actionDetails.actionApp === 'Joke') {
                body["action_name"] = "Joke";
                if (actionDetails["Joke"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["Joke"].actionUrl;
            } else {
                return;
            }

            if (reactionDetails.reactionApp === 'Discord') {
                body["reaction_name"] = "Discord";
                if (reactionDetails["Discord"].reactionUrl === '')
                    return;
                body["reaction_url"] = reactionDetails["Discord"].reactionUrl;
                if (reactionDetails["Discord"].reactionType === "channel") {
                    if (reactionDetails["Discord"].reactionServerId === '' || reactionDetails["Discord"].reactionChannelId === '')
                        return;
                    body["reaction_url_params"] = { "REPLACE0" : reactionDetails["Discord"].reactionServerId, "REPLACE1" : reactionDetails["Discord"].reactionChannelId };
                } else if (reactionDetails["Discord"].reactionType === "user") {
                    if (reactionDetails["Discord"].reactionUserId === '')
                        return;
                    body["reaction_url_params"] = { "REPLACE0" : reactionDetails["Discord"].reactionUserId };
                }
            } else if (reactionDetails.reactionApp === "Gmail"){
                body["reaction_name"] = "Gmail";
                if (reactionDetails["Gmail"].reactionUrl === '')
                    return;
                body["reaction_url"] = reactionDetails["Gmail"].reactionUrl;
                if (reactionDetails["Gmail"].Gmail === '' || reactionDetails["Gmail"].GmailSubject === '')
                    return;
                body["reaction_url_params"] = { "REPLACE0" : reactionDetails["Gmail"].Gmail, "REPLACE1" : reactionDetails["Gmail"].GmailSubject };
            } else {
                return;
            }

            await axios.post(`${process.env.API_URL}/services/create`, body, {
                headers: {
                    Authorization: `Bearer ${AccessToken}`,
                }
            });
            setZapList({
                ...zapList,
                [triggerApp]: actionApp,
            });
            setTriggerApp('');
            setActionApp('');
            setActionDetails([]);
            setReactionDetails([]);
        }
    };

    const openProfileSection = () => {
        setProfileOpen(true);
    };

    const closeProfileSection = () => {
        setProfileOpen(false);
    };
    const [dropdownOptions, setDropdownOptions] = useState([]);

    const data = [
        { type: 'input1' },
        { type: 'DynamicTrigger', triggerApp},
        { type: 'input2' },
        { type: 'DynamicAction', actionApp},
        { type: 'setZapButton' },
        { type: 'zapList' },
    ];

    const handleTriggerChange = (value) => {
        setSelectedTrigger(value);
        if (value === 'Discord') {
            handleActionDiscord();
        }
    };

    const handleActionChange = (value) => {
        setSelectedAction(value);
        if (value === 'Discord') {
            handleActionDiscord();
        }
    };

    const handleActionDiscord = () => {
        console.log('Discord Action Selected');
    };

    useEffect(() => {
        if (dropdownOptions.length > 0 || AccessToken === null) {
            return
        }
        getListServices(AccessToken).then((responseList) => {
            getImagesServices(AccessToken).then((responseImages) => {
                const options = [];
                for (let i = 0; i < responseList.length; i++) {
                    const image = toBase64(responseImages[i].data);
                    options.push({
                        label: responseList[i],
                        image: `data:image/png;base64,${image}`,
                    });
                }
                setDropdownOptions(options);
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }, [AccessToken]);

    return (
        <View style={styles.Maincontainer}>
            {profileOpen && (
                <View style={styles.profileSection}>
                    <Text style={styles.profileText}>Profile Content</Text>
                    <CustomOpacityButton
                        onPress={closeProfileSection}
                        title={'Close Profile'}
                        backColor={'grey'}
                        titleColor={'white'}
                        buttonSize={{ width: '95%', height: 50 }}
                        roundSize={25}
                        sourceSize={{ width: 30, height: 30 }}
                        sourceLeft={10}
                    />
                    <View style={styles.logOutButtonContainer}>
                        <CustomOpacityButton title={'Logout'} onPress={() => navigation.navigate('Login')} backColor={'red'} titleColor={'white'} buttonSize={{ width: '95%', height: 50 }} roundSize={25} />
                    </View>
                </View>
            )}

            <View style={styles.profileButtonContainer}>
                {!profileOpen ? (
                    <CustomOpacityButton
                        onPress={openProfileSection}
                        title={'P'}
                        backColor={'black'}
                        titleColor={'white'}
                        buttonSize={{ width: '50%', height: 50 }}
                        roundSize={25}
                        sourceSize={{ width: 30, height: 30 }}
                        sourceLeft={10}
                    />
                ) : null}
            </View>
            <View style={styles.container}>
                <ScrollView prop nestedScrollEnabled={true}>
                    {dropdownOptions.length > 0 ?
                        <FlatList
                            contentContainerStyle={styles.yourFlatListStyle}
                            data={data}
                            renderItem={({ item }) => {
                                switch (item.type) {
                                    case 'input1':
                                        return (
                                            <View style={styles.inputContainer1}>
                                                <CustomInputDropDown
                                                    inputValue={triggerApp}
                                                    setInputValue={setTriggerApp}
                                                    onInputChange={handleTriggerChange}
                                                    placeholder="Enter Trigger App"
                                                    dropdownOptions={dropdownOptions}
                                                    inputSize={{ width: 310, height: 60 }}
                                                />
                                            </View>
                                        );
                                    case 'DynamicTrigger':
                                        return (
                                            <View style={styles.zapsContainer}>
                                                <DynamicTriggerComponent setActionDetails={setActionDetails} AccessToken={AccessToken} triggerApp={item.triggerApp}/>
                                            </View>
                                        );
                                    case 'input2':
                                        return (
                                            <View style={styles.inputContainer2}>
                                                <CustomInputDropDown
                                                    inputValue={actionApp}
                                                    setInputValue={setActionApp}
                                                    onInputChange={handleActionChange}
                                                    placeholder="Enter Action App"
                                                    dropdownOptions={dropdownOptions}
                                                    inputSize={{ width: 310, height: 60 }}
                                                />
                                            </View>
                                        );
                                    case 'DynamicAction':
                                        return (
                                            <DynamicActionComponent setReactionDetails={setReactionDetails} AccessToken={AccessToken} actionApp={item.actionApp} />
                                        );
                                    case 'setZapButton':
                                        return (
                                            <View style={styles.setZapButton}>
                                            <CustomOpacityButton
                                                onPress={handleSetZap}
                                                title={'Set Zap'}
                                                backColor={'black'}
                                                titleColor={'white'}
                                                buttonSize={{ width: '95%', height: 50 }}
                                                roundSize={25}
                                                sourceSize={{ width: 30, height: 30 }}
                                                sourceLeft={10}
                                            />
                                            </View>
                                        );
                                    default:
                                        return null;
                                }
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            nestedScrollEnabled={true} // Enable scrolling
                        />
                        :
                        <Text>Loading...</Text>
                    }
                </ScrollView>
            </View>

            <View style={styles.NavigationBarContainer}>
                <CustomNavigationBar />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 600,
        maxHeight: 600,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red',
    },
    yourFlatListStyle: {
        flex: 1,
        justifyContent: 'space-between', // Evenly space items vertically
    },
    inputContainer1: {
        marginBottom: 10, // Add margin between items if needed
    },
    zapsContainer: {
        marginBottom: 10, // Add margin between items if needed
    },
    inputContainer2: {
        marginBottom: 10, // Add margin between items if needed
    },
    setZapButton: {
        marginBottom: 10, // Add margin between items if needed
    },
    scrollContainer2: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollcontainer: {
        backgroundColor: 'purple',
    },
    Maincontainer: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    profileSection: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        padding: 10,
        width: 300,
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 10,
    },
    profileButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 5,
        zIndex: 10,
    },
    logOutButtonContainer: {
        position: 'absolute',
        bottom: 10,
        left: '25%',
    },
    zapListContainer: {
        position: 'sticky',
        top: 50,
        height: 200,
        width: '100%',
        backgroundColor: 'purple',
    },
    scrollContainer: {
        flex: 1,
    },
    NavigationBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        width: 420,
        borderTopWidth: 1.5,
        borderTopColor: 'grey',
    },
    zapRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    zapIsSet: {
        fontSize: 18,
        textAlign: 'center',
        color: 'green',
    },
    profileText: {
        color: 'white',
        fontSize: 16,
    },
    profileButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    closeProfileButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SearchAREAScreen;
