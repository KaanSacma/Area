import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button, FlatList, ScrollView, Image, Switch} from 'react-native';
import CustomOpacityButton from "../../components/CustomOpacityButton";
import CustomNavigationBar from "../../components/CustomNavigationBar";
import { LogBox } from 'react-native';
import axios from "axios";
import {getImagesServices, getIndexZap, getListServices, toBase64} from "../../js/services";

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.'
]);

const EditAREAScreen = ({ navigation, AccessToken }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [zapListFront, setZapListFront] = useState([]);
    const [zapListChanged, setZapListChanged] = useState(false);
    const [zapList, setZapList] = useState([]);
    const [serviceImages, setServiceImages] = useState({});

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

    const handleDeleteZap = (id) => {
        axios.delete(`https://areaotek.azurewebsites.net/services/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${AccessToken}`,
            }
        })
            .then(response => {
                setZapListChanged(!zapListChanged);
            })
            .catch(error => {
                console.error('Error when you try to delete :', error);
            });
    }

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

    const openProfileSection = () => {
        setProfileOpen(true);
    };

    const closeProfileSection = () => {
        setProfileOpen(false);
    };
    const [dropdownOptions, setDropdownOptions] = useState([]);

    return (
        <View style={styles.Maincontainer}>
            {profileOpen && (
                <View style={styles.profileSection}>
                    <Text style={styles.profileText}>Profile Content</Text>
                    <CustomOpacityButton
                        onPress={closeProfileSection}
                        title={'Close Profile'}
                        backColor={'grey'}
                        titleColor={'white'}
                        buttonSize={{ width: '95%', height: 50 }}
                        roundSize={25}
                        sourceSize={{ width: 30, height: 30 }}
                        sourceLeft={10}
                    />
                    <View style={styles.logOutButtonContainer}>
                        <CustomOpacityButton title={'Logout'} onPress={() => navigation.navigate('Login')} backColor={'red'} titleColor={'white'} buttonSize={{ width: '95%', height: 50 }} roundSize={25} />
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
                        buttonSize={{ width: '50%', height: 50 }}
                        roundSize={25}
                        sourceSize={{ width: 30, height: 30 }}
                        sourceLeft={10}
                    />
                ) : null}
            </View>
            <View style={styles.zapListContainer}>
                {zapListFront.map((zap) => (
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
                        <CustomOpacityButton
                            onPress={() => handleDeleteZap(zap.id)}
                            title={'X'}
                            backColor={'black'}
                            titleColor={'white'}
                            buttonSize={{ width: 40, height: 40 }}
                            roundSize={20}
                            sourceSize={{ width: 25, height: 25 }}
                            sourceLeft={25}
                        />
                    </View>
                ))}
            </View>

            <View style={styles.NavigationBarContainer}>
                <CustomNavigationBar />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    zapListContainer: {
        flex: 1, // Let the list take available space
        position: 'absolute',
        top: '10%', // Adjust as needed
        left: 20, // Adjust as needed
        width: '100%', // Adjust as needed
        height: '80%', // Adjust as needed
        zIndex: 2, // Adjust as needed (higher value means it will appear on top)
    },
    zapsContainer: {
        zIndex: 30,
        width: 350,
        marginBottom: 20,
    },
    yourFlatListStyle: {
        flex: 1,
        justifyContent: 'center', // Center items vertically
        zIndex: 1, // Set a zIndex for the FlatList itself
    },
    scrollContainer2: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        maxHeight: 700,
        position: 'static',
        justifyContent: 'center',
        alignItems: "center",
    },
    scrollcontainer: {
        backgroundColor: 'purple',
    },
    Maincontainer: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    inputContainer1: {
        width: '100%',
        marginBottom: 20,
    },

    profileSection: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        padding: 10,
        width: 300,
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 10,
    },
    profileButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 5,
        zIndex: 10,
    },
    logOutButtonContainer: {
        position: 'absolute',
        bottom: 10,
        left: '25%',
    },
    scrollContainer: {
        flex: 1,
    },
    NavigationBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        width: 420,
        borderTopWidth: 1.5,
        borderTopColor: 'grey',
    },
    zapRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    zapIsSet: {
        fontSize: 18,
        textAlign: 'center',
        color: 'green',
    },
    profileText: {
        color: 'white',
        fontSize: 16,
    },
    profileButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    closeProfileButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    setZapButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        width: '95%',
        height: 50,
        roundSize: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditAREAScreen;
