import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import register from "../../js/register";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

const CreateAccountScreen = ({navigation}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [birthdate, setDate] = useState('');
    const [sex, setSex] = useState('');

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirm('');
        setDate('');
        setSex('');
    }

    const handleCreateAccount = async () => {
        if (password !== confirm) {
            return { error: 'Passwords do not match' };
        }
        try {
            const response = await register(
                firstName,
                lastName,
                username,
                email,
                password,
                birthdate,
                sex
            );
            if (response.error) {
                console.log('error', response.error);
                return;
            }
            resetForm();
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.topLeft} onPress={() => navigation.goBack()}>
                <Image source={require('../../assets/images/cross.png')}
                       style={styles.cross}
                       resizeMode="contain"
                       testID="create-account-screen-cross"/>
            </TouchableOpacity>
            <CustomInput
                inputValue={firstName}
                setInputValue={setFirstName}
                placeholder="First Name"
                placeholderColor="grey"
                size={{width: '85%', height: 50}}
            />
            <CustomInput
                inputValue={lastName}
                setInputValue={setLastName}
                placeholder="Last Name"
                placeholderColor="grey"
                size={{width: '85%', height: 50}}
            />
            <CustomInput
                inputValue={email}
                setInputValue={setEmail}
                placeholder="Email"
                placeholderColor="grey"
                size={{width: '85%', height: 50}}
                textInputType={'email-address'}
            />
            <CustomInput
                inputValue={username}
                setInputValue={setUsername}
                placeholder="Username"
                placeholderColor="grey"
                size={{width: '85%', height: 50}}
            />
            <CustomInput
                inputValue={password}
                setInputValue={setPassword}
                placeholder="Password"
                placeholderColor="grey"
                secureTextEntry={true}
                size={{width: '85%', height: 50}}
            />
            <CustomInput
                inputValue={confirm}
                setInputValue={setConfirm}
                placeholder="Confirm Password"
                placeholderColor="grey"
                secureTextEntry={true}
                size={{width: '85%', height: 50}}
            />
            <CustomInput
                inputValue={birthdate}
                setInputValue={setDate}
                placeholder="YYYY/MM/DD"
                placeholderColor="grey"
                size={{width: '85%', height: 50}}
                textInputType={'numeric'}
            />
            <View style={{width: '85%'}}>
                <CustomInput
                    inputValue={sex}
                    setInputValue={setSex}
                    placeholder="Sex"
                    placeholderColor="grey"
                    size={{width: '30%', height: 50}}
                />
            </View>
            <CustomButton
                title="Create Account"
                onPress={handleCreateAccount}
                backColor="black"
                titleColor="white"
                buttonSize={{width: '90%', height: 50}}
                roundSize={25}
            />
            <Text style={styles.condition}>By signing up, you agree to our Terms, Privacy and Policy</Text>
        </View>
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
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    condition: {
        color: '#A2A2A2',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 20,
    },
    cross: {
        width: 20,
        height: 20,
    },
    topLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
    }
});

export default CreateAccountScreen;
