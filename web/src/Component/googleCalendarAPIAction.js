import React, {useEffect, useState} from 'react';

const GoogleCalendarAPIAction = ({actionContainer, styles, googleCalendarAction, triggerApp}) => {


    useEffect(() => {
        if (triggerApp !== "Google Calendar") {

        }
    }, [triggerApp]);

    return (
        <>
            {actionContainer && (
                <div style={styles.actionContainer}>

                </div>
            )}
        </>
    )
}

export default GoogleCalendarAPIAction;