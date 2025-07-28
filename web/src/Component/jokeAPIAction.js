import React, {useEffect, useState} from 'react';

const JokeAPIAction = ({actionContainer, styles, jokeAction, triggerApp, actions, setActionDetailsHome}) => {
    const [selectedJokeAction, setSelectedJokeAction] = useState(localStorage.getItem('selectedJokeAction') || '');
    const [actionDetails, setActionDetails] = useState(JSON.parse(localStorage.getItem('actionDetails')) || {
        actionApp: 'Joke',
        "Joke": {
            actionUrl: '',
        }});

    const handleNewsActionSelected = (event) => {
        setSelectedJokeAction(event.target.value);

        /*let obj = actions['News'].find(o => o.url === event.target.value);
        if (obj.name === '') {
            alert("Please select an action")
            return;
        }*/
    }

    useEffect(() => {
        if (triggerApp !== "Joke") {
            setSelectedJokeAction('');

        }
    });

    useEffect(() => {
        localStorage.setItem('selectedJokeAction', selectedJokeAction);
        localStorage.setItem('actionDetails', JSON.stringify(actionDetails));
    }, [selectedJokeAction, actionDetails]);

    useEffect(() => {
        const details = {
            actionApp: 'Joke',
            "Joke": {
                actionUrl: selectedJokeAction,
            }
        };
        setActionDetails(details);
        setActionDetailsHome(details);
    }, [selectedJokeAction]);

    return (
        <>
            {actionContainer && (
                <div style={styles.actionContainer}>
                    {jokeAction && (
                        <select value={selectedJokeAction} onFocus={handleNewsActionSelected} style={styles.tmdbActionsButton}>
                            { actions['Joke'] && actions['Joke'].map((action, index) => (
                                <option key={index} value={action.url}>{action.name}</option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </>
    );
}

export default JokeAPIAction;
