import React, {useEffect, useState} from 'react';

const GmailAPIReaction = ({reactionContainer, styles, gmailReaction, actionApp, reactions, setReactionDetailsHome}) => {


    const [selectedGMAILReaction, setSelectedGMAILReaction] = useState(localStorage.getItem('selectedGMAILReaction') || '');
    const [sendEmail, setSendEmail] = useState(localStorage.getItem('sendEmail') || false);
    const [emailTypedValue, setEmailTypedValue] = useState(localStorage.getItem('emailTypedValue') || '');
    const [emailObjectValue, setEmailObjectValue] = useState(localStorage.getItem('emailObjectValue') || '');
    const [reactionDetails, setReactionDetails] = useState(JSON.parse(localStorage.getItem('reactionDetails')) || {
        reactionApp: 'Gmail',
        "Gmail": {
            reactionUrl: '',
            email : '',
            subject : '',
        }});

    const handleGMAILReactionSelected = (event) => {
        setSelectedGMAILReaction(event.target.value);
        let obj = reactions['Gmail'].find(o => o.url === event.target.value);
        console.log(obj.name);
        if (obj.name === 'Send an Email') {
            setSendEmail(true);
        }
        if (obj.name === '') {
            setSendEmail(false);
            alert("Please select an action")
            return;
        }
    }

    const emailObject = (event) => {
        setEmailObjectValue(event.target.value);
        console.log(event.target.value);
    }

    const emailTyped = (event) => {
        setEmailTypedValue(event.target.value);
        console.log(event.target.value);
    }

    const remainingObjectCharacters = 0 + emailObjectValue.length;
    const remainingEmailCharacters = 0 + emailTypedValue.length;

    useEffect(() => {
        if (actionApp !== "Gmail") {
            setSelectedGMAILReaction('');
            setSendEmail(false);
        }
    }, [actionApp]);

    useEffect(() => {
        localStorage.setItem('selectedGMAILReaction', selectedGMAILReaction);
        localStorage.setItem('sendEmail', sendEmail);
        localStorage.setItem('emailTypedValue', emailTypedValue);
        localStorage.setItem('emailObjectValue', emailObjectValue);
        localStorage.setItem('reactionDetails', JSON.stringify(reactionDetails));
    }, [selectedGMAILReaction, emailObjectValue, emailTypedValue, reactionDetails]);

    useEffect(() => {
        const details = {
            reactionApp: 'Gmail',
            "Gmail": {
                reactionUrl: selectedGMAILReaction,
                email : emailTypedValue,
                subject : emailObjectValue,
            }
        };
        setReactionDetails(details);
        setReactionDetailsHome(details);
    }, [selectedGMAILReaction, emailObjectValue, emailTypedValue]);
    return (
        <>
            {reactionContainer && (
                <div style={styles.reactionContainer}>
                    {gmailReaction && (
                        <select value={selectedGMAILReaction} onFocus={handleGMAILReactionSelected} style={styles.tmdbActionsButton}>
                            { reactions['Gmail'] && reactions['Gmail'].map((reaction, index) => (
                                <option key={index} value={reaction.url}>{reaction.name}</option>
                            ))}
                        </select>
                    )}
                    {sendEmail && (
                        <div style={{zIndex: 1}}>
                            <textarea style={styles.textBox} maxLength="100" value={emailObjectValue} onChange={emailObject} placeholder={"Type you object here"}></textarea>
                            <span style={styles.remainingCharacters}>{remainingObjectCharacters} / 100</span>
                            <textarea style={styles.textBoxEmail} maxLength="254" value={emailTypedValue} onChange={emailTyped} placeholder={"Type your mail here"}></textarea>
                            <span style={styles.remainingCharacters}>{remainingEmailCharacters} / 254</span>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default GmailAPIReaction;
