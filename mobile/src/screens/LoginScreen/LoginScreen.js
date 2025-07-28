import React, { useState } from 'react';
import {SafeAreaView, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import login from '../../js/login';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const LoginScreen = ({navigation, setTokenAccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            if (response.access_token !== undefined) {
                setTokenAccess(response.access_token);
                setUsername('');
                setPassword('');
                await navigation.navigate('Home');
            } else {
                console.error('Erreur lors de la connexion');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Area
            </Text>
            <CustomInput
                inputValue={username}
                setInputValue={setUsername}
                inputColor={'#545F71'}
                borderColor={'#545F71'}
                placeholder="Username"
                placeholderColor={'#545F71'}
                source={require('../../assets/images/mail.png')}
                sourceAction={() => {}}
                size={{width: '95%', height: 50}}

            />
            <CustomInput
                inputValue={password}
                setInputValue={setPassword}
                inputColor={'#545F71'}
                borderColor={'#545F71'}
                placeholder="● ● ● ● ● ●"
                placeholderColor={'#545F71'}
                secureTextEntry={true}
                source={require('../../assets/images/lock.png')}
                sourceAction={() => {}}
                size={{width: '95%', height: 50}}
            />
            <CustomButton title={'Login'} onPress={handleLogin} backColor={'black'} titleColor={'white'} buttonSize={{width: '95%', height: 50}} roundSize={25}/>
            <View style={styles.line}/>
            <CustomButton title={'Register'} onPress={handleRegister} backColor={'black'} titleColor={'white'} buttonSize={{width: '95%', height: 50}} roundSize={25}/>
            <View style={styles.row}>
                <Text style={{color: 'black'}}>New user? </Text>
                <TouchableOpacity onPress={handleRegister}>
                    <Text style={{color: 'black'}}>Register</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    title: {
        position: 'relative',
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
        bottom: 50,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    line : {
        borderBottomColor: '#A2A2A2',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '90%',
        marginVertical: 10,
        paddingTop: 10,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    }
});

export default LoginScreen;
