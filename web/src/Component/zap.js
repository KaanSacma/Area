import React, {useEffect, useState} from 'react';
import axios from "axios";
import {getIndexZap} from "../js/services";

const Zap = ({styles, imageServices, suggestions, accessToken, zapListChanged, setZapListChanged}) => {

    const [zapList, setZapList] = useState(JSON.parse(localStorage.getItem('zapList')) || []);
    const [buttonStates, setButtonStates] = useState(Array(Object.keys(zapList).length).fill(true));


    useEffect(() => {
        if (accessToken === null)
            accessToken = localStorage.getItem('accessToken');
        axios.get('https://areaotek.azurewebsites.net/services/zaps', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                const storedButtonStates = JSON.parse(localStorage.getItem('buttonStates')) || Array(Object.keys(zapList).length).fill(true);
                const zapsData = response.data;
                for (let i = 0; i < zapsData.length; i++) {
                    storedButtonStates[i] = zapsData[i].status;
                }
                setButtonStates(storedButtonStates);
                setZapList(zapsData);
            })
            .catch((error) => {
                console.error('Error when you get the zap : ', error);
            });
    }, [accessToken, zapListChanged]);

    const handleButtonClick = (id, index) => {
        if (accessToken === null)
            accessToken = localStorage.getItem('accessToken');
        const newButtonStates = [...buttonStates];
        axios.post(`https://areaotek.azurewebsites.net/services/switch/status/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
            .then(response => {
                newButtonStates[index] = !newButtonStates[index];
                setButtonStates(newButtonStates);
                localStorage.setItem('buttonStates', JSON.stringify(newButtonStates));
            })
            .catch(error => {
                console.error('Error when you switch the state of the Zap : ', error);
            });
    };

    const deleteZap = (id) => {
        if (accessToken === null)
            accessToken = localStorage.getItem('accessToken');
        axios.delete(`https://areaotek.azurewebsites.net/services/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
            .then(response => {
                setZapListChanged(!zapListChanged);
            })
            .catch(error => {
                console.error('Error when you try to delete : ', error);
            });
    };

    return (
        <>
            {zapList ? (
                <div style={styles.boxAppConnected}>
                    {Object.keys(zapList).map((key, index) => (
                        <div key={index} style={styles.zapIsSet}>
                            {imageServices.length > 0 && imageServices[getIndexZap(imageServices, zapList[key].action_name)].image !== undefined && (
                                <img
                                    src={imageServices[getIndexZap(imageServices, zapList[key].action_name)].image}
                                    alt={`${suggestions} logo`}
                                    style={{width: '30px', height: '30px', border: '1px solid black', marginRight: '10px'}}
                                />
                            )}
                            {imageServices.length > 0 && imageServices[getIndexZap(imageServices, zapList[key].reaction_name)].image !== undefined && (
                                <img
                                    src={imageServices[getIndexZap(imageServices, zapList[key].reaction_name)].image}
                                    alt={`${suggestions} logo`}
                                    style={{width: '30px', height: '30px', border: '1px solid black', marginRight: '10px'}}
                                />
                            )}
                            <p>{zapList[key].action_name} connected with {zapList[key].reaction_name}</p>
                            <button onClick={() => deleteZap(zapList[key].id)} style={styles.deleteButton}>Delete</button>
                            <button style={{position: 'absolute', right: '10%', backgroundColor: buttonStates[index] ? 'green' : 'red', color: 'white', width: '10%', height: '8%', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '40px', transition: 'background-color 0.3s ease', border: 'none',}} onClick={() => handleButtonClick(zapList[key].id, index)}>
                                <span style={{position: 'absolute', left: buttonStates[index] ? '10%' : '70%', transition: 'left 0.3s ease',}}>{buttonStates[index] ? 'on' : 'off'}</span>
                                <div style={{position: 'absolute', width: '40px', height: '40px', backgroundColor: buttonStates[index] ? 'green' : 'red', borderRadius: '50%', left: buttonStates[index] ? "60%" : "-5%", transition: 'background-color 0.3s ease, left 0.3s ease',}}></div>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <text>Loading</text>
            )}
        </>
    )
}

export default Zap;
