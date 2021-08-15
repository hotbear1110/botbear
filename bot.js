require('dotenv').config()
const tmi = require("tmi.js");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js")
const requireDir = require("require-dir");

const cc = new tmi.client(login.options)


cc.on('message', onMessageHandler);
cc.on('connected', onConnectedHandler);

cc.connect()

async function onMessageHandler(channel, user, msg, self) {
    if (self) {
        return;
    }
    if (channel === "#hotbear1110") {
        console.log("message")
    }
    let input = msg.split(" ");
    if (input[1] !== "say") {
        input = msg.toLowerCase().split(" ");
    }

    if (user['user-id'] === process.env.TWITCH_UID) { return; }


    if (input[0] !== "bb") {
        return;
    }

    if (channel === "#forsen") {
        return;
    }

    if (channel === "#botbear1110") {
        channel = "#forsen"
    }
    
    const usernamePhrase = await tools.banphrasePass(user.username, channel);

    if (usernamePhrase.banned) {
        cc.say(channel, `[Banphrased Username] cmonBruh `);
        return;
    }


    const commands = requireDir("./commands");

    if (typeof commands[input[1]] === "undefined") {
        console.log("undefined")
        return;
    }

    let realchannel = channel.substring(1)
    let result = await commands[input[1].toLowerCase()].execute(realchannel, user, input)


    if (!result) {
        return;
    }

    const userCD = new tools.Cooldown(user, input);

    if ((await userCD.setCooldown()).length) { return; }

    const banPhrase = await tools.banphrasePass(result, channel);

    if (channel === "#forsen") {
        channel = "#botbear1110"
    }

    if (banPhrase.banned) {
        cc.say(channel, `[Banphrased] cmonBruh `);
        return;
    }

    cc.say(channel, result);

};
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
module.exports = { cc }