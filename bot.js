require('dotenv').config()
const tmi = require("tmi.js");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js")
const regex = require('./tools/regex.js');
const requireDir = require("require-dir");

const cc = new tmi.client(login.options)


cc.on('message', onMessageHandler);
cc.on('connected', onConnectedHandler);

cc.connect()

const talkedRecently = new Set();
let oldmessage = ""

async function onMessageHandler(channel, user, msg, self) {
    try {
    if (channel == "#botbear1110") {
         console.log(`${user.username}: ${msg}`)
    }
    const userList = await tools.query(`SELECT * FROM Users WHERE username=?`, [user.username])

    if (!userList.length && user.username != null) {
        await tools.query('INSERT INTO Users (username, uid, permission) values (?, ?, ?)', [user.username, user["user-id"], 100]);
    }

    if (self) {
        return;
    }
    if (channel === "#hotbear1110") {
        console.log("message")
    }
    let input = msg.split(" ");
    const Alias = new tools.Alias(msg);
    input = msg.replace(Alias.getRegex(), Alias.getReplacement()).split(' ');
    let realcommand = input[1]
    if (realcommand !== "say" && realcommand !== "channel") {
        input = msg.toLowerCase().split(" ");
    }

    if (user['user-id'] === process.env.TWITCH_UID) { return; }


    if (input[0] !== "bb" && input[0].toLowerCase() !== "forsenbb") {
        return;
    }
    // If yabbes chat want to disable other commands ->
    if (channel === "#yabbe") {
        if (realcommand !== "gametime" && realcommand !== "channel" && realcommand !== "notify" && realcommand !== "remove" && realcommand !== "myping" && realcommand !== "ping" && realcommand !== "commands" && realcommand !== "bot" && realcommand !== "suggest") {
            return;
        }
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

    if (user['user-id'] !== process.env.TWITCH_OWNERUID) {

        if (talkedRecently.has(channel)) { return; }

        talkedRecently.add(channel);

        let timeout = 1250;

        setTimeout(() => {
            talkedRecently.delete(channel);
        }, timeout);
    }

    const usernamePhrase = await tools.banphrasePass(user.username, channel);

    if (usernamePhrase.banned) {
        cc.say(channel, `[Banphrased Username] cmonBruh `);
        return;
    }
    const badUsername = user.username.match(regex.racism);
    if (badUsername != null) {
        cc.say(channel, `[Bad username detected] cmonBruh`);
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

    const userCD = new tools.Cooldown(user, realcommand, 5000);

    if ((await userCD.setCooldown()).length) { return; }

    if (channel === "#forsen") {
        channel = "#botbear1110"
    }

    const banPhrase = await tools.banphrasePass(result, channel);

    if (banPhrase.banned) {
        cc.say(channel, `[Banphrased] cmonBruh`);
        return;
    }

    const banPhraseV2 = await tools.banphrasePassV2(result, channel);

    if (banPhraseV2 == true) {
        cc.say(channel, `[Banphrased] cmonBruh`);
        return;
    }

    if (banPhrase === 0) {
        cc.say(channel, "FeelsDankMan error!!")
        return;
    }

    const notabanPhrase = await tools.notbannedPhrases(result.toLowerCase());

    if (notabanPhrase != `null`) {
        cc.say(channel, notabanPhrase);
        return;
    }

    const badWord = result.match(regex.racism);
    if (badWord != null) {
        cc.say(channel, `[Bad word detected] cmonBruh`);
        return;
    }

    const reallength = await tools.asciiLength(result);
    if (reallength > 30) {
        cc.say(channel, "[Too many emojis]");
        return;
    }

    if (result === oldmessage) {
        result = `${result} `
    }
    cc.say(channel, result);
    oldmessage = result

} catch (err) {
    console.log(err);
    resolve(0);
}}

function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
module.exports = { cc }