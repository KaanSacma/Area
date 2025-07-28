import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import CustomButton from "../../components/CustomButton";

const RegisterScreen = ({navigation}) => {

    const handleCreateAccount = () => {
        navigation.navigate('CreateAccount');
    };

    const handleRegisterWithGoogle = () => {
        console.log('Registering with Google...');
    };

    const handleRegisterWithApple = () => {
        console.log('Registering with Apple...');
    };

    const handleSignIn = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.socialButtons}>
                <CustomButton
                    title="Continue with Google"
                    onPress={handleRegisterWithGoogle}
                    backColor="black"
                    titleColor="white"
                    buttonSize={{width: '100%', height: 50}}
                    roundSize={25}
                    source={require('../../assets/images/google-icon.png')}
                    sourceSize={{width: 30, height: 30}}
                    sourceLeft={10}
                />
                <CustomButton
                    title="Continue with Apple"
                    onPress={handleRegisterWithApple}
                    backColor="black"
                    titleColor="white"
                    buttonSize={{width: '100%', height: 50}}
                    roundSize={25}
                    source={require('../../assets/images/apple-icon.png')}
                    sourceSize={{width: 50, height: 50}}
                />
            </View>
            <View style={styles.row}>
                <View style={styles.lineLeft}/>
                <Text style={styles.lineText}>or</Text>
                <View style={styles.lineRight}/>
            </View>
            <CustomButton
                title="Create account"
                onPress={handleCreateAccount}
                backColor="black"
                titleColor="white"
                buttonSize={{width: '100%', height: 50}}
                roundSize={25}
            />
            <Text style={styles.condition}>By signing up, you agree to our Terms, Privacy and Policy</Text>
            <View style={styles.rowLogBack}>
                <Text style={styles.rowLog}>Have an account already ? </Text>
                <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.login}>Log in</Text>
                </TouchableOpacity>
            </View>
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
    socialButtons: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    socialButton: {
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    lineLeft : {
        borderBottomColor: '#A2A2A2',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '45%',
        marginRight: 10,
    },
    lineRight: {
        borderBottomColor: '#A2A2A2',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '45%',
        marginLeft: 10,
    },
    lineText: {
        position: 'absolute',
        top: -15,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingRight: 20,
        color: '#A2A2A2',
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 30,
        justifyContent: 'center',
    },
    condition: {
        color: '#A2A2A2',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 20,
    },
    rowLogBack: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 30,
        width: '87.5%',
    },
    rowLog: {
        color: '#A2A2A2',
        fontSize: 16,
        fontWeight: 'bold',
    },
    login: {
        color: '#004D95',
        fontSize: 16,
        fontWeight: 'bold',

    },
});

export default RegisterScreen;
