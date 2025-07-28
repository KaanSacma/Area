import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import CustomInputDropDown from "../CustomInputDropDown";
import CustomInput from "../CustomInput";
import { getActionsServices } from "../../js/services";

const TMDBComponents = ({
                            AccessToken,
                            setActionDetails,
                            triggerApp,
                            dropDownMovieActions,
                            triggerFunction,
                            setTriggerFunction,
                            MovieNameFunction,
                            setMovieNameFunction,
                            setDropDownMovieActions
                        }) => {

    const [actions, setActions] = useState([]);

    const actionDetails = {
        actionApp: '',
        "TMDB": {
            actionType: '',
            actionUrl: '',
            MovieName: '',
        }
    }

    const getMovieActionUrl = (actionName) => {
        for (let i = 0; i < dropDownMovieActions.length; i++) {
            if (dropDownMovieActions[i].label === actionName) {
                return dropDownMovieActions[i].url;
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
            const dropdownMovieActions = [];
            for (let i = 0; i < res["TMDB"].length; i++) {
                dropdownMovieActions.push({ label: res["TMDB"][i].name, url: res["TMDB"][i].url });
            }
            setDropDownMovieActions(dropdownMovieActions);
        }).catch((err) => {
            console.log(err);
        });
    }, [AccessToken]);

    useEffect(() => {
        actionDetails.actionApp = triggerApp;
        if (triggerApp === 'TMDB') {
            if (triggerFunction !== '') {
                actionDetails["TMDB"].actionUrl = getMovieActionUrl(triggerFunction);
            }
            if (MovieNameFunction !== '') {
                actionDetails["TMDB"].MovieName = MovieNameFunction;
                actionDetails["TMDB"].actionType = 'MovieName';
            }
            setActionDetails(actionDetails);
        }
    }, [triggerApp, triggerFunction, MovieNameFunction]);

    return (
        <View>
            <View style={styles.githubContainer}>
                {dropDownMovieActions.length > 0 && (
                    <CustomInputDropDown
                        inputValue={triggerFunction}
                        setInputValue={setTriggerFunction}
                        placeholder="Select Trigger"
                        dropdownOptions={dropDownMovieActions}
                        inputSize={{ width: 310, height: 60 }}
                    />
                )}
            </View>
            {triggerFunction === 'On Theater' && (
                <View style={styles.channelContainer}>
                    <Text>Type Movie Name:</Text>
                    <CustomInput
                        inputValue={MovieNameFunction}
                        setInputValue={setMovieNameFunction}
                        placeholder="Movie Name"
                        size={{ width: 310, height: 60 }}
                    />
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

export default TMDBComponents;
