import React, {useEffect, useState} from 'react';

const NewsAPIAction = ({actionContainer, styles, newsAction, triggerApp, actions, setActionDetailsHome}) => {
    const [selectedNewsAction, setSelectedNewsAction] = useState(localStorage.getItem('selectedNewsAction') || '');
    const [actionDetails, setActionDetails] = useState(JSON.parse(localStorage.getItem('actionDetails')) || {
        actionApp: 'News',
        "News": {
            actionUrl: '',
        }});

    const handleNewsActionSelected = (event) => {
        setSelectedNewsAction(event.target.value);

        /*let obj = actions['News'].find(o => o.url === event.target.value);
        if (obj.name === '') {
            alert("Please select an action")
            return;
        }*/
    }

    useEffect(() => {
        if (triggerApp !== "News") {
            setSelectedNewsAction('');
        }
    });

    useEffect(() => {
        localStorage.setItem('selectedNewsAction', selectedNewsAction);
        localStorage.setItem('actionDetails', JSON.stringify(actionDetails));
    }, [selectedNewsAction, actionDetails]);

    useEffect(() => {
        const details = {
            actionApp: 'News',
            "News": {
                actionUrl: selectedNewsAction,
            }
        };
        setActionDetails(details);
        setActionDetailsHome(details);
    }, [selectedNewsAction]);

    return (
        <>
            {actionContainer && (
                <div style={styles.actionContainer}>
                    {newsAction && (
                        <select value={selectedNewsAction} onFocus={handleNewsActionSelected} style={styles.tmdbActionsButton}>
                            { actions['News'] && actions['News'].map((action, index) => (
                                <option key={index} value={action.url}>{action.name}</option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </>
    );
}

export default NewsAPIAction;
