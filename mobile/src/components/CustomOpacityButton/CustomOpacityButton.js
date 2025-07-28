import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

const CustomOpacityButton = ({ title, onPress, backColor = '#1E90FF', titleColor = '#fff', buttonSize = { width: 100, height: 50 }, roundSize = 0, source, sourceSize = { width: 20, height: 20 }, sourceLeft = 0 }) => {
    const buttonStyle = {
        ...styles.button,
        backgroundColor: backColor,
        width: buttonSize.width,
        height: buttonSize.height,
        borderRadius: roundSize,
    };
    const titleStyle = {
        ...styles.buttonText,
        color: titleColor,
    };
    const sourceStyle = {
        ...styles.source,
        width: sourceSize.width,
        height: sourceSize.height,
        left: '50%',
        marginLeft: -sourceSize.width / 2,
        top: '50%',
        marginTop: -sourceSize.height / 2,
    };

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            {source && <Image source={source} style={sourceStyle} />}
            <Text style={titleStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },
    source: {
        position: 'absolute',
    }
});

export default CustomOpacityButton;
