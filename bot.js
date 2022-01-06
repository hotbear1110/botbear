require('dotenv').config();
const tmi = require("tmi.js");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js");
const regex = require('./tools/regex.js');
const _ = require("underscore");
const requireDir = require("require-dir");
const trivia = require('./commands/trivia.js');

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

const talkedRecently = new Set();
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

            cc.say(channel, `(Trivia) ${user.username}, Correct! You won the trivia! The correct answer was "${triviaanswer[channel]}"! (${similarity}% similarity) OMGScoots You get +${triviaScore} points`);

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
                cc.say(cookieStatus[2], `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay (You have a cdr ready!)`)
            } else {
                cc.say(cookieStatus[2], `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay`)
            }
        }
        if (cookieStatus[0] === "Confirmed2") {
            cc.say(cookieStatus[2], `${cookieStatus[1]} I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkay`)
        }
        if (cookieStatus[0] === "CD") {
            cc.say(cookieStatus[2], `${cookieStatus[1]} Your cookie is still on cooldown, it will be available in ${cookieStatus[3]}`)
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
            cc.say(cdrStatus[2], `${cdrStatus[1]} I will remind you to use your cdr in 3 hours nymnOkay`)
        }
    }

    if (input[0] !== "bb" && input[0] !== "forsenBB") {
        return;
    }

    if (user.username === "supibot") {
        cc.say(channel, ":tf: no");
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


    if (user['user-id'] !== process.env.TWITCH_OWNERUID) {

        let timeout = 1250;

        setTimeout(() => {
            talkedRecently.delete(channel);
        }, timeout);
    }

    const badUsername = user.username.match(regex.racism);
    if (badUsername != null) {
        cc.say(channel, `[Bad username detected] cmonBruh`);
        return;
    }

    let realchannel = channel.substring(1);

    if (realcommand === "hint" && activetrivia[channel] && gothint[channel] === false) {
        const ms = new Date().getTime() - triviaTime[channel];
        let timePassed = tools.humanizeDuration(ms);
        if (parseInt(timePassed) < 10) {
            cc.say(channel, "You need to wait 10 seconds to get a hint.");
            return;
        }
        gothint[channel] = true;

        let hint = triviaHints[channel];

        const banPhrase = await tools.banphrasePass(hint, channel);

        if (banPhrase.banned) {
            cc.say(channel, `[Banphrased] cmonBruh`);
            return;
        }

        const banPhraseV2 = await tools.banphrasePassV2(hint, channel);

        if (banPhraseV2 == true) {
            cc.say(channel, `[Banphrased] cmonBruh`);
            return;
        }

        if (banPhrase === 0) {
            cc.say(channel, "FeelsDankMan banphrase error!!");
            return;
        }

        const notabanPhrase = await tools.notbannedPhrases(hint.toLowerCase());

        if (notabanPhrase != `null`) {
            cc.say(channel, notabanPhrase);
            return;
        }

        const badWord = hint.match(regex.racism);
        if (badWord != null) {
            cc.say(channel, `[Bad word detected] cmonBruh`);
            return;
        }

        const reallength = await tools.asciiLength(hint);
        if (reallength > 30) {
            cc.say(channel, "[Too many emojis]");
            return;
        }

        if (hint === oldmessage) {
            hint = hint + " 󠀀 ";
        }

        cc.say(channel, `(Trivia) ${user.username}, Hint: ${hint}`)
        oldmessage = `(Trivia) ${user.username}, Hint: ${hint}`;
        return;
    }

    if (realcommand === "trivia") {
        if (activetrivia[channel]) {
            cc.say(channel, "There is already an active trivia");
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
            cc.say(channel, `Trivia is still on cooldown. Available in ${triviaCD.formattedTime()}`)

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

                        cc.say(channel, `The trivia timed out after 60 seconds. The answer was: "${result[2]}"`)
                    }
                }
            }, 60000);
        }


        let response = result[0];

        const banPhrase = await tools.banphrasePass(response, channel);

        if (banPhrase.banned) {
            cc.say(channel, `[Banphrased] cmonBruh`);
            return;
        }

        const banPhraseV2 = await tools.banphrasePassV2(response, channel);

        if (banPhraseV2 == true) {
            cc.say(channel, `[Banphrased] cmonBruh`);
            return;
        }

        if (banPhrase === 0) {
            cc.say(channel, "FeelsDankMan error!!");
            return;
        }

        const notabanPhrase = await tools.notbannedPhrases(response.toLowerCase());

        if (notabanPhrase != `null`) {
            cc.say(channel, notabanPhrase);
            return;
        }

        const badWord = response.match(regex.racism);
        if (badWord != null) {
            cc.say(channel, `[Bad word detected] cmonBruh`);
            return;
        }

        const reallength = await tools.asciiLength(response);
        if (reallength > 30) {
            cc.say(channel, "[Too many emojis]");
            return;
        }

        if (response === oldmessage) {
            response = response + " 󠀀 ";
        }

        cc.say(channel, response);
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
        cc.say(channel, `[Banphrased] cmonBruh`);
        return;
    }

    if (banPhrase === 0) {
        cc.say(channel, "FeelsDankMan error!!");
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
        result = result + " 󠀀 ";
    }
    let end = new Date().getTime();

    if (commands[realcommand].showDelay == true) {
        result = `${result} ${end - start}ms`;
    }
    if (channel === "#forsen") {
        let message = tools.splitLine(result, 90)
        if (message[1]) {
            if (message[0].length === 0) {
                cc.say(channel, "ForsenLookingAtYou Message is too long");
            }
            cc.say(channel, message[0] + " ...");
            return;
        }
    }
    cc.say(channel, result);
    oldmessage = result;
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
                cc.say("#botbear1110", `Left channel ${user}. Reason: Banned/deleted channel`)
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

                cc.say(`#${name[0]}`, `Name change detected, ${name[1]} -> ${name[0]}`)
                cc.say("#botbear1110", `Left channel ${name[1]}. Reason: Name change detected, ${name[1]} -> ${name[0]}`)
            })
        }
        started = true;
    }

}
module.exports = { cc, uptime };
