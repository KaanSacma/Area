import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomOpacityButton from '../CustomOpacityButton/CustomOpacityButton';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from react-navigation

const CustomNavigationBar = () => {
    const navigation = useNavigation(); // Get navigation from the hook

    return (
        <View style={styles.navigationBar}>
            <CustomOpacityButton
                source={require('../../assets/images/home.png')} // Replace with your actual icon source
                sourceSize={{ width: 30, height: 30 }}
                onPress={() => navigation.navigate('Home')} // Use navigation to navigate
                backColor={'transparent'}
            />
            <CustomOpacityButton
                source={require('../../assets/images/search.png')} // Replace with your actual icon source
                sourceSize={{ width: 30, height: 30 }}
                onPress={() => navigation.navigate('SearchAREA')} // Use navigation to navigate
                backColor={'transparent'}
            />
            <CustomOpacityButton
                source={require('../../assets/images/edit.png')} // Replace with your actual icon source
                sourceSize={{ width: 30, height: 30 }}
                onPress={() => navigation.navigate('EditAREA')} // Use navigation to navigate
                backColor={'transparent'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: 'transparent', // Customize the background color of the navigation bar
        width: '100%',
    },
});

export default CustomNavigationBar;
