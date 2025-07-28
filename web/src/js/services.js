import axios from 'axios';

const getListServices = async (access_token) => {
    if (!access_token) {
        return null;
    }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/services/list`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${access_token}`
            },
        });
        return await response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getImagesServices = async (access_token) => {
    if (!access_token) {
        return null;
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/services/images`, {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${access_token}`
        },
    });
    return await response.data;
}

const getReactionsServices = async (access_token) => {
    if (!access_token) {
        return null;
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/services/reactions`, {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${access_token}`
        },
    });
    return await response.data;
}

const getActionsServices = async (access_token) => {
    if (!access_token) {
        return null;
    }
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/services/actions`, {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${access_token}`
        },
    });
    return await response.data;
}

function toBase64(arr) {
    return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

function getIndexZap(array, value) {
    if (!array || !value)
        return (0);
    const toCheck = value.replace(/ /g, '')
    for (let i = 0; i < array.length; i++) {
        const name = array[i].name.replace(/ /g, '');
        if (name === toCheck) {
            console.log("index: " + i);
            return i;
        }
    }
    return -1;
}

export { getListServices, getImagesServices, getReactionsServices, getActionsServices, toBase64, getIndexZap};
