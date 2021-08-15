require('dotenv').config()
const tmi = require("tmi.js");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js")
const requireDir = require("require-dir");

const cc = new tmi.client(login.options)


cc.on('message', onMessageHandler);
cc.on('connected', onConnectedHandler);

cc.connect()

const talkedRecently = new Set();

async function onMessageHandler(channel, user, msg, self) {
    if (self) {
        return;
    }
    if (channel === "#hotbear1110") {
        console.log("message")
    }
    let input = msg.split(" ");
    let realcommand = input[1]
    if (realcommand !== "say") {
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

    const commands = requireDir("./commands");

    if (typeof commands[realcommand] === "undefined") {
        console.log("undefined")
        return;
    }

    const globalCD = new tools.Cooldown("global", "global", 1000);

    if ((await globalCD.setCooldown()).length) { return; }

    const usernamePhrase = await tools.banphrasePass(user.username, channel);

    if (usernamePhrase.banned) {
        cc.say(channel, `[Banphrased Username] cmonBruh `);
        return;
    }


    let realchannel = channel.substring(1)
    let result = await commands[realcommand].execute(realchannel, user, input)


    if (!result) {
        return;
    }

    if (commands[realcommand].ping == true) {
        result = `${user['display-name']} ${result}`
    }

    const userCD = new tools.Cooldown(user, input, 5000);

    if ((await userCD.setCooldown()).length) { return; }

    const banPhrase = await tools.banphrasePass(result, channel);

    if (channel === "#forsen") {
        channel = "#botbear1110"
    }

    if (user['user-id'] != "process.env.TWITCH_OWNERUID") {
        if (talkedRecently.has(channel)) { return; }

        talkedRecently.add(channel);

        let timeout = 1000;

        setTimeout(() => {
            talkedRecently.delete(channel);
        }, timeout);
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