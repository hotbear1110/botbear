require('dotenv').config()
const tmi = require("tmi.js");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js")
const requireDir = require("require-dir");

const cc = new tmi.client(login.options)


cc.on("message", onMessageHandler);
cc.on('connected', onConnectedHandler);

cc.connect()

async function onMessageHandler(channel, user, msg, self) {
    if (self) {
        return;
    }
    const commandName = msg.toLowerCase().trim();
    let input = msg.toLowerCase().split(" ");

    if (user['user-id'] === process.env.TWITCH_UID) { return; }

    const testPhrase = await tools.banphrasePass(user['user-id'], channel);

    if (testPhrase.banned) {
        cc.say(channel, `[Banphrased Username] cmonBruh `);
        return;
    }

    if (input[0] !== "bb") {
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

    cc.say(channel, `${user.username}, ` + result);

};
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}