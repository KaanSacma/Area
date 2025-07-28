import React, { useState } from 'react';
import Backdrop from './Backdrop';
import register from "../../js/register";

const RegisterModal = ({ onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [date, setDate] = useState('');
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
                date,
                sex
            );
            if (response.error) {
                console.log('error', response.error);
                return;
            }
            resetForm();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Backdrop onClick={onClose} />
            <div style={styles.container}>
                <h1>Create Account</h1>
                <input
                    type="text"
                    style={styles.input}
                    placeholder="First Name"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    style={styles.input}
                    placeholder="Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    type="text"
                    style={styles.input}
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    style={styles.input}
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    style={styles.input}
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    style={styles.input}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
                <input
                    type="date"
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input
                    type="text"
                    style={styles.input}
                    placeholder="Sex"
                    name="sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                />
                <button style={styles.registerButton} onClick={handleCreateAccount}>
                    Create Account
                </button>
                <button style={styles.closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </>
    );
};

const styles = {
    registerButton: {
        width: '50%',
        height: '40px',
        border: '1px solid gray',
        backgroundColor: '#000000',
        borderRadius: '10px',
        color: '#ffffff',
    },
    closeButton: {
        position: 'fixed',
        top: '2%',
        left: '3%',
        width: '13%',
        border: '1px solid gray',
        backgroundColor: '#000000',
        borderRadius: '25px',
        color: '#ffffff',
    },
    container: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
      width: '30%',
      height: '500px',
    },
    input: {
      width: '80%',
      height: '40px',
      border: '1px solid gray',
      marginBottom: '20px',
      paddingLeft: '10px',
    },
  };



export default RegisterModal;
