const handleDiscordActionSelected = (event, setSelectedDiscordChannel, setDiscordActionSelected) => {
    if (event.type === "change") {
        setSelectedDiscordChannel(event.target.value);
        console.log(event.target.value);
        if (event.target.value === "") {
            alert("Please select an action")
            setDiscordActionSelected(false);
            return;
        }
        setDiscordActionSelected(true);
    }
}

const handleLoginWithDiscord = async (setDiscordIsLogged) => {
    //window.open(`${process.env.REACT_APP_API_URL}/auth/discord/login`, '_self');
    setDiscordIsLogged(true);
    console.log("Discord logged");
};

const handleDiscordChannelChange = (event, setSelectedDiscordChannel, setDiscordDone) => {
    setSelectedDiscordChannel(event.target.value);
    console.log(event.target.value);
    setDiscordDone(true);
};

export {handleLoginWithDiscord, handleDiscordActionSelected, handleDiscordChannelChange};