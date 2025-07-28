import React, {useEffect, useState} from 'react';

const WeatherAPIAction = ({actionContainer, styles, weatherAction, actions, triggerApp, setActionDetailsHome}) => {

    const [weatherCitySellected, setWeatherCitySellected] = useState(localStorage.getItem('weatherIntervaleSellected') || false);
    const [cityBox, setCityBox] = useState(localStorage.getItem('cityBox') || '');
    const [weatherBetween, setWeatherBetween] = useState(localStorage.getItem('weatherBetween') || '');
    const [degree1, setDegree1] = useState(localStorage.getItem('degree1') || '');
    const [weatherSelector, setWeatherSelector] = useState(localStorage.getItem('weatherSelector') || '');
    const [weatherSelectorValue, setWeatherSelectorValue] = useState(localStorage.getItem('weatherSelector') || '');
    const [weather, setWeather] = useState(localStorage.getItem('weather') || '');
    const [weatherDaysSellected, setWeatherDaysSellected] = useState(localStorage.getItem('weatherDaysSellected') || false);
    const [weatherDays, setWeatherDays] = useState(localStorage.getItem('weatherDays') || '1');
    const [weatherDaysValue, setWeatherDaysValue] = useState(localStorage.getItem('weatherDays') || '1');
    const [selectedWeatherAction, setSelectedWeatherAction] = useState(localStorage.getItem('selectedWeatherAction') || '');
    const [actionTypeWeather, setActionTypeWeather] = useState(localStorage.getItem('actionTypeWeather') || '');
    const [actionDetails, setActionDetails] = useState(JSON.parse(localStorage.getItem('actionDetails')) || {
        actionApp: 'OpenWeather',
        "OpenWeather": {
            actionType: '',
            actionUrl: '',
            days: '',
            place: '',
            temp: '',
            condition: '',
        }});

    const handleWeatherActionSelected = (event) => {
        setSelectedWeatherAction(event.target.value);
        const name = event.target.value;

        let obj = actions['OpenWeather'].find(o => o.url === event.target.value);
        console.log(obj.name);
        if (obj.name === "weather now") {
            setWeatherSelector(false);
            setWeatherDaysSellected(false);
            setWeatherCitySellected(true);
            setWeatherBetween(false);
            setActionTypeWeather('place');
        } else if (obj.name === "is Temperature close") {
            setWeatherCitySellected(false);
            setWeatherSelector(false);
            setWeatherDaysSellected(false);
            setWeatherBetween(true);
            setActionTypeWeather('temperature');
        } else if (obj.name === "is Condition close") {
            setWeatherCitySellected(false);
            setWeatherBetween(false);
            setWeatherDaysSellected(false);
            setWeatherSelector(true);
            setActionTypeWeather('condition');
        } else if (obj.name === "Forecast for days") {
            setWeatherCitySellected(false);
            setWeatherBetween(false);
            setWeatherSelector(false);
            setWeatherDaysSellected(true);
            setActionTypeWeather('forecast');

        }
        if (obj.name === '') {
            alert("Please select an action")
            setWeatherCitySellected(false);
            setWeatherBetween(false);
            setWeatherSelector(false);
            setWeatherDaysSellected(false);
            return;
        }
        //set je sais pas quoi
    }

    const handleCityBox = (event) => {
        const value = event.target.value;
        setCityBox(value);
    }

    const handleDegree1 = (event) => {
        const value = event.target.value;
        setDegree1(value);
    }

    const handleWeatherSelector = (event) => {
        const value = event.target.value;
        setWeatherSelectorValue(event.target.value)
        setWeather(value);
        console.log(value);
    }

    const handleWeatherDays = (event) => {
        const value = event.target.value;
        setWeatherDays(value)
        setWeatherDaysValue(value)
        setWeatherDays(value);
        console.log(value);
    }

    useEffect(() => {
        if (triggerApp !== "Open Weather") {
            setSelectedWeatherAction('');
            setWeatherCitySellected(false);
            setWeatherBetween(false);
            setWeatherSelector(false);
            setWeatherDaysSellected(false);
        }
    }, [triggerApp]);

    useEffect(() => {
        localStorage.setItem('actionDetails', JSON.stringify(actionDetails));
    }, [actionDetails]);

    useEffect(() => {
        const details = {
            actionApp: 'Open Weather',
            "Open Weather": {
                actionType: actionTypeWeather,
                actionUrl: selectedWeatherAction,
                days: weatherDays,
                place: cityBox,
                temp: degree1,
                condition: weather,
            }
        }
        setActionDetails(details);
        setActionDetailsHome(details);
    }, [actionTypeWeather, selectedWeatherAction, weatherDays, cityBox, degree1, weather]);

    return (
        <>
            {actionContainer && (
                <div style={styles.actionContainer}>
                    {weatherAction && (
                        <select value={selectedWeatherAction} onChange={handleWeatherActionSelected} style={styles.weatherActionsButton}>
                            { actions['OpenWeather'] && actions['OpenWeather'].map((action, index) => (
                                <option key={index} value={action.url}>{action.name}</option>
                            ))}
                        </select>
                    )}
                    {weatherCitySellected && (
                        <div style={{zIndex: 1}}>
                            <input style={styles.cityTextBox} type={"text"} value={cityBox} onChange={handleCityBox} placeholder={"Type a city here..."}></input>
                        </div>
                    )}
                    {weatherBetween && (
                        <>
                            <div style={{zIndex: 1}}>
                                <input style={styles.cityTextBox} type={"text"} value={cityBox} onChange={handleCityBox} placeholder={"Type a city here..."}></input>
                            </div>
                            <div style={{zIndex: 1}}>
                                <input style={styles.cityTextBox} type={"text"} value={degree1} onChange={handleDegree1} placeholder={"Type a degree here..."}></input>
                            </div>
                        </>
                    )}
                    {weatherSelector && (
                        <>
                            <div style={{zIndex: 1}}>
                                <input style={styles.cityTextBox} type={"text"} value={cityBox} onChange={handleCityBox} placeholder={"Type a city here..."}></input>
                            </div>
                            <div style={{zIndex: 1}}>
                                <select value={weatherSelectorValue} onChange={handleWeatherSelector} style={styles.weatherActionsButton}>
                                    <option value="">Select a weather</option>
                                    <option value="Sunny">Sunny</option>
                                    <option value="Cloudy">Cloudy</option>
                                    <option value="Rainy">Rainy</option>
                                </select>
                            </div>
                        </>
                    )}
                    {weatherDaysSellected && (
                        <>
                            <div style={{zIndex: 1}}>
                                <input style={styles.cityTextBox} type={"text"} value={cityBox} onChange={handleCityBox} placeholder={"Type a city here..."}></input>
                            </div>
                            <div style={{zIndex: 1}}>
                                <select value={weatherDaysValue} onChange={handleWeatherDays} style={styles.weatherActionsButton}>
                                    <option value="">Select how many days</option>
                                    <option value="1">1 day</option>
                                    <option value="2">2 days</option>
                                    <option value="3">3 days</option>
                                    <option value="4">4 days</option>
                                    <option value="5">5 days</option>
                                    <option value="6">6 days</option>
                                    <option value="7">7 days</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default WeatherAPIAction;
