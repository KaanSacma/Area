import React from 'react';
import {
    View,
    Image,
    TextInput,
    StyleSheet,
    Pressable
} from 'react-native';

const CustomInput = ({inputValue, setInputValue, inputColor='grey', backColor='white', borderColor, placeholder, placeholderColor="lightgrey", secureTextEntry=false, source, sourceAction, size={width: 100, height: 50}, textInputType="default"}) => {
    const inputStyle = [styles.container, {backgroundColor: backColor, borderColor: borderColor, width: size.width, height: size.height}];
    const textInputStyle = {color: inputColor, paddingLeft: source ? 25 : 0};

    return (
        <View style={inputStyle}>
            {source &&
                <Pressable style={styles.press} onPress={sourceAction}>
                    <Image source={source}
                           style={styles.source}
                           resizeMode="contain"
                           testID="custom-input-left-image"/>
                </Pressable>
            }
            <TextInput
                value={inputValue}
                onChangeText={(e) => setInputValue(e)}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                style={textInputStyle}
                secureTextEntry={secureTextEntry}
                testID="custom-input-textinput"
                keyboardType={textInputType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    }
});

export default CustomInput;
