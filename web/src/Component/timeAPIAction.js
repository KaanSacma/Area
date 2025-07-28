import React, {useEffect, useState} from 'react';

const TimeAPIAction = ({actionContainer, styles, timeAction, actions, triggerApp, setActionDetailsHome}) => {
    //interval (donne l'heure une fois tous les 15 minutes, 30 minutes ou 1 heure), hour précise, At minutes


    const [selectedTimeAction, setSelectedTimeAction] = useState(localStorage.getItem('selectedTimeAction') || '');
    const [showTimeIntervale, setShowTimeIntervale] = useState(JSON.parse(localStorage.getItem('showTimeIntervale')) || false);
    const [showTimeHour, setShowTimeHour] = useState(JSON.parse(localStorage.getItem('showTimeHour')) || false);
    const [showTimeMinute, setShowTimeMinute] = useState(JSON.parse(localStorage.getItem('showTimeMinute')) || false);
    const [timeIntervaleSelected, setTimeIntervaleSelected] = useState(localStorage.getItem('timeIntervaleSelected') || '');
    const [timeHourSelected, setTimeHourSelected] = useState(localStorage.getItem('timeHourSelected') || '');
    const [timeMinuteIntervale, setTimeMinuteIntervale] = useState(localStorage.getItem('timeMinuteIntervale') || '');
    const [timeZoneSelected, setTimeZoneSelected] = useState(localStorage.getItem('timeZoneSelected') || '');
    const [actionTypeTime, setActionTypeTime] = useState(localStorage.getItem('actionTypeTime') || '');
    const [actionDetails, setActionDetails] = useState(JSON.parse(localStorage.getItem('actionDetails')) || {
        actionApp: 'Time',
        "Time": {
            actionType: '',
            actionUrl: '',
            timeZone: '',
            wantedHour: '',
            wantedMinute: '',
            wantedInterval: '',
        }});

    const handleTimeActionSelected = (event) => {
        let obj = actions['Time'].find(o => o.url === event.target.value);
        setSelectedTimeAction(event.target.value)

        if (obj.name === 'Timezone by Interval') {
            setShowTimeIntervale(true);
            setShowTimeHour(false);
            setShowTimeMinute(false);
            setActionTypeTime('interval');
        } else if (obj.name === 'Timezone by Hours') {
            setShowTimeHour(true);
            setShowTimeMinute(false);
            setShowTimeIntervale(false);
            setActionTypeTime('hour');
        } else if (obj.name === 'Timezone by Minutes') {
            setShowTimeMinute(true);
            setShowTimeHour(false);
            setShowTimeIntervale(false);
            setActionTypeTime('minute');
        }
        console.log(event.target.value);
        if (obj.name === '') {
            alert("Please select an action")
            setShowTimeIntervale(false);
            setShowTimeHour(false);
            setShowTimeMinute(false);
            return;
        }
    }

    const handleTimeIntervalSelected = (event) => {
        const time = event.target.value;
        setTimeHourSelected('');
        setTimeMinuteIntervale('');
        if (time === '00') {
            setTimeIntervaleSelected('00');
        } else if (time === '15') {
            setTimeIntervaleSelected('15');
        } else if (time === '30') {
            setTimeIntervaleSelected('30');
        }
        console.log(event.target.value);
        if (event.target.value === '') {
            alert("Please select an action")
            return;
        }
    }

    const handleTimeHourSelected = (event) => {
        setTimeHourSelected(event.target.value);
        setTimeMinuteIntervale('');
        setTimeIntervaleSelected('');
    }

    const handleTimeMinuteSelected = (event) => {
        setTimeMinuteIntervale(event.target.value);
        setTimeHourSelected('');
        setTimeIntervaleSelected('');
    }

    const handleTimeZoneSelected = (event) => {
        setTimeZoneSelected(event.target.value);
    }

    useEffect(() => {
        if (triggerApp !== "Time") {
            setSelectedTimeAction('');
            setShowTimeIntervale(false);
            setShowTimeHour(false);
            setShowTimeMinute(false);
        }
    }, [triggerApp]);

    useEffect(() => {
        localStorage.setItem('selectedTimeAction', selectedTimeAction);
        localStorage.setItem('showTimeIntervale', JSON.stringify(showTimeIntervale));
        localStorage.setItem('showTimeHour', JSON.stringify(showTimeHour));
        localStorage.setItem('showTimeMinute', JSON.stringify(showTimeMinute));
        localStorage.setItem('timeIntervaleSelected', timeIntervaleSelected);
        localStorage.setItem('timeHourSelected', timeHourSelected);
        localStorage.setItem('timeMinuteIntervale', timeMinuteIntervale);
        localStorage.setItem('actionTypeTime', actionTypeTime);
        localStorage.setItem('actionDetails', JSON.stringify(actionDetails));
        localStorage.setItem('timeZoneSelected', timeZoneSelected);
    }, [selectedTimeAction, timeZoneSelected, timeIntervaleSelected, timeHourSelected, timeMinuteIntervale, actionTypeTime, actionDetails, showTimeIntervale, showTimeHour, showTimeMinute]);

    useEffect(() => {
        const details = {
            actionApp: 'Time',
            "Time": {
                actionType: actionTypeTime,
                actionUrl: selectedTimeAction,
                timeZone: timeZoneSelected,
                wantedHour: timeHourSelected,
                wantedMinute: timeMinuteIntervale,
                wantedInterval: timeIntervaleSelected,
            }
        };
        setActionDetailsHome(details);
        setActionDetails(details);
    }, [selectedTimeAction, timeIntervaleSelected, timeHourSelected, timeMinuteIntervale, actionTypeTime, timeZoneSelected]);
    return (
        <>
            {actionContainer && (
                <div style={styles.actionContainer}>
                    {timeAction && (
                        <select value={selectedTimeAction} onChange={handleTimeActionSelected} style={styles.timeActionsButton}>
                            { actions['Time'] && actions['Time'].map((action, index) => (
                                <option key={index} value={action.url}>{action.name}</option>
                            ))}
                        </select>
                    )}
                    {showTimeIntervale && (
                        <>
                            <select onChange={handleTimeZoneSelected} style={styles.timeIntervalButton}>
                                <option value="GMT">GMT</option>
                                <option value="UTC">UTC</option>
                                <option value="CET">CET</option>
                                <option value="EET">EET</option>
                                <option value="EST">EST</option>
                                <option value="HST">HST</option>
                                <option value="Japan">Japan</option>
                                <option value="Australia/West">Australia/West</option>
                                <option value="PST8PDT">PST8PDT</option>
                                <option value="CST6CDT">CST6CDT</option>
                            </select>
                            <select onChange={handleTimeIntervalSelected} style={styles.timeIntervalButton}>
                                <option value="00">At 00 minutes</option>
                                <option value="15">Each 15 minutes</option>
                                <option value="30">Each 30 minutes</option>
                            </select>
                        </>
                    )}
                    {showTimeHour && (
                        <>
                            <select onChange={handleTimeZoneSelected} style={styles.timeIntervalButton}>
                                <option value="GMT">GMT</option>
                                <option value="UTC">UTC</option>
                                <option value="CET">CET</option>
                                <option value="EET">EET</option>
                                <option value="EST">EST</option>
                                <option value="HST">HST</option>
                                <option value="Japan">Japan</option>
                                <option value="Australia/West">Australia/West</option>
                                <option value="PST8PDT">PST8PDT</option>
                                <option value="CST6CDT">CST6CDT</option>
                            </select>
                            <select onChange={handleTimeHourSelected} style={styles.timeIntervalButton}>
                                <option value="00">At 00 hour</option>
                                <option value="01">At 01 hour</option>
                                <option value="02">At 02 hour</option>
                                <option value="03">At 03 hour</option>
                                <option value="04">At 04 hour</option>
                                <option value="05">At 05 hour</option>
                                <option value="06">At 06 hour</option>
                                <option value="07">At 07 hour</option>
                                <option value="08">At 08 hour</option>
                                <option value="09">At 09 hour</option>
                                <option value="10">At 10 hour</option>
                                <option value="11">At 11 hour</option>
                                <option value="12">At 12 hour</option>
                                <option value="13">At 13 hour</option>
                                <option value="14">At 14 hour</option>
                                <option value="15">At 15 hour</option>
                                <option value="16">At 16 hour</option>
                                <option value="17">At 17 hour</option>
                                <option value="18">At 18 hour</option>
                                <option value="19">At 19 hour</option>
                                <option value="20">At 20 hour</option>
                                <option value="21">At 21 hour</option>
                                <option value="22">At 22 hour</option>
                                <option value="23">At 23 hour</option>
                            </select>
                        </>
                    )}
                    {showTimeMinute && (
                        <>
                            <select onChange={handleTimeZoneSelected} style={styles.timeIntervalButton}>
                                <option value="GMT">GMT</option>
                                <option value="UTC">UTC</option>
                                <option value="CET">CET</option>
                                <option value="EET">EET</option>
                                <option value="EST">EST</option>
                                <option value="HST">HST</option>
                                <option value="Japan">Japan</option>
                                <option value="Australia/West">Australia/West</option>
                                <option value="PST8PDT">PST8PDT</option>
                                <option value="CST6CDT">CST6CDT</option>
                            </select>
                            <select onChange={handleTimeMinuteSelected} style={styles.timeIntervalButton}>
                                <option value="00">At 00 minutes</option>
                                <option value="01">At 01 minutes</option>
                                <option value="02">At 02 minutes</option>
                                <option value="03">At 03 minutes</option>
                                <option value="04">At 04 minutes</option>
                                <option value="05">At 05 minutes</option>
                                <option value="06">At 06 minutes</option>
                                <option value="07">At 07 minutes</option>
                                <option value="08">At 08 minutes</option>
                                <option value="09">At 09 minutes</option>
                                <option value="10">At 10 minutes</option>
                                <option value="11">At 11 minutes</option>
                                <option value="12">At 12 minutes</option>
                                <option value="13">At 13 minutes</option>
                                <option value="14">At 14 minutes</option>
                                <option value="15">At 15 minutes</option>
                                <option value="16">At 16 minutes</option>
                                <option value="17">At 17 minutes</option>
                                <option value="18">At 18 minutes</option>
                                <option value="19">At 19 minutes</option>
                                <option value="20">At 20 minutes</option>
                                <option value="21">At 21 minutes</option>
                                <option value="22">At 22 minutes</option>
                                <option value="23">At 23 minutes</option>
                                <option value="24">At 24 minutes</option>
                                <option value="25">At 25 minutes</option>
                                <option value="26">At 26 minutes</option>
                                <option value="27">At 27 minutes</option>
                                <option value="28">At 28 minutes</option>
                                <option value="29">At 29 minutes</option>
                                <option value="30">At 30 minutes</option>
                                <option value="31">At 31 minutes</option>
                                <option value="32">At 32 minutes</option>
                                <option value="33">At 33 minutes</option>
                                <option value="34">At 34 minutes</option>
                                <option value="35">At 35 minutes</option>
                                <option value="36">At 36 minutes</option>
                                <option value="37">At 37 minutes</option>
                                <option value="38">At 38 minutes</option>
                                <option value="39">At 39 minutes</option>
                                <option value="40">At 40 minutes</option>
                                <option value="41">At 41 minutes</option>
                                <option value="42">At 42 minutes</option>
                                <option value="43">At 43 minutes</option>
                                <option value="44">At 44 minutes</option>
                                <option value="45">At 45 minutes</option>
                                <option value="46">At 46 minutes</option>
                                <option value="47">At 47 minutes</option>
                                <option value="48">At 48 minutes</option>
                                <option value="49">At 49 minutes</option>
                                <option value="50">At 50 minutes</option>
                                <option value="51">At 51 minutes</option>
                                <option value="52">At 52 minutes</option>
                                <option value="53">At 53 minutes</option>
                                <option value="54">At 54 minutes</option>
                                <option value="55">At 55 minutes</option>
                                <option value="56">At 56 minutes</option>
                                <option value="57">At 57 minutes</option>
                                <option value="58">At 58 minutes</option>
                                <option value="59">At 59 minutes</option>
                            </select>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default TimeAPIAction;
