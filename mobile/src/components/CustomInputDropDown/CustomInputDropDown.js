import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';

const CustomInputDropDown = ({
                                 inputValue,
                                 setInputValue,
                                 onInputChange,
                                 inputColor = 'grey',
                                 backColor = 'white',
                                 borderColor,
                                 placeholder,
                                 placeholderColor = "lightgrey",
                                 secureTextEntry = false,
                                 source,
                                 sourceAction,
                                 imageSource, // New prop for image source
                                 inputSize,
                                 textInputType = "default",
                                 dropdownOptions = [{}]
                             }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const inputStyle = [
        styles.container,
        {
            backgroundColor: backColor,
            borderColor: borderColor,
            width: inputSize.width, // Adjust width
            height: inputSize.height, // Adjust height
        }
    ];
    const textInputStyle = { color: inputColor, paddingLeft: source ? 25 : 0 };

    const filterOptions = (query) => {
        if (query.trim() === '') {
            return dropdownOptions;
        }
        return dropdownOptions.filter(option =>
            option.label.toLowerCase().includes(query.toLowerCase())
        );
    };

    return (
        <View style={inputStyle}>
            {source &&
                <TouchableOpacity style={styles.press} onPress={sourceAction}>
                    <Image source={source}
                           style={styles.source}
                           resizeMode="contain"
                           testID="custom-input-left-image" />
                </TouchableOpacity>
            }
            <TextInput
                value={inputValue}
                onChangeText={text => {
                    setInputValue(text);
                    setShowDropdown(true);
                }}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                style={textInputStyle}
                secureTextEntry={secureTextEntry}
                testID="custom-input-textinput"
                keyboardType={textInputType}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setShowDropdown(false)}
            />
            {showDropdown && (
                <FlatList
                    data={filterOptions(inputValue)}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setInputValue(item.label);
                                setShowDropdown(false);
                                if (typeof onInputChange === 'function') {
                                    onInputChange(item.label);
                                }
                            }}
                            style={[styles.dropdownItem, { zIndex: 1 }]} // Set a higher zIndex
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {item.image && (
                                    <Image
                                        source={{uri:item.image}}
                                        style={{ width: 25, height: 25, marginRight: 5 }} // Adjust image size and margin as needed
                                        resizeMode="contain"
                                    />
                                )}
                                <Text>{item.label}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={[styles.dropdownList, { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 0 }]} // Set position to absolute, top: 0, left: 0, right: 0
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '80%',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    source: {
        position: 'absolute',
        width: 20,
        height: 20,
        left: 10,
        top: 15,
    },
    press: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownList: {
        position: 'absolute',
        width: '80%',
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'white',
        maxHeight: 150,
        top: 35,
        zIndex: 5,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
    },
});

export default CustomInputDropDown;
