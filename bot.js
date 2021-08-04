require('dotenv').config()
const { ChatClient } = require("dank-twitch-irc");
const login = require('./Connect/connect');

const cc = new ChatClient(login.client);

cc.on