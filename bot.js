require('dotenv').config()
const { ChatClient } = require("dank-twitch-irc");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js")
const requireDir = require("require-dir")

const cc = new ChatClient(login.client);


cc.on("ready", async () => {
    console.log("Successfully connected to chat")
    cc.joinAll(await login.channels())
});

cc.on("JOIN", (msg) => {
    console.log(`* Joined ${msg.channelName}`)
});

cc.connect();


cc.on("PRIVMSG", async (msg) => {
    const commandName = msg.messageText.toLowerCase().trim();
    let input = msg.messageText.toLowerCase().split(" ");

    if (msg.senderUserID === process.env.TWITCH_UID) { return; }

    const testPhrase = await tools.banphrasePass(msg.senderUsername, msg.channelName);

    if (testPhrase.banned) {
        cc.say(channelName, `[Banphrased Username] cmonBruh `);
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


    let result = await commands[input[1].toLowerCase()].execute(msg, input)


    if (!result) {
        console.log(result)
        console.log("yes")
        return;
    }

    const userCD = new tools.Cooldown(msg, input);

    if ((await userCD.setCooldown()).length) { return; }

    cc.say(msg.channelName, `${msg.senderUsername}, ` + result);

});