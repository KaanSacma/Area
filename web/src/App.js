import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const App = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [logged, setLogged] = useState(JSON.parse(localStorage.getItem("logged")) || false);

    useEffect(() => {
        localStorage.setItem("logged", JSON.stringify(logged));
    }, [logged]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage setAccessToken={setAccessToken} logged={logged} setLogged={setLogged} />} />
                <Route path="/home" element={<HomePage accessToken={accessToken} setAccessToken={setAccessToken} setLogged={setLogged} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
