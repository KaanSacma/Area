import axios from 'axios';

const login = async (username, password) => {
    const jsonBody = JSON.stringify({
        username,
        password,
    });

    const response = await axios.post(process.env.API_URL + `/auth/login`, jsonBody, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });

    return await response.data;
}

export default login;
