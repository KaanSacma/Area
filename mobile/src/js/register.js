import axios from 'axios';

const register = async (firstname, lastname, username, email, password, birthdate, sex) => {
    const jsonBody = JSON.stringify({
        username: username,
        password: password,
        email: email,
        firstname: firstname,
        lastname: lastname,
        birthdate: birthdate,
        sex: sex
    });

    const response = await axios.post(process.env.API_URL + `/auth/register`, jsonBody, {
        headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        },
    });

    return await response.data;
}

export default register;
