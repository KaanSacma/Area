import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import {login} from "../../js/login";
import axios from "axios";

const LoginPage = ({setAccessToken, logged, setLogged}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleRegister = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            if (response.error) {
                console.error('error', response.error);
                return;
            }
            setAccessToken(response.access_token);
            setLogged(true);
            navigate('/home');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (logged) {
            navigate('/home');
        }
    }, [logged, navigate]);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                The future of
            </h1>
            <h1 style={styles.title}>
                computing
            </h1>
            <h1 style={styles.logoArea}>AREA</h1>
            <input
                type="text"
                style={styles.username}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                style={styles.password}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button style={styles.loginButton} onClick={handleLogin}>Login</button>
            <div style={styles.bar}></div>
            <button style={styles.registerButton} onClick={handleRegister}>Register</button>
            <text style={styles.otekText}>Made by Otek</text>
            {showModal && <RegisterModal onClose={handleCloseModal} />}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    input: {
        width: '100%',
        height: '40px',
        border: '1px solid gray',
        marginBottom: '20px',
        paddingLeft: '10px',
    },
    username: {
        position: 'relative',
        marginTop: '100px',
        left: '20%',
        width: '20%',
        height: '40px',
        border: '1px solid gray',
    },
    password: {
        position: 'relative',
        marginTop: '30px',
        left: '20%',
        width: '20%',
        height: '40px',
        border: '1px solid gray',
    },
    title: {
        position: 'relative',
        fontSize: '55px',
        marginBottom: '-30px',
        textAlign: 'center',
        left: '20%',
    },
    logoArea: {
        position: 'absolute',
        fontSize: '55px',
        textAlign: 'center',
        left: '25%',
        top: '35%',
    },
    loginButton: {
        position: 'relative',
        marginTop: '30px',
        left: '20%',
        width: '20%',
        height: '40px',
        border: '1px solid gray',
        backgroundColor: '#000000',
        borderRadius: '25px',
        color: '#ffffff',
    },
    loginGoogle: {
        position: 'relative',
        marginTop: '30px',
        left: '20%',
        width: '20%',
        height: '40px',
        border: '1px solid gray',
        backgroundColor: '#000000',
        borderRadius: '25px',
        color: '#FFFFFF',
    },
    googleLogo: {
        position: 'relative',
        width: '20px',
        height: '20px',
        alignItems: 'left',
        right: '20px',
    },
    loginApple: {
        position: 'relative',
        marginTop: '30px',
        left: '20%',
        width: '20%',
        height: '40px',
        border: '1px solid gray',
        backgroundColor: '#000000',
        borderRadius: '25px',
        color: '#ffffff',
    },
    bar: {
        position: 'relative',
        marginTop: '30px',
        left: '20%',
        width: '20%',
        height: '1px',
        backgroundColor: '#A2A2A2',
    },
    registerButton: {
        position: 'relative',
        marginTop: '30px',
        left: '20%',
        width: '20%',
        height: '40px',
        border: '1px solid gray',
        backgroundColor: '#000000',
        borderRadius: '25px',
        color: '#ffffff',
    },
    otekText: {
        position: 'relative',
        marginTop: '10px',
        left: '27%',
        width: '20%',
        height: '40px',
        fontSize: '15px',
        color: '#A2A2A2',
    },
};

export default LoginPage;
