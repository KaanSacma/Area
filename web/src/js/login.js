import axios from 'axios';

const login = async (username, password) => {
    const jsonBody = JSON.stringify({
        username,
        password,
    });

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, jsonBody, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });

    return await response.data;
}

const getUserId = async (access_token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Authorization": "Bearer " + access_token
        }
    });
    const userId = await response.data.id;
    console.log("userId", userId);
    console.log("response.data", response.data);
    return await userId;
}

export { login, getUserId };
