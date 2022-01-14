require('dotenv').config();
const tmi = require("tmi.js");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js");
const regex = require('./tools/regex.js');
const _ = require("underscore");
const requireDir = require("require-dir");
const trivia = require('./commands/trivia.js');
let messageHandler = require("./tools/messageHandler.js").messageHandler;

const cc = new tmi.client(login.options);

cc.on('message', onMessageHandler);
cc.on('connected', onConnectedHandler);
cc.on("pong", async (latency) => {
    console.log(latency)
    await tools.query('INSERT INTO Latency (Latency) values (?)', [latency]);

});

cc.connect();

let uptime = new Date().getTime();

let activetrivia = {};
let triviaanswer = {};
let triviaHints = {};
let gothint = {};
let triviaTime = {};

let started = false;

let oldmessage = "";

async function onMessageHandler(channel, user, msg, self) {
    let start = new Date().getTime();
    msg = msg.replaceAll(regex.invisChar, "");
    msg = msg.replaceAll("  ", "");

    if (channel == "#botbear1110") {
        console.log(`${user.username}: ${msg}`);
    }
    /*
    const userList = await tools.query(`SELECT * FROM Users WHERE username=?`, [user.username]);

    if (!userList.length && user.username != null) {
        await tools.query('INSERT INTO Users (username, uid, permission) values (?, ?, ?)', [user.username, user["user-id"], 100]);
    }
    */

    if (self) {
        return;
    }

    const offlineonly = await tools.query('SELECT * FROM Streamers WHERE username=?', [channel.substring(1)]);

    if (offlineonly[0].offlineonly === 1 && offlineonly[0].islive === 1 && !tools.isMod(user, channel)) {
        return;
    }

    if (activetrivia[channel]) {
        let similarity = await tools.similarity(msg.toLowerCase(), triviaanswer[channel].toLowerCase())
        if (await similarity >= 0.8) {

            similarity = similarity * 100
            similarity = similarity.toString().substring(0, 5);

            const ms = new Date().getTime() - triviaTime[channel];
            let time = parseInt(tools.humanizeDuration(ms));
            time = 60 - time;
            time = 1 + (time / 100);
            time = time.toString().substring(0, 4);
            time = parseFloat(time);

            let triviaScore = 1000;
            triviaScore = triviaScore * (Math.floor(similarity) / 100);
            triviaScore = triviaScore * time;
            if (gothint[channel] === false && triviaHints[channel] !== "FeelsDankMan you already got the hint.") {
                triviaScore = triviaScore * 2;
            }

            triviaScore = Math.round(triviaScore);

            new messageHandler(channel, `(Trivia) ${user.username}, Correct! You won the trivia! The correct answer was "${triviaanswer[channel]}"! (${similarity}% similarity) OMGScoots You get +${triviaScore} points`).newMessage();
            let userchannel = [];
            userchannel.push(`"${user.username}"`);
            userchannel.push(`"${channel}"`);



            const alreadyJoined = await tools.query(`
                SELECT *
                FROM MyPoints
                WHERE username=?`,
                [`[${userchannel}]`]);

            if (!alreadyJoined.length) {
                await tools.query('INSERT INTO MyPoints (username, points) values (?, ?)', [`[${userchannel}]`, triviaScore]);
            } else {
                triviaScore = triviaScore + alreadyJoined[0].points;
                await tools.query(`UPDATE MyPoints SET points=? WHERE username=?`, [triviaScore, `[${userchannel}]`])
            }

            delete activetrivia[channel];
            delete triviaanswer[channel];
            delete triviaHints[channel];
            delete gothint[channel];
            delete triviaTime[channel];
            return;
        }

    }

    let input = msg.split(" ");

    for (let i = 0; i < input.length; i++) {
        if (new RegExp(/[\uDB40-\uDC00]/).test(input[i])) {
            input[i] = input[i].replace(new RegExp(/[\uDB40-\uDC00\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/g), "");
            input[i] = input[i].replace(/\s\s+/g, ' ').trim();
            input[i] = input[i].replace("  ", "");
            input.splice(i)
        }
    }
    input = input.filter(e => e);

    if (input[0] === "[Cookies]" && user["user-id"] == 425363834 && !msg.includes("rankup")) {
        const stream = await tools.query('SELECT disabled_commands FROM Streamers WHERE username=?', [channel.substring(1)]);

        let disabledCommands = JSON.parse(stream[0].disabled_commands)
        if (disabledCommands.includes("cookie")) {
            return;
        }
        const cookieStatus = await tools.cookies(user, input, channel);

        if (cookieStatus[0] === "Confirmed") {
            if (cookieStatus[3] === "yes") {
                new messageHandler(cookieStatus[2], `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay (You have a cdr ready!)`).newMessage();
            } else {
                new messageHandler(cookieStatus[2], `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();
            }
        }
        if (cookieStatus[0] === "Confirmed2") {
            new messageHandler(cookieStatus[2], `${cookieStatus[1]} I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();
        }
        if (cookieStatus[0] === "CD") {
            new messageHandler(cookieStatus[2], `${cookieStatus[1]} Your cookie is still on cooldown, it will be available in ${cookieStatus[3]}`).newMessage();
        }

    }
    if (msg.includes("your cooldown has been reset!") && user["user-id"] == 425363834) {
        const stream = await tools.query('SELECT disabled_commands FROM Streamers WHERE username=?', [channel.substring(1)]);

        let disabledCommands = JSON.parse(stream[0].disabled_commands)
        if (disabledCommands.includes("cdr")) {
            return;
        }
        const cdrStatus = await tools.cdr(user, input, channel);

        if (cdrStatus[0] === "Confirmed") {
            new messageHandler(cdrStatus[2], `${cdrStatus[1]} I will remind you to use your cdr in 3 hours nymnOkay`).newMessage();
        }
    }

    if (input[0] !== "bb" && input[0] !== "forsenBB") {
        return;
    }

    if (user.username === "supibot") {
        new messageHandler(channel, ":tf: no").newMessage();
        return;
    }

    let aliasList = await tools.query(`SELECT Aliases FROM Aliases`);

    aliasList = JSON.parse(aliasList[0].Aliases);

    const Alias = new tools.Alias(msg, aliasList);
    input = msg.replace(Alias.getRegex(), Alias.getReplacement()).split(' ');
    let realcommand = input[1];

    if (realcommand === "say" && realcommand === "channel" && realcommand === "emotecheck" && realcommand === "cum" && realcommand === "suggest" && realcommand === "shit" && realcommand === "code") {
        input = input.toString().replaceAll(",", " ");
    }

    const userList = await tools.query(`SELECT * FROM Users WHERE uid=?`, [user["user-id"]]);

    if (!userList.length && user.username != null) {
        await tools.query('INSERT INTO Users (username, uid, permission) values (?, ?, ?)', [user.username, user["user-id"], 100]);
    } else if (user.username !== userList[0].username && user.username != null) {
        await tools.query('UPDATE Users SET username=? WHERE uid=?', [user.username, user["user-id"]]);
    }

    let disabledCheck = await tools.query(`
    SELECT disabled_commands
    FROM Streamers
    WHERE username=?`,
        [channel.substring(1)]);

    disabledCheck = JSON.parse(disabledCheck[0].disabled_commands);

    if (disabledCheck.includes(realcommand)) {
        return;
    }

    const commands = requireDir("./commands");

    if (typeof commands[realcommand] === "undefined") {
        console.log(channel, ": undefined - '", input, "'");
        return;
    }

    const perm = await tools.getPerm(user.username);

    const userCD = new tools.Cooldown(user, realcommand, 3000);

    if ((await userCD.setCooldown()).length) { return; }

    const badUsername = user.username.match(regex.racism);
    if (badUsername != null) {
        new messageHandler(channel, `[Bad username detected] cmonBruh`).newMessage();
        return;
    }

    let realchannel = channel.substring(1);

    if (realcommand === "hint" && activetrivia[channel] && gothint[channel] === false) {
        const ms = new Date().getTime() - triviaTime[channel];
        let timePassed = tools.humanizeDuration(ms);
        if (parseInt(timePassed) < 10) {
            new messageHandler(channel, "You need to wait 10 seconds to get a hint.").newMessage();
            return;
        }
        gothint[channel] = true;

        let hint = triviaHints[channel];

        const banPhrase = await tools.banphrasePass(hint, channel);

        if (banPhrase.banned) {
            new messageHandler(channel, `[Banphrased] cmonBruh`).newMessage();
            return;
        }

        const banPhraseV2 = await tools.banphrasePassV2(hint, channel);

        if (banPhraseV2 == true) {
            new messageHandler(channel, `[Banphrased] cmonBruh`).newMessage();
            return;
        }

        if (banPhrase === 0) {
            new messageHandler(channel, "FeelsDankMan banphrase error!!").newMessage();
            return;
        }

        const notabanPhrase = await tools.notbannedPhrases(hint.toLowerCase());

        if (notabanPhrase != `null`) {
            new messageHandler(channel, notabanPhrase).newMessage();
            return;
        }

        const badWord = hint.match(regex.racism);
        if (badWord != null) {
            new messageHandler(channel, `[Bad word detected] cmonBruh`).newMessage();
            return;
        }

        const reallength = await tools.asciiLength(hint);
        if (reallength > 30) {
            new messageHandler(channel, "[Too many emojis]").newMessage();
            return;
        }

        if (hint === oldmessage) {
            hint = hint + " 󠀀 ";
        }

        new messageHandler(channel, `(Trivia) ${user.username}, Hint: ${hint}`).newMessage();
        oldmessage = `(Trivia) ${user.username}, Hint: ${hint}`;
        return;
    }

    if (realcommand === "trivia") {
        if (activetrivia[channel]) {
            new messageHandler(channel, "There is already an active trivia").newMessage();
            return;
        }
        const isLive = await tools.query(`SELECT islive FROM Streamers WHERE username=?`, [realchannel]);
        if (isLive[0].islive === 1) {
            return;
        }

        // Get cooldown from database.
        let cd = await tools.query("SELECT `trivia_cooldowns` FROM `Streamers` WHERE `username` = ?", [realchannel]);

        // Set trivia cooldown if not set.
        if (cd[0].trivia_cooldowns === null) {
            cd[0].trivia_cooldowns === 30000;
            tools.query("UPDATE `Streamers` SET `trivia_cooldowns` = 30000 WHERE `username` = ?", [realchannel]);
        }

        const triviaCD = new tools.Cooldown(realchannel, realcommand, cd[0].trivia_cooldowns);

        if ((await triviaCD.setCooldown()).length && !user.mod) {
            new messageHandler(channel, `Trivia is still on cooldown. Available in ${triviaCD.formattedTime()}`).newMessage();
            return;
        }

        let result = await commands[realcommand].execute(realchannel, user, input, perm);

        if (!result) {
            return;
        }

        triviaanswer[channel] = result[2];


        activetrivia[channel] = channel;

        triviaHints[channel] = result[1];

        let triviaTimeID = new Date().getTime()

        triviaTime[channel] = triviaTimeID;

        gothint[channel] = false;
        triviaTimeout(channel, triviaTimeID);
        async function triviaTimeout(channel, triviaTimeID) {
            setTimeout(() => {
                if (activetrivia[channel]) {
                    if (triviaTime[channel] === triviaTimeID) {
                        delete activetrivia[channel];
                        delete triviaanswer[channel];
                        delete triviaHints[channel];

                        new messageHandler(channel, `The trivia timed out after 60 seconds. The answer was: "${result[2]}"`).newMessage();
                    }
                }
            }, 60000);
        }


        let response = result[0];

        const banPhrase = await tools.banphrasePass(response, channel);

        if (banPhrase.banned) {
            new messageHandler(channel, `[Banphrased] cmonBruh`).newMessage();
            return;
        }

        const banPhraseV2 = await tools.banphrasePassV2(response, channel);

        if (banPhraseV2 == true) {
            new messageHandler(channel, `[Banphrased] cmonBruh`).newMessage();
            return;
        }

        if (banPhrase === 0) {
            new messageHandler(channel, "FeelsDankMan error!!").newMessage();
            return;
        }

        const notabanPhrase = await tools.notbannedPhrases(response.toLowerCase());

        if (notabanPhrase != `null`) {
            new messageHandler(channel, notabanPhrase).newMessage();
            return;
        }

        const badWord = response.match(regex.racism);
        if (badWord != null) {
            new messageHandler(channel, `[Bad word detected] cmonBruh`).newMessage();
            return;
        }

        const reallength = await tools.asciiLength(response);
        if (reallength > 30) {
            new messageHandler(channel, "[Too many emojis]").newMessage();
            return;
        }

        if (response === oldmessage) {
            response = response + " 󠀀 ";
        }

        new messageHandler(channel, response).newMessage();
        return;

    }

    let result = await commands[realcommand].execute(realchannel, user, input, perm);


    if (!result) {
        return;
    }

    if (commands[realcommand].ping == true) {
        result = `${user['display-name']}, ${result}`;
    }

    const banPhrase = await tools.banphrasePass(result, channel);

    if (banPhrase.banned) {
        cc.say(channel, `[Banphrased] cmonBruh`);
        return;
    }

    const banPhraseV2 = await tools.banphrasePassV2(result, channel);

    if (banPhraseV2 == true) {
        new messageHandler(channel, `[Banphrased] cmonBruh`).newMessage();
        return;
    }

    if (banPhrase === 0) {
        new messageHandler(channel, "FeelsDankMan error!!").newMessage();
        return;
    }

    const notabanPhrase = await tools.notbannedPhrases(result.toLowerCase());

    if (notabanPhrase != `null`) {
        new messageHandler(channel, notabanPhrase).newMessage();
        return;
    }

    const badWord = result.match(regex.racism);
    if (badWord != null) {
        new messageHandler(channel, `[Bad word detected] cmonBruh`).newMessage();
        return;
    }

    const reallength = await tools.asciiLength(result);
    if (reallength > 30) {
        new messageHandler(channel, "[Too many emojis]").newMessage();
        return;
    }

    let end = new Date().getTime();

    if (commands[realcommand].showDelay == true) {
        result = `${result} ${end - start}ms`;
    }
    if (channel === "#forsen") {
        let message = tools.splitLine(result, 90)
        if (message[1]) {
            if (message[0].length === 0) {
                new messageHandler(channel, "ForsenLookingAtYou Message is too long").newMessage();
                return
            }
            new messageHandler(channel, message[0] + " ...").newMessage();
            return;
        }
    }
    new messageHandler(channel, result).newMessage();
    return;
}

async function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);

    await tools.refreshCommands();
    if (started === false) {

        let bannedUsers = await tools.bannedStreamer;

        if (await bannedUsers.length) {
            _.each(bannedUsers, async function (user) {
                cc.part(user).then((data) => {
                    // data returns [channel]
                }).catch((err) => {
                    console.log(err);
                });
                new messageHandler("#botbear1110", `Left channel ${user}. Reason: Banned/deleted channel`).newMessage();
            })
        }

        let namechange = await tools.nameChanges;

        if (await namechange.length) {
            _.each(namechange, async function (name) {
                cc.join(name[0]).then((data) => {
                    // data returns [channel]
                }).catch((err) => {
                    console.log(err);
                });

                cc.part(name[1]).then((data) => {
                    // data returns [channel]
                }).catch((err) => {
                    console.log(err);
                });

                new messageHandler(`#${name[0]}`, `Name change detected, ${name[1]} -> ${name[0]}`).newMessage();
                new messageHandler("#botbear1110", `Left channel ${name[1]}. Reason: Name change detected, ${name[1]} -> ${name[0]}`).newMessage();
            })
        }
        started = true;
    }

}
module.exports = { cc, uptime };
