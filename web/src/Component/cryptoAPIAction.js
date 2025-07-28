import React, {useEffect, useState} from 'react';

const CryptoAPIAction = ({actionContainer, styles, cryptoAction, triggerApp}) => {


    useEffect(() => {
        if (triggerApp !== "Exchange Rates") {

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

export default CryptoAPIAction;