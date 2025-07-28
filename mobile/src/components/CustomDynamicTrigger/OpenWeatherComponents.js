import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import CustomInputDropDown from "../CustomInputDropDown";
import CustomInput from "../CustomInput";
import {getActionsServices} from "../../js/services";

const OpenWeatherComponents = ({
                                   AccessToken,
                                   setActionDetails,
                                   triggerApp,
                                   dropDownWeatherActions,
                                   triggerFunction,
                                   setTriggerFunction,
                                   placeFunction,
                                   setPlaceFunction,
                                   daysFunction,
                                   setDaysFunction,
                                   tempFunction,
                                   setTempFunction,
                                   dropDownCondition,
                                   setDropDownCondition,
                                   conditionFunction,
                                   setConditionFunction,
                                   setDropDownWeatherActions
                               }) => {

    const [actions, setActions] = useState([]);
    const [selectedTrigger, setSelectedTrigger] = useState(null);

    const actionDetails = {
        actionApp: '',
        "OpenWeather": {
            actionType: '',
            actionUrl: '',
            days: '',
            place: '',
            temp: '',
            condition: '',
        }
    }

    const getWeatherActionUrl = (actionName) => {
        for (let i = 0; i < dropDownWeatherActions.length; i++) {
            if (dropDownWeatherActions[i].label === actionName) {
                return dropDownWeatherActions[i].url;
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
            const dropdownWeatherActions = [];
            for (let i = 0; i < res["OpenWeather"].length; i++) {
                dropdownWeatherActions.push({label: res["OpenWeather"][i].name, url: res["OpenWeather"][i].url});
            }
            setDropDownWeatherActions(dropdownWeatherActions);
        }).catch((err) => {
            console.log(err);
        });
    }, [AccessToken]);

    useEffect(() => {
        if (actions.length > 0 || AccessToken === null) {
            return;
        }
        setDropDownCondition([{label:'Sunny'}, {label: 'Cloudy'}, {label:'Rainy'}]);
    }, [AccessToken]);

    useEffect(() => {
        actionDetails.actionApp = triggerApp;
        if (triggerApp === 'Open Weather') {
            if (triggerFunction !== '') {
                actionDetails["OpenWeather"].actionUrl = getWeatherActionUrl(triggerFunction);
            }
            if (placeFunction !== '') {
                actionDetails["OpenWeather"].place = placeFunction;
                actionDetails["OpenWeather"].actionType = 'place';
            }
            if (daysFunction !== '') {
                actionDetails["OpenWeather"].days = daysFunction;
                actionDetails["OpenWeather"].actionType = 'days';
            }
            if (tempFunction !== '') {
                actionDetails["OpenWeather"].temp = tempFunction;
                actionDetails["OpenWeather"].actionType = 'temp';
            }
            if (conditionFunction !== '') {
                actionDetails["OpenWeather"].condition = conditionFunction;
                actionDetails["OpenWeather"].actionType = 'condition';
            }
            setActionDetails(actionDetails);
        }
    }, [triggerApp, triggerFunction, placeFunction, daysFunction, conditionFunction, tempFunction]);


    return (
        <View>
            <View style={styles.githubContainer}>
                <Text>Select Trigger:</Text>
                {dropDownWeatherActions.length > 0 && (
                    <CustomInputDropDown
                        inputValue={triggerFunction}
                        setInputValue={setTriggerFunction}
                        placeholder="Select Trigger"
                        dropdownOptions={dropDownWeatherActions}
                        inputSize={{ width: 310, height: 60 }}
                    />
                )}
            </View>
            {triggerFunction === 'weather now' && (
                <View style={styles.channelContainer}>
                    <Text>Type Location:</Text>
                    <CustomInput
                        inputValue={placeFunction}
                        setInputValue={setPlaceFunction}
                        placeholder="Location"
                        size={{ width: 310, height: 60 }}
                    />
                </View>
            )}
            {triggerFunction === 'Forecast for days' && (
                <View style={styles.channelContainer}>
                    <Text>Type Location:</Text>
                    <CustomInput
                        inputValue={placeFunction}
                        setInputValue={setPlaceFunction}
                        placeholder="Location"
                        size={{ width: 310, height: 60 }}
                    />
                    {placeFunction && (
                        <View>
                            <Text>Select Number of Days:</Text>
                            <CustomInput
                                inputValue={daysFunction}
                                setInputValue={setDaysFunction}
                                placeholder="Number of Days"
                                size={{ width: 310, height: 60 }}
                            />
                        </View>
                    )}
                </View>
            )}
            {triggerFunction === 'is Temperature close' && (
                <View style={styles.channelContainer}>
                    <Text>Type Location:</Text>
                    <CustomInput
                        inputValue={placeFunction}
                        setInputValue={setPlaceFunction}
                        placeholder="Location"
                        size={{ width: 310, height: 60 }}
                    />
                    {placeFunction && (
                        <View>
                            <Text>Type Temperature:</Text>
                            <CustomInput
                                inputValue={daysFunction}
                                setInputValue={setDaysFunction}
                                placeholder="Temperature"
                                size={{ width: 120, height: 60 }}
                            />
                        </View>
                    )}
                </View>
            )}
            {triggerFunction === 'is Condition close' && (
                <View style={styles.channelContainer}>
                    <Text>Type Location:</Text>
                    <CustomInput
                        inputValue={placeFunction}
                        setInputValue={setPlaceFunction}
                        placeholder="Location"
                        size={{ width: 350, height: 60 }}
                    />
                    {placeFunction && (
                        <View>
                            <Text>Select Condition:</Text>
                            <CustomInputDropDown
                                inputValue={conditionFunction}
                                setInputValue={setConditionFunction}
                                placeholder="Condition"
                                dropdownOptions={dropDownCondition}
                                inputSize={{ width: 310, height: 60 }}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = {
    githubContainer: {
        zIndex: 20,
        width: '100%',
        marginBottom: 20,
    },
    channelContainer: {
        marginBottom: 20,
    },
};

export default OpenWeatherComponents;
