require('dotenv').config()
const { ChatClient } = require("dank-twitch-irc");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js")
const requireDir = require("require-dir")
const _ = require("underscore")

const cc = new ChatClient(login.client);


cc.on("ready", async () => {
    console.log("Successfully connected to chat")
    cc.joinAll(await login.channels())
});

cc.on("JOIN", (msg) => {
    console.log(`* Joined ${msg.channelName}`)
});

cc.connect();

cc.me("hotbear1110", "test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test")