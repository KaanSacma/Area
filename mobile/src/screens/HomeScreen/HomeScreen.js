import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Button, FlatList, Switch, Image} from 'react-native';
import CustomButton from "../../components/CustomButton";
import CustomOpacityButton from "../../components/CustomOpacityButton";
import CustomNavigationBar from "../../components/CustomNavigationBar";
import {getListServices, getImagesServices, toBase64, getIndexZap} from "../../js/services";

import ZapListContext from '../../components/ZaptListContext/ZaptListContext';
import {useContext} from "react";
import axios from "axios";

const HomeScreen = ({navigation, AccessToken}) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [zapList, setZapList] = useState([]);
    const [zapListChanged, setZapListChanged] = useState(false);
    const [serviceImages, setServiceImages] = useState({});
    const [zapListFront, setZapListFront] = useState([]);

    useEffect(() => {
        axios.get('https://areaotek.azurewebsites.net/services/zaps', {
            headers: {
                Authorization: `Bearer ${AccessToken}`,
            },
        }).then((response) => {
            const zapsData = response.data;
            setZapListFront(zapsData);
        }).catch((error) => {
            console.error('Error when you try to get zaps :', error);
        });
    }, [zapListChanged, AccessToken]);

    useEffect(() => {
        axios.get('https://areaotek.azurewebsites.net/services/zaps', {
            headers: {
                Authorization: `Bearer ${AccessToken}`,
            },
        }).then((response) => {
            const zapsData = response.data;
            setZapList(zapsData);
            // Fetch service images
            getListServices(AccessToken).then((res) => {
                getImagesServices(AccessToken).then((resImg) => {
                    const imageList = [];
                    for (let i = 0; i < resImg.length; i++) {
                        const image = toBase64(resImg[i].data);
                        imageList.push({image : `data:image/png;base64,${image}`, name: res[i]});
                    }
                    setServiceImages(imageList);
                });
            });
        }).catch((error) => {
            console.error('Error when you try to get zaps :', error);
        });
    }, [zapListChanged, AccessToken]);

    const toggleSwitch = (item) => {
        console.log('item: before', item);
        const updatedZapList = zapList.map(zap => {
            console.log('zap id: before', zap.id);
            console.log('item id: before', item.id);
            if (zap.id === item.id) {
                const newStatus = !zap.status; // Update status property
                const updatedZap = {...zap, status: newStatus}; // Create an updated Zap object
                console.log('Zaps status :', zap.status);
                console.log('item status :', item.status);
                axios.post(`https://areaotek.azurewebsites.net/services/switch/status/${zap.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${AccessToken}`,
                    }
                })
                    .then(response => {
                        setZapList(prevZapList => {
                            const updatedList = prevZapList.map(z => (z.id === updatedZap.id ? updatedZap : z));
                            return updatedList;
                        });
                    })
                    .catch(error => {
                        console.error('Error when you switch the state of the Zap : ', error);
                    });
                return updatedZap; // Return the updated Zap object
            }
            return zap;
        });
        setZapList(updatedZapList);
    }


    const openProfileSection = () => {
        setProfileOpen(true);
    };

    const closeProfileSection = () => {
        setProfileOpen(false);
    };

    return (
        <View style={styles.container}>
            {profileOpen && (
                <View style={styles.profileSection}>
                    <Text style={styles.profileText}>Profile Content</Text>
                    <CustomOpacityButton
                        onPress={closeProfileSection}
                        title={'Close Profile'}
                        backColor={'grey'}
                        titleColor={'white'}
                        buttonSize={{width: '95%', height: 50}}
                        roundSize={25}
                        sourceSize={{width: 30, height: 30}}
                        sourceLeft={10}
                    />
                    <View style={styles.logOutButtonContainer}>
                        <CustomButton title={'Logout'} onPress={() => navigation.navigate('Login')} backColor={'red'}
                                      titleColor={'white'} buttonSize={{width: '95%', height: 50}} roundSize={25}/>
                    </View>
                </View>
            )}

            <View style={styles.profileButtonContainer}>
                {!profileOpen ? (
                    <CustomOpacityButton
                        onPress={openProfileSection}
                        title={'P'}
                        backColor={'black'}
                        titleColor={'white'}
                        buttonSize={{width: '50%', height: 50}}
                        roundSize={25}
                        sourceSize={{width: 30, height: 30}}
                        sourceLeft={10}
                    />
                ) : null}
            </View>

            {Object.keys(zapList).length > 0 ? (
                <View style={styles.zapListContainer}>
                    {zapList.map((zap) => (
                        <View style={styles.zapRow} key={zap.id}>
                            {serviceImages.length > 0 && serviceImages[getIndexZap(serviceImages, zap.action_name)].image !== undefined && (
                                <Image
                                    style={{width: 30, height: 30}} // Adjust dimensions as needed
                                    source={{uri: serviceImages[getIndexZap(serviceImages, zap.action_name)].image}}
                                />
                            )}
                            <Text style={styles.zapIsSet} > {zap.action_name} {">"} {zap.reaction_name}</Text>
                            {serviceImages.length > 0 && serviceImages[getIndexZap(serviceImages, zap.reaction_name)].image !== undefined && (
                                <Image
                                    style={{width: 30, height: 30, marginLeft: 10}} // Adjust dimensions as needed
                                    source={{uri: serviceImages[getIndexZap(serviceImages, zap.reaction_name)].image}}
                                />
                            )}
                            <Switch
                                trackColor={{false: "red", true: "green"}}
                                thumbColor={zap.status ? "white" : "white"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch(zap)}
                                value={zap.status}
                                style={{marginLeft: 20}}
                            />
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <Text style={styles.centerText}>No Areas Created Press on the "+".</Text>
                    <CustomOpacityButton
                        title={'+'}
                        backColor={'black'}
                        titleColor={'white'}
                        buttonSize={{width: '70%', height: 50}}
                        roundSize={25}
                        sourceSize={{width: 30, height: 30}}
                        sourceLeft={10}
                        onPress={() => navigation.navigate('SearchAREA')} // Use navigation to navigate
                    />
                </View>
            )}

            <View style={styles.NavigationBarContainer}>
                <CustomNavigationBar/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    profileSection: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 5,
        padding: 10,
        width: 300,
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 10,
    },
    profileText: {
        color: 'white',
        fontSize: 16,
    },
    profileButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    profileButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 5,
        zIndex: 1,
    },
    closeProfileButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    logOutButtonContainer: {
        position: 'absolute',
        bottom: 10,
        left: '25%',
    },
    NavigationBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around', // Adjust as needed
        alignItems: 'center',
        height: 60, // Add a specific height for the navigation bar
        width: 420, // Make sure it spans the full width
        borderTopWidth: 1.5, // Optional: Add a border at the top of the navigation bar
        borderTopColor: 'grey', // Optional: Customize the border color
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerText: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    zapListContainer: {
        flex: 1, // Let the list take available space
        position: 'absolute',
        top: '10%', // Adjust as needed
        left: 20, // Adjust as needed
        width: '100%', // Adjust as needed
        height: '80%', // Adjust as needed
        zIndex: 2, // Adjust as needed (higher value means it will appear on top)
    },
    zapRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        alignItems: 'center',
    },
    zapIsSet: {
        fontSize: 20    ,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
    },
});
export default HomeScreen;
