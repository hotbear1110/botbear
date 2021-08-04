require('dotenv').config()
const { ChatClient } = require("dank-twitch-irc");
const login = require('./connect/connect');

const cc = new ChatClient(login.client);

console.log("FeelsDankMan")
cc.on("ready", async () => {
    console.log("Successfully connected to chat")
    cc.joinAll(await login.channels())
});