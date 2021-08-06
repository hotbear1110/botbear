require('dotenv').config()
const { ChatClient } = require("dank-twitch-irc");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js")

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

    if (msg.senderUserID === process.env.TWITCH_UID) {return;}
    
    if (input[0].slice(0,2) !== "``") {
        return;
    }

    input[0] = input[0].substr(2,input[0].length);


    const commands = requireDir("./commands");
    

    if (typeof commands[input] === "undefined") {
        return;
    }


    let result = await commands[input[0].toLowerCase()].execute(msg, input)


    if (!result) {
        return;
    }

    const userCD = new tools.Cooldown(msg, input);
  
    if ((await userCD.setCooldown()).length) { return; }

    cc.say(msg.channelName, `${msg.senderUsername}, ` + result);

});