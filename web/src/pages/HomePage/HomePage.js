import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import {addDiscordInfo} from "../../js/discords";
import {getListServices, getImagesServices, getReactionsServices, getActionsServices, toBase64} from "../../js/services";
import {styles} from './css';
import {TriggerInput, ActionInput} from '../../js/triggerActionInput';
import DiscordActions from "../../Component/discordActions";
import axios from "axios";
import DiscordReactions from "../../Component/discordReaction";
import TimeAPIAction from "../../Component/timeAPIAction";
import WeatherAPIAction from "../../Component/weatherAPIAction";
import TMDBAPIAction from "../../Component/tmdbAPIAction";
import GmailAPIReaction from "../../Component/gmailAPIReaction";
import GoogleCalendarAPIAction from "../../Component/googleCalendarAPIAction";
import CryptoAPIAction from "../../Component/cryptoAPIAction";
import Zap from "../../Component/zap";
import NewsAPIAction from "../../Component/newsAPIAction";
import JokeAPIAction from "../../Component/jokeAPIAction";


const HomePage =  ({accessToken, setAccessToken, setLogged}) => {
    const navigate = useNavigate();
    const [triggerApp, setTriggerApp] = useState(localStorage.getItem('triggerApp') || '');
    const [actionApp, setActionApp] = useState(localStorage.getItem('actionApp') || '');
    const [zapList, setZapList] = useState({});
    const [zapListChanged, setZapListChanged] = useState(false);
    const [actions, setActions] = useState([]);
    const [reactions, setReactions] = useState([]);
    const [imageServices, setImageServices] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showActionSuggestions, setShowActionSuggestions] = useState(false);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [showDiscordLogin, setShowDiscordLogin] = useState(JSON.parse(localStorage.getItem('showDiscordLogin')) || false);
    const [discordReactionSelected, setDiscordReactionSelected] = useState(JSON.parse(localStorage.getItem('discordReactionSelected')) || false);
    const [showDiscordLoginAction, setShowDiscordLoginAction] = useState(JSON.parse(localStorage.getItem('showDiscordLoginAction')) || false);
    const [discordActionSelected, setDiscordActionSelected] = useState(JSON.parse(localStorage.getItem('discordActionSelected')) || false);
    const [actionContainer, setActionContainer] = useState(false);
    const [reactionContainer, setReactionContainer] = useState(false);

    const [actionDetails, setActionDetails] = useState(JSON.parse(localStorage.getItem('actionDetails')) || {});
    const [reactionDetails, setReactionDetails] = useState(JSON.parse(localStorage.getItem('reactionDetails')) || {});

    //Time API
    const [timeAction, setTimeAction] = useState(JSON.parse(localStorage.getItem('timeAction')) || false);

    //Weather API
    const [weatherAction, setWeatherAction] = useState(JSON.parse(localStorage.getItem('weatherAction')) || false);

    //TMDB API
    const [tmdbAction, setTmdbAction] = useState(JSON.parse(localStorage.getItem('tmdbAction')) || false);

    //Gmail API
    const [gmailReaction, setGmailReaction] = useState(JSON.parse(localStorage.getItem('gmailReaction')) || false);

    //Google Calendar API
    const [googleCalendarAction, setGoogleCalendarAction] = useState(JSON.parse(localStorage.getItem('googleCalendarAction')) || false);

    //Crypto API
    const [cryptoAction, setCryptoAction] = useState(JSON.parse(localStorage.getItem('cryptoAction')) || false);

    //News API
    const [newsAction, setNewsAction] = useState(JSON.parse(localStorage.getItem('newsAction')) || false);

    const [jokeAction, setJokeAction] = useState(JSON.parse(localStorage.getItem('jokeAction')) || false);

    const [discordStyle, setDiscordStyle] = useState({});

    const handleTriggerAppChange = (event) => {
        const {value} = event.target;
        setTriggerApp(value);
        setShowSuggestions(value !== '');
    };

    const handleActionAppChange = (event) => {
        const {value} = event.target;
        setActionApp(value);
        setShowActionSuggestions(value !== '');
    };

    const handleSuggestionsClick = (suggestion) => {
        setTriggerApp(suggestion);
        setShowSuggestions(false);
    }

    const handleActionClick = (suggestion) => {
        setActionApp(suggestion);
        setShowActionSuggestions(false);
    }

    useEffect(() => {
        const storedZaps = JSON.parse(localStorage.getItem('zapList')) || {};
        setZapList(storedZaps);
    }, []);

    const handleSetZap = async () => {
        if (triggerApp !== '' && actionApp !== '') {
            if (actionDetails === {} || reactionDetails === {}) {
                return;
            }
            let body = {};
            if (actionDetails.actionApp === "Discord") {
                body["action_name"] = "Discord";
                if (actionDetails["Discord"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["Discord"].actionUrl;
                if (actionDetails["Discord"].actionType === "channel") {
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Discord"].actionServerId, "REPLACE1" : actionDetails["Discord"].actionChannelId };
                } else if (actionDetails["Discord"].actionType === "user") {
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Discord"].actionUserId };
                } else {
                    return;
                }
                if (actionDetails["Discord"].actionMessage === '')
                    return;
                body["details"] = { "text" : actionDetails["Discord"].actionMessage };
            } else if (actionDetails.actionApp === "Open Weather") {
                body["action_name"] = "Open Weather";
                if (actionDetails["Open Weather"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["Open Weather"].actionUrl;
                if (actionDetails["Open Weather"].actionType === "place") {
                    if (actionDetails["Open Weather"].place === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Open Weather"].place };
                } else if (actionDetails["Open Weather"].actionType === "temperature") {
                    if (actionDetails["Open Weather"].place === '' || actionDetails["Open Weather"].temp === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Open Weather"].place, "REPLACE1" : actionDetails["Open Weather"].temp };
                } else if (actionDetails["Open Weather"].actionType === "condition") {
                    if (actionDetails["Open Weather"].place === '' || actionDetails["Open Weather"].condition === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Open Weather"].place, "REPLACE1" : actionDetails["Open Weather"].condition };
                } else if (actionDetails["Open Weather"].actionType === "forecast") {
                    if (actionDetails["Open Weather"].place === '' || actionDetails["Open Weather"].days === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["Open Weather"].place, "REPLACE1" : actionDetails["Open Weather"].days };
                } else {
                    return;
                }
            } else if (actionDetails.actionApp === "TMDB") {
                body["action_name"] = "TMDB";
                if (actionDetails["TMDB"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["TMDB"].actionUrl;
                if (actionDetails["TMDB"].actionType === "onTheater") {
                    if (actionDetails["TMDB"].movieName === '')
                        return;
                    body["action_url_params"] = { "REPLACE0" : actionDetails["TMDB"].movieName };
                } else if (actionDetails["TMDB"].actionType === "none") {
                } else {
                    return;
                }
            } else if (actionDetails.actionApp === "Time") {
                body["action_name"] = "Time";
                if (actionDetails["Time"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["Time"].actionUrl;
                if (actionDetails["Time"].actionType === "hour") {
                    if (actionDetails["Time"].timeZone === '' || actionDetails["Time"].wantedHour === '')
                        return;
                    body["details"] = { "timeZone" : actionDetails["Time"].timeZone, "wantedHour" : actionDetails["Time"].wantedHour };
                } else if (actionDetails["Time"].actionType === "minute") {
                    if (actionDetails["Time"].timeZone === '' || actionDetails["Time"].wantedMinute === '')
                        return;
                    body["details"] = { "timeZone" : actionDetails["Time"].timeZone, "wantedMinute" : actionDetails["Time"].wantedMinute };
                } else if (actionDetails["Time"].actionType === "interval") {
                    if (actionDetails["Time"].timeZone === '' || actionDetails["Time"].wantedInterval === '')
                        return;
                    body["details"] = { "timeZone" : actionDetails["Time"].timeZone, "wantedInterval" : actionDetails["Time"].wantedInterval };
                } else {
                    return;
                }
            } else if (actionDetails.actionApp === "News") {
                body["action_name"] = "News";
                if (actionDetails["News"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["News"].actionUrl;
            } else if (actionDetails.actionApp === "Joke") {
                body["action_name"] = "Joke";
                if (actionDetails["Joke"].actionUrl === '')
                    return;
                body["action_url"] = actionDetails["Joke"].actionUrl;
            } else {
                return;
            }
            if (reactionDetails.reactionApp === "Discord") {
                body["reaction_name"] = "Discord";
                if (reactionDetails["Discord"].reactionUrl === '')
                    return;
                body["reaction_url"] = reactionDetails["Discord"].reactionUrl;
                if (reactionDetails["Discord"].reactionType === "channel") {
                    body["reaction_url_params"] = { "REPLACE0" : reactionDetails["Discord"].reactionServerId, "REPLACE1" : reactionDetails["Discord"].reactionChannelId };
                } else if (reactionDetails["Discord"].reactionType === "user") {
                    body["reaction_url_params"] = { "REPLACE0" : reactionDetails["Discord"].reactionUserId };
                } else {
                    return;
                }
            } else if (reactionDetails.reactionApp === "Gmail") {
                body["reaction_name"] = "Gmail";
                if (reactionDetails["Gmail"].reactionUrl === '')
                    return;
                body["reaction_url"] = reactionDetails["Gmail"].reactionUrl;
                if (reactionDetails["Gmail"].email === '' || reactionDetails["Gmail"].subject === '')
                    return;
                body["reaction_url_params"] = { "REPLACE0" : reactionDetails["Gmail"].email, "REPLACE1" : reactionDetails["Gmail"].subject };
            } else {
                return;
            }
            await axios.post(`${process.env.REACT_APP_API_URL}/services/create`, body, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            setZapListChanged(!zapListChanged);
            setTriggerApp('');
            setActionApp('');
            setActionContainer(false);
            setReactionContainer(false);
        }
    };

    useEffect(() => {
        if (accessToken !== null) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            setAccessToken(localStorage.getItem('accessToken'));
        }
    }, [accessToken, setAccessToken]);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('id') && new URLSearchParams(window.location.search).get('guilds')) {
            try {
                const id = new URLSearchParams(window.location.search).get('id');
                const guildsString = new URLSearchParams(window.location.search).get('guilds');
                const access_token = new URLSearchParams(window.location.search).get('access_token');
                const refresh_token = new URLSearchParams(window.location.search).get('refresh_token');
                const guilds = JSON.parse(guildsString);
                if (accessToken === null) {
                    addDiscordInfo(id, guilds, localStorage.getItem('accessToken'), access_token, refresh_token);
                } else {
                    addDiscordInfo(id, guilds, accessToken, access_token, refresh_token);
                }
                window.open('http://localhost:3000/home', '_self');
            } catch (error) {
                console.error(error);
                window.open('http://localhost:3000/home', '_self');
            }
        }
    }, []);

    useEffect(() => {
        if (accessToken === null) {
            getListServices(localStorage.getItem("accessToken")).then((res) => {
                setSuggestions(res);
                getImagesServices(localStorage.getItem("accessToken")).then((resImg) => {
                    const imageList = [];
                    for (let i = 0; i < resImg.length; i++) {
                        const image = toBase64(resImg[i].data);
                        imageList.push({image : `data:image/png;base64,${image}`, name: res[i]});
                    }
                    setImageServices(imageList);
                });
            });
            getActionsServices(localStorage.getItem("accessToken")).then((res) => setActions(res));
            getReactionsServices(localStorage.getItem("accessToken")).then((res) => setReactions(res));
        } else {
            getListServices(accessToken).then((res) => {
                setSuggestions(res);
                getImagesServices(accessToken).then((resImg) => {
                    const imageList = [];
                    for (let i = 0; i < resImg.length; i++) {
                        const image = toBase64(resImg[i].data);
                        imageList.push({image : `data:image/png;base64,${image}`, name: res[i]});
                    }
                    setImageServices(imageList);
                });
            });
            getActionsServices(accessToken).then((res) => setActions(res));
            getReactionsServices(accessToken).then((res) => setReactions(res));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('triggerApp', triggerApp);
        localStorage.setItem('actionApp', actionApp);
        localStorage.setItem('showDiscordLogin', JSON.stringify(showDiscordLogin));
        localStorage.setItem('discordReactionSelected', JSON.stringify(discordReactionSelected));
        localStorage.setItem('discordStyle', discordStyle);
        localStorage.setItem('showDiscordLoginAction', JSON.stringify(showDiscordLoginAction));
        localStorage.setItem('discordActionSelected', JSON.stringify(discordActionSelected));
        localStorage.setItem('actionDetails', JSON.stringify(actionDetails));
        localStorage.setItem('reactionDetails', JSON.stringify(reactionDetails));
    }, [
        triggerApp,
        actionApp,
        showDiscordLogin,
        discordReactionSelected,
        discordStyle,
        showDiscordLoginAction,
        discordActionSelected,
        actionDetails,
        reactionDetails
    ]);

    useEffect(() => {
        const newDiscordStyle = {};

        if (triggerApp === "Discord") {
            setShowDiscordLoginAction(true);
            setDiscordActionSelected(true);
            setActionContainer(true);
            setShowSuggestions(false);
        } else if (triggerApp === "Time") {
            setActionContainer(true);
            setTimeAction(true);
            setShowSuggestions(false);
        } else if (triggerApp === "Open Weather") {
            setWeatherAction(true);
            setActionContainer(true);
            setShowSuggestions(false);
        } else if (triggerApp === "TMDB") {
            setTmdbAction(true);
            setActionContainer(true);
            setShowSuggestions(false);
        } else if (triggerApp === "Exchange Rates") {
            setCryptoAction(true);
            setActionContainer(true);
            setShowSuggestions(false);
        } else if (triggerApp === "Google Calendar") {
            setGoogleCalendarAction(true);
            setActionContainer(true);
            setShowSuggestions(false);
        } else if (triggerApp === "News") {
            setNewsAction(true);
            setActionContainer(true);
            setShowSuggestions(false);
        } else if (triggerApp === "Joke") {
            setJokeAction(true);
            setActionContainer(true);
            setShowSuggestions(false);
        }
        else {
            setActionContainer(false);
            setShowDiscordLoginAction(false);
            setTimeAction(false);
            setWeatherAction(false);
            setTmdbAction(false);
            setCryptoAction(false);
            setGoogleCalendarAction(false);
            setNewsAction(false);
        }

        if (actionApp === "Discord") {
            setShowDiscordLogin(true);
            setDiscordReactionSelected(true);
            setReactionContainer(true);
            setShowSuggestions(false);
        } else if (actionApp === "Gmail") {
            setReactionContainer(true);
            setGmailReaction(true);
            setShowSuggestions(false);
            setShowSuggestions(false);
        }
        else {
            setDiscordReactionSelected(false);
            setReactionContainer(false);
            setShowDiscordLogin(false);
            setGmailReaction(false);
        }

        setDiscordStyle(newDiscordStyle);
    }, [triggerApp, actionApp]);

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            setWindowWidth(newWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div style={styles.container}>
            {windowWidth < 850 && (
                <div style={styles.downloadMessage}>
                    <p>Veuillez télécharger notre application pour une meilleure expérience sur un écran adapté.</p>
                </div>
            )}
            <h1 style={styles.titleArea}>AREA</h1>
            <div style={styles.topBar}></div>
            <div style={styles.leftBar}></div>
            <div style={styles.greyBackground}></div>
            <text style={styles.TextConnectTrigger}>Connect this App</text>
            <text style={styles.TextConnectAction}>With this App</text>
            <div>
                <TriggerInput
                    triggerApp={triggerApp}
                    showSuggestions={showSuggestions}
                    suggestions={suggestions}
                    handleTriggerAppChange={handleTriggerAppChange}
                    handleSuggestionsClick={handleSuggestionsClick}
                    styles={styles}
                    imageServices={imageServices}
                />
                <ActionInput
                    actionApp={actionApp}
                    showActionSuggestions={showActionSuggestions}
                    suggestions={suggestions}
                    handleActionAppChange={handleActionAppChange}
                    handleActionClick={handleActionClick}
                    styles={styles}
                    imageServices={imageServices}
                />
            </div>
            <button style={styles.setZapButton} onClick={handleSetZap}>
                Set Zap
            </button>
            <text style={styles.recentAppText}>Recent Apps</text>
            <Zap
                styles={styles}
                imageServices={imageServices}
                suggestions={suggestions}
                accessToken={accessToken}
                zapListChanged={zapListChanged}
                setZapListChanged={setZapListChanged}
            />
            <button onClick={() => {
                localStorage.clear();
                setLogged(false);
                navigate('/');
            }} style={styles.logoutButton}>Logout</button>
            <DiscordActions
                actionContainer={actionContainer}
                discordActionSelected={discordActionSelected}
                showDiscordLoginAction={showDiscordLoginAction}
                styles={styles}
                discordStyle={discordStyle}
                actions={actions}
                setDiscordActionSelected={setDiscordActionSelected}
                accessToken={accessToken}
                setActionDetailsHome={setActionDetails}
            />

            <DiscordReactions
                showDiscordLogin={showDiscordLogin}
                styles={styles}
                reactionContainer={reactionContainer}
                discordReactionSelected={discordReactionSelected}
                setDiscordReactionSelected={setDiscordReactionSelected}
                reactions={reactions}
                setReactionDetailsHome={setReactionDetails}
                accessToken={accessToken}
            />
            <TimeAPIAction
                actionContainer={actionContainer}
                styles={styles}
                timeAction={timeAction}
                actions={actions}
                triggerApp={triggerApp}
                setActionDetailsHome={setActionDetails}
            />
            <WeatherAPIAction
                actionContainer={actionContainer}
                styles={styles}
                weatherAction={weatherAction}
                actions={actions}
                triggerApp={triggerApp}
                setActionDetailsHome={setActionDetails}
            />
            <TMDBAPIAction
                actionContainer={actionContainer}
                styles={styles}
                tmdbAction={tmdbAction}
                triggerApp={triggerApp}
                actions={actions}
                setActionDetailsHome={setActionDetails}
            />
            <GmailAPIReaction
                reactionContainer={reactionContainer}
                styles={styles}
                gmailReaction={gmailReaction}
                actionApp={actionApp}
                reactions={reactions}
                setReactionDetailsHome={setReactionDetails}
            />
            <GoogleCalendarAPIAction
                actionContainer={actionContainer}
                styles={styles}
                googleCalendarAction={googleCalendarAction}
                triggerApp={triggerApp}
            />
            <CryptoAPIAction
                actionContainer={actionContainer}
                styles={styles}
                cryptoAction={cryptoAction}
                triggerApp={triggerApp}
            />
            <NewsAPIAction
                actionContainer={actionContainer}
                styles={styles}
                newsAction={newsAction}
                triggerApp={triggerApp}
                actions={actions}
                setActionDetailsHome={setActionDetails}
            />
            <JokeAPIAction
                actionContainer={actionContainer}
                styles={styles}
                jokeAction={jokeAction}
                triggerApp={triggerApp}
                actions={actions}
                setActionDetailsHome={setActionDetails}
            />
        </div>
    );
};

export default HomePage;
