import React, {useEffect, useState} from 'react';

const TMDBAPIAction = ({actionContainer, styles, tmdbAction, triggerApp, actions, setActionDetailsHome}) => {
    const [selectedTMDBAction, setSelectedTMDBAction] = useState(localStorage.getItem('selectedTMDBAction') || '');
    const [onTheater, setOnTheater] = useState(localStorage.getItem('onTheater') || false);
    const [onTheaterFilmSelected, setOnTheaterFilmSelected] = useState(localStorage.getItem('onTheaterBox') || '');
    const [actionTypeTMDB, setActionTypeTMDB] = useState(localStorage.getItem('actionTypeTMDB') || '');
    const [actionDetails, setActionDetails] = useState(JSON.parse(localStorage.getItem('actionDetails')) || {
        actionApp: 'TMDB',
        "TMDB": {
            actionType: '',
            actionUrl: '',
            movieName: ''
        }});

    const handleTMDBActionSelected = (event) => {
        setSelectedTMDBAction(event.target.value);

        let obj = actions['TMDB'].find(o => o.url === event.target.value);
        if (obj.name === 'On Theater') {
            setOnTheater(true);
            setActionTypeTMDB('onTheater');
        } else if (obj.name === 'Now Playing') {
            setOnTheater(false);
            setActionTypeTMDB('none');
        } else if (obj.name === 'Popular') {
            setOnTheater(false);
            setActionTypeTMDB('none');
        } else if (obj.name === 'Upcoming') {
            setOnTheater(false);
            setActionTypeTMDB('none');
        }
        if (obj.name === '') {
            alert("Please select an action")
            return;
        }
    }

    const handleFilmBox = (event) => {
        const value = event.target.value;
        setOnTheaterFilmSelected(value);
    }

    useEffect(() => {
        if (triggerApp !== "TMDB") {
            setSelectedTMDBAction('');
            setOnTheater(false);
        }
    }, [triggerApp]);

    useEffect(() => {
        localStorage.setItem('selectedTMDBAction', selectedTMDBAction);
        localStorage.setItem('onTheater', onTheater);
        localStorage.setItem('onTheaterBox', onTheaterFilmSelected);
        localStorage.setItem('actionTypeTMDB', actionTypeTMDB);
        localStorage.setItem('actionDetails', JSON.stringify(actionDetails));
    }, [selectedTMDBAction, onTheaterFilmSelected, actionTypeTMDB, actionDetails]);

    useEffect(() => {
        const details = {
            actionApp: 'TMDB',
            "TMDB": {
                actionType: actionTypeTMDB,
                actionUrl: selectedTMDBAction,
                movieName: onTheaterFilmSelected
            }
        };
        setActionDetailsHome(details);
        setActionDetails(details);
    }, [selectedTMDBAction, onTheaterFilmSelected, actionTypeTMDB]);

    return (
        <>
            {actionContainer && (
                <div style={styles.actionContainer}>
                    {tmdbAction && (
                        <select value={selectedTMDBAction} onChange={handleTMDBActionSelected} style={styles.tmdbActionsButton}>
                            { actions['TMDB'] && actions['TMDB'].map((action, index) => (
                                <option key={index} value={action.url}>{action.name}</option>
                            ))}
                        </select>
                    )}
                    {onTheater && (
                        <div style={{zIndex: 1}}>
                            <input style={styles.textBox} type={"text"} value={onTheaterFilmSelected} onChange={handleFilmBox} placeholder={"Type a film to search here..."}></input>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default TMDBAPIAction;
