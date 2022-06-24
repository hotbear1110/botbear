require('dotenv').config();
const tmi = require("tmi.js");
const login = require('./connect/connect.js');
const tools = require("./tools/tools.js");
const regex = require('./tools/regex.js');
const _ = require("underscore");
const requireDir = require("require-dir");
const trivia = require('./commands/trivia.js');
const { createConnection } = require('mysql2/promise');
const { createClient } = require('redis');
let messageHandler = require("./tools/messageHandler.js").messageHandler;
let whisperHandler = require("./tools/whisperHandler.js").whisperHandler;

const cc = new tmi.client(login.options);

cc.on('message', onMessageHandler);
cc.on('connected', onConnectedHandler);
cc.on("pong", async (latency) => {
    console.log(latency)
    await tools.query('INSERT INTO Latency (Latency) values (?)', [latency]);

});

cc.connect();


cc.on("notice", (channel, msgid, message) => {
    // Do your stuff.
    console.log(channel, msgid, message)
});

let prefix = "bb"
if (process.env.TWITCH_USER === "devbear1110") {
    prefix = "db";
}


let uptime = new Date().getTime();

let activetrivia = {};
let triviaanswer = {};
let triviaHints = {};
let triviaHints2 = {};
let gothint = {};
let gothint2 = {};
let triviaTime = {};

let started = false;

let oldmessage = "";

let userList = [];

async function onMessageHandler(channel, user, msg, self) {
    let start = new Date().getTime();
    msg = msg.replaceAll(regex.invisChar, "");
    msg = msg.replaceAll("  ", "");

    if (!userList.includes(user.username) && user.username != null) {
        await tools.query('INSERT INTO Users (username, uid, permission) values (?, ?, ?)', [user.username, user["user-id"], 100]);
        userList.push(user.username);
        console.log(user.username);
    }
    //Temp exception for xqc's chat, since I want to test perfomance without the bot being able to respond there
    if (channel === "#xqc") {
        return;
    }

    if (channel === "#pajlada" && user["user-id"] == 82008718 && msg === "pajaS 🚨 ALERT") {
        cc.say(channel, `/me pajaLada 🚨 WHAT HAPPENED`);
        return;
    }

    if (channel === "#pajlada" && user["user-id"] == 137690566 && msg.startsWith("/announce")) {
        cc.say(channel, `. /announce æ ø å? NOTDANKENOUGH`);
        return;
    }

    if (self || (!user["user-id"] == 425363834 && !activetrivia[channel] && !msg.startsWith(prefix + " "))) {
        return;
    }

    const offlineonly = await tools.query('SELECT * FROM Streamers WHERE username=?', [channel.substring(1)]);

    if (offlineonly[0].offlineonly === 1 && offlineonly[0].islive === 1 && !tools.isMod(user, channel)) {
        return;
    }

    if (activetrivia[channel]) {
        if (msg.startsWith(prefix + " ask")) {
            new messageHandler(channel, `NOIDONTTHINKSO No cheating in the trivia`).newMessage();
            return;
        }
        if (triviaHints2[channel] !== undefined) {
            let filteranswer = tools.transformNumbers(triviaanswer[channel].toLowerCase());
            let filtermsg = tools.transformNumbers(msg.toLowerCase());
            let similarity = await tools.similarity(filtermsg.toLowerCase(), filteranswer.toLowerCase())
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
                if (gothint[channel] === false) {
                    triviaScore = triviaScore * 2;
                }

                triviaScore = Math.round(triviaScore);

                new messageHandler(channel, `(Trivia) ${user.username}, Correct! You won the trivia! The correct answer was "${triviaanswer[channel]}"! (${similarity}% similarity) BroBalt You get +${triviaScore} points`).newMessage();
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
                delete triviaHints2[channel];
                delete gothint[channel];
                delete triviaTime[channel];
                return;
            }

        } else {
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

                new messageHandler(channel, `(Trivia) ${user.username}, Correct! You won the trivia! The correct answer was "${triviaanswer[channel]}"! (${similarity}% similarity) BroBalt You get +${triviaScore} points`).newMessage();
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

    if (input[0] === "[Cookies]" && user["user-id"] == 425363834 && !msg.includes("rankup") && !msg.includes("you are currently rank")) {
        const stream = await tools.query('SELECT disabled_commands FROM Streamers WHERE username=?', [channel.substring(1)]);

        let disabledCommands = JSON.parse(stream[0].disabled_commands)

        const cookieStatus = await tools.cookies(user, input, channel);
        let checkmode = await tools.query(`SELECT Mode FROM Cookies WHERE User=?`, [cookieStatus[1]]);

        if (!checkmode.length) {
            return;
        }
        if (disabledCommands.includes("cookie") && checkmode[0].Mode === 0 && cookieStatus[0] === "Confirmed") {
            if (cookieStatus[3] === "yes") {
                new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay (You have a cdr ready!) - (The channel you ate your cookie in has reminders turned off)`).newMessage();

            } else {
                new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay - (The channel you ate your cookie in has reminders turned off)`).newMessage();

            }
            return;
        }
        if (disabledCommands.includes("cookie") && checkmode[0].Mode === 0 && cookieStatus[0] === "Confirmed2") {
            new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkay - (The channel you ate your cookie in has reminders turned off)`).newMessage();

            return;
        }

        if (disabledCommands.includes("cookie") && checkmode[0].Mode === 0 && cookieStatus[0] === "CD") {
            new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} Your cookie is still on cooldown, it will be available in ${cookieStatus[3]} - (The channel you tried to eat your cookie in has reminders turned off)`).newMessage();

            return;
        }

        if (cookieStatus[0] === "Confirmed" && checkmode[0].Mode === 0) {
            if (cookieStatus[3] === "yes") {
                new messageHandler(cookieStatus[2], `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay (You have a cdr ready!)`).newMessage();
                return;

            } else {
                new messageHandler(cookieStatus[2], `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();

            }
        } else if (cookieStatus[0] === "Confirmed" && checkmode[0].Mode === 1) {
            if (cookieStatus[3] === "yes") {
                new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay (You have a cdr ready!)`).newMessage();
                return;

            } else {
                new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();
                return;

            }
        } else if (cookieStatus[0] === "Confirmed" && checkmode[0].Mode === 2) {
            if (cookieStatus[3] === "yes") {
                new messageHandler(`#botbear1110`, `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay (You have a cdr ready!)`).newMessage();
                return;

            } else {
                new messageHandler(`#botbear1110`, `${cookieStatus[1]} I will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();
                return;

            }
        }

        if (cookieStatus[0] === "Confirmed2" && checkmode[0].Mode === 0) {
            new messageHandler(cookieStatus[2], `${cookieStatus[1]} I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();
            return;

        } else if (cookieStatus[0] === "Confirmed2" && checkmode[0].Mode === 1) {
            new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();
            return;

        } else if (cookieStatus[0] === "Confirmed2" && checkmode[0].Mode === 2) {
            new messageHandler(`#botbear1110`, `${cookieStatus[1]} I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkay`).newMessage();
            return;

        }

        if (cookieStatus[0] === "CD" && checkmode[0].Mode === 0) {
            new messageHandler(cookieStatus[2], `${cookieStatus[1]} Your cookie is still on cooldown, it will be available in ${cookieStatus[3]}`).newMessage();
            return;

        } else if (cookieStatus[0] === "CD" && checkmode[0].Mode === 1) {
            new messageHandler(`#${cookieStatus[1]}`, `${cookieStatus[1]} Your cookie is still on cooldown, it will be available in ${cookieStatus[3]}`).newMessage();
            return;

        } else if (cookieStatus[0] === "CD" && checkmode[0].Mode === 2) {
            new messageHandler(`#botbear1110`, `${cookieStatus[1]} Your cookie is still on cooldown, it will be available in ${cookieStatus[3]}`).newMessage();
            return;

        }

    }

    if (msg.includes("your cooldown has been reset!") && user["user-id"] == 425363834) {
        const stream = await tools.query('SELECT disabled_commands FROM Streamers WHERE username=?', [channel.substring(1)]);

        let disabledCommands = JSON.parse(stream[0].disabled_commands)

        const cdrStatus = await tools.cdr(user, input, channel);
        let checkmode = await tools.query(`SELECT Mode FROM Cookies WHERE User=?`, [cdrStatus[1]]);

        if (disabledCommands.includes("cdr") && cdrStatus[0] === "Confirmed" && checkmode[0].Mode === 0) {
            new messageHandler(`#${cdrStatus[1]}`, `${cdrStatus[1]} I will remind you to use your cdr in 3 hours nymnOkay - (The channel you used your cdr in has reminders disabled)`).newMessage();
            return;
        }

        if (cdrStatus[0] === "Confirmed" && checkmode[0].Mode === 0) {
            new messageHandler(cdrStatus[2], `${cdrStatus[1]} I will remind you to use your cdr in 3 hours nymnOkay`).newMessage();
            return;

        } else if (cdrStatus[0] === "Confirmed" && checkmode[0].Mode === 1) {
            new messageHandler(`#${cdrStatus[1]}`, `${cdrStatus[1]} I will remind you to use your cdr in 3 hours nymnOkay`).newMessage();
            return;

        } else if (cdrStatus[0] === "Confirmed" && checkmode[0].Mode === 2) {
            new messageHandler(`#botbear1110`, `${cdrStatus[1]} I will remind you to use your cdr in 3 hours nymnOkay`).newMessage();
            return;

        }
    }

    if (input[0] === undefined) {
        return;
    }
    if (input[0].toLowerCase() !== prefix) {
        return;
    }

    if (user.username === "supibot") {
        new messageHandler(channel, ":tf: no").newMessage();
        return;
    }

    let aliasList = await tools.query(`SELECT Aliases FROM Aliases`);

    aliasList = JSON.parse(aliasList[0].Aliases);

    const Alias = new tools.Alias(msg, aliasList);
    let aliascommand = input[1];
    input = msg.replace(Alias.getRegex(), Alias.getReplacement()).split(' ');
    let realcommand = input[1].toLowerCase();
    if (realcommand === "say" && realcommand === "channel" && realcommand === "emotecheck" && realcommand === "cum" && realcommand === "suggest" && realcommand === "shit" && realcommand === "code" && realcommand === "test2") {
        input = input.toString().replaceAll(",", " ");
    }

    /*
    const userList = await tools.query(`SELECT * FROM Users WHERE uid=?`, [user["user-id"]]);

    if (!userList.length && user.username != null) {
        await tools.query('INSERT INTO Users (username, uid, permission) values (?, ?, ?)', [user.username, user["user-id"], 100]);
    } else if (user.username !== userList[0].username && user.username != null) {
        await tools.query('UPDATE Users SET username=? WHERE uid=?', [user.username, user["user-id"]]);
    }
*/
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

    let commandCD = await tools.query(`SELECT Cooldown FROM Commands WHERE Name=?`, [input[1]]);
    if (!commandCD.length) {
        commandCD = null;
    } else {
        commandCD = commandCD[0].Cooldown;
    }

    if (commandCD === null) {
        commandCD = 3000;
    } else {
        commandCD = commandCD * 1000;
    }

    const userCD = new tools.Cooldown(user, realcommand, commandCD);

    if ((await userCD.setCooldown()).length) { return; }

    let realchannel = channel.substring(1);

    if (realcommand === "hint" && activetrivia[channel] && gothint[channel] === false) {
        if (triviaHints2[channel] !== undefined && gothint2[channel] !== 1) {
            const ms = new Date().getTime() - triviaTime[channel];
            let timePassed = tools.humanizeDuration(ms);
            if (parseInt(timePassed) < 10) {
                new messageHandler(channel, "You need to wait 10 seconds to get a hint.").newMessage();
                return;
            }
            let hintcount = 0;

            if (triviaHints2[channel][0] !== undefined && triviaHints2[channel][0]) {
                hintcount = 1;
            }
            if (triviaHints2[channel][1] !== undefined && triviaHints2[channel][1]) {
                if (hintcount === 0) {
                    hintcount = 2;
                } else if (hintcount === 1) {
                    hintcount = 3;
                }
            }

            if (gothint2[channel] === 0 && (hintcount !== 0 || hintcount !== 1)) {
                gothint2[channel] = 1;
            } else {
                gothint2[channel] = 0;
            }

            let hint = triviaHints2[channel][gothint2[channel]];
            if (hint === undefined || !hint) {
                if (gothint2[channel] === 0 && hintcount !== 2) {
                    hint = "There are no hints"
                } else if (hintcount === 1) {
                    hint = "No more hints"
                }
            }
            if (gothint2[channel] === 0 && hintcount === 3) {
                hint = hint + " - (There is one more hint)"
            }

            if (hintcount === 2 && gothint2[channel] === 0) {
                hint = triviaHints2[channel][1];
                gothint2[channel] = 1
            }

            if (hint === oldmessage) {
                hint = hint + " 󠀀 ";
            }

            new messageHandler(channel, `(Trivia) ${user.username}, Hint: ${hint}`).newMessage();
            oldmessage = `(Trivia) ${user.username}, Hint: ${hint}`;
            return;
        } else if (!gothint2[channel]) {
            const ms = new Date().getTime() - triviaTime[channel];
            let timePassed = tools.humanizeDuration(ms);
            if (parseInt(timePassed) < 10) {
                new messageHandler(channel, "You need to wait 10 seconds to get a hint.").newMessage();
                return;
            }
            gothint[channel] = true;

            let hint = triviaHints[channel];

            if (hint === oldmessage) {
                hint = hint + " 󠀀 ";
            }

            new messageHandler(channel, `(Trivia) ${user.username}, Hint: ${hint}`).newMessage();
            oldmessage = `(Trivia) ${user.username}, Hint: ${hint}`;
            return;
        }
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

        if ((await triviaCD.setCooldown()).length && !tools.isMod(user, channel)) {
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

        if (response === oldmessage) {
            response = response + " 󠀀 ";
        }

        new messageHandler(channel, response).newMessage();
        return;

    }

    if (realcommand === "trivia2") {
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

        if ((await triviaCD.setCooldown()).length && !tools.isMod(user, channel)) {
            new messageHandler(channel, `Trivia is still on cooldown. Available in ${triviaCD.formattedTime()}`).newMessage();
            return;
        }

        let result = await commands[realcommand].execute(realchannel, user, input, perm);
        if (result[0] === "F") {
            result = [`(Trivia) [ FeelsDankMan ] Question: nymnDank Something went wrong!?!`, "LULE WHO MADE THIS", "This bot is so bad LuL", "MegaLUL @hotbear1110"];
        }



        if (!result) {
            return;
        }

        triviaanswer[channel] = result[1];

        activetrivia[channel] = channel;

        triviaHints2[channel] = [result[2], result[3]];

        let triviaTimeID = new Date().getTime()

        triviaTime[channel] = triviaTimeID;

        gothint[channel] = false;
        gothint2[channel] = false;
        triviaTimeout(channel, triviaTimeID);
        async function triviaTimeout(channel, triviaTimeID) {
            setTimeout(() => {
                if (activetrivia[channel]) {
                    if (triviaTime[channel] === triviaTimeID) {
                        delete activetrivia[channel];
                        delete triviaanswer[channel];
                        delete triviaHints2[channel];

                        new messageHandler(channel, `The trivia timed out after 60 seconds. The answer was: "${result[1]}"`).newMessage();
                    }
                }
            }, 60000);
        }


        let response = result[0];

        if (response === oldmessage) {
            response = response + " 󠀀 ";
        }

        new messageHandler(channel, response).newMessage();
        return;

    }

    let result = await commands[realcommand].execute(realchannel, user, input, perm, aliascommand);


    if (!result) {
        return;
    }

    new messageHandler(channel, result, commands[realcommand].noBanphrase, commands[realcommand].showDelay, start, commands[realcommand].ping, user).newMessage();
    return;
}

async function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    let users = await tools.query(`SELECT username FROM Users`,);
    userList = users.map(a => a.username);

    await tools.refreshCommands();
    if (started === false) {
        /*
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
        */

        if (process.env.TWITCH_USER !== "devbear1110") {

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

                    cc.say(`#${name[0]}`, `Name change detected, ${name[1]} -> ${name[0]}`);
                    new messageHandler("#botbear1110", `Left channel ${name[1]}. Reason: Name change detected, ${name[1]} -> ${name[0]}`).newMessage();
                })
            }
        }
        await tools.checkLiveStatus();
        await tools.checkTitleandGame();
        started = true;
    }

}

// Karim/Backous module

cc.on("whisper", (from, userstate, message, self) => {
    // Don't listen to my own messages..
    if (self) return;

    console.log(from)
    if (from === `#${process.env.someguy1}` && message.startsWith(prefix + " say ")) {
        new messageHandler("#nymn", `/me @Retard: ${message.substring(7)}`).newMessage();
    }
    if (from === `#${process.env.someguy2}` && message.startsWith(prefix + " say ")) {
        new messageHandler("#nymn", `/me @Backous: ${message.substring(7)}`).newMessage();
    }
    return;
});

cc.on("ban", (channel, username, reason, userstate) => {
    if (channel === "nymn" || channel === "#nymn") {
        console.log("BANNED USER " + channel, username, reason, userstate)
    }
});

module.exports = { cc, uptime };