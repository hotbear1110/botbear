require('dotenv').config();
const _ = require("underscore");
const mysql = require("mysql2");
const got = require("got");
const db = require('../connect/connect.js');
const tools = require("./tools.js");
const bannedPhrases = require("./bannedPhrases.js");
const hastebin = require('better-hastebin');
const humanize = require('humanize-duration');
const requireDir = require("require-dir");
const regex = require('./regex.js');
let messageHandler = require("./messageHandler.js").messageHandler;

exports.query = (query, data = []) =>
    new Promise((resolve, reject) => {
        db.con.execute(mysql.format(query, data), async (err, results) => {
            if (err) {
                console.log(query, "\n//\n", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });

exports.banphrasePass = (message, channel) => new Promise(async (resolve, reject) => {
    this.channel = channel.substring(1);;
    this.data = await tools.query(`
          SELECT banphraseapi
          FROM Streamers
          WHERE username=?`,
        [this.channel]);
    if (!this.data.length) {
        this.banphraseapi = null;
    } else {
        this.banphraseapi = this.data[0].banphraseapi;
    }
    try {
        if (this.banphraseapi == null || this.banphraseapi == "NULL" || !this.banphraseapi) {
            this.banphraseapi = "https://pajlada.pajbot.com";
        }
    } catch (err) {
        console.log(err);
        resolve(0);
    }
    try {
        message = encodeURIComponent(message)
        this.checkBanphrase = await got(`${this.banphraseapi}/api/v1/banphrases/test`, {
            method: "POST",
            body: "message=" + message,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 10000
        }).json();
        resolve(this.checkBanphrase);
    } catch (err) {
        console.log(err);
        try {
            message = encodeURIComponent(message)
            this.checkBanphrase = await got(`https://pajlada.pajbot.com/api/v1/banphrases/test`, {
                method: "POST",
                body: "message=" + message,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 10000
            }).json();
            resolve(this.checkBanphrase);
        } catch (err) {
            console.log(err);
            resolve(0);
        }
    }

});

exports.banphrasePassV2 = (message, channel) => new Promise(async (resolve, reject) => {
    this.channel = channel.replace("#", '');
    this.message = encodeURIComponent(message).replaceAll("%0A", "%20");
    this.data = await tools.query(`SELECT * FROM Streamers WHERE username=?`, [this.channel]);

    if (this.data[0]) {
        this.userid = this.data[0].uid;
        this.banphraseapi2 = this.data[0].banphraseapi2;
    } else {
        this.banphraseapi2 = null;
    }
    if (this.banphraseapi2 !== null) {
        try {
            this.checkBanphrase = await got(`${this.banphraseapi2}/api/channel/${this.userid}/moderation/check_message?message=botbear1110%20${this.message}`, { timeout: 10000 }).json();
            if (this.checkBanphrase["banned"] == true) {
                resolve(true);
            }
            resolve(false);
        } catch (err) {
            console.log(err);
            try {
                this.checkBanphrase = await got(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=botbear1110%20${this.message}`, { timeout: 10000 }).json();
                if (this.checkBanphrase["banned"] == true) {
                    resolve(true);
                }
                resolve(false);
            } catch (err) {
                console.log(err);
                resolve(0);
            }
        }
    } else {
        try {
            this.checkBanphrase = await got(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=botbear1110%20${this.message}`, { timeout: 10000 }).json();
            if (this.checkBanphrase["banned"] == true) {
                resolve(true);
            }
            resolve(false);
        } catch (err) {
            console.log(err);
            resolve(0);
        }
    }

});


hasCooldown = new Set();

let cooldownTime = {}

exports.Cooldown = class Cooldown {
    constructor(user, command, CD) {
        this.cooldown = CD;
        if (!user['user-id']) {
            this.userId = user
        } else {
            this.userId = user['user-id'];
        }
        this.command = command;
        this.key = `${this.userId}_${this.command}`;
    }

    async cooldownReduction() {
        const cooldown = this.cooldown;

        return cooldown;
    }

    // command cooldown
    async setCooldown() {
        if (this.userId === process.env.TWITCH_OWNERUID) { return [] }; // Your user ID

        if (hasCooldown.has(this.key)) { return [this.key]; }

        hasCooldown.add(this.key);

        cooldownTime[this.key] = new Date().getTime();


        setTimeout(() => {
            hasCooldown.delete(this.key);
            delete cooldownTime[this.key];

        }, await this.cooldownReduction());
        return [];
    }

    /**
     * @returns {String}: String formatted time left.
     */
    formattedTime() {
        return exports.humanizeDuration(this.cooldown - (new Date().getTime() - cooldownTime[this.key]));
    }
};

exports.splitLine = (message, chars) => {
    message = message.split(" ");
    let messages = [];
    let msglength = 0;
    let tempmsg = [];
    _.each(message, function (msg) {
        msglength = msglength + msg.length + 1;
        if (msglength > chars) {
            messages.push(tempmsg.toString().replaceAll(",", " "));
            tempmsg = [];
            msglength = 0;
        }
        tempmsg.push(msg);

    })
    if (tempmsg.length) {
        messages.push(tempmsg.toString().replaceAll(",", " "));
    }

    return messages;
};

let hasteoptions = {
    server: 'https://haste.zneix.eu/'
};

exports.makehastebin = (message) =>
    hastebin(message, hasteoptions).then((url) => {
        return url;
    });

exports.humanizeDuration = (ms) => {
    const options = {
        language: "shortEn",
        languages: {
            shortEn: {
                y: () => "y",
                mo: () => "mo",
                w: () => "w",
                d: () => "d",
                h: () => "h",
                m: () => "m",
                s: () => "s",
                ms: () => "ms",
            },
        },
        units: ['y', 'd', 'h', 'm', 's'],
        largest: 3,
        round: true,
        conjunction: ' and ',
        spacer: '',

    }
    return humanize(ms, options);
};

exports.notbannedPhrases = (message) => {

    let banPhraseList = bannedPhrases.bannedPhrases;
    let isbanned = `null`;
    try {
        _.each(banPhraseList, async function (phrase) {
            if (message.includes(phrase)) {
                isbanned = `[Bad word detected] cmonBruh`;
                return;
            }
        })
        return isbanned;
    } catch (err) {
        console.log(err);
        return;
    }
};

exports.massping = (message, channel) => new Promise(async (resolve, reject) => {
    channel = channel.replace("#", '');
    message = message.replace(/(^|[@#.,:;\s]+)|([?!.,:;\s]|$)/gm, " ");

    let dblist = ("filler " + message.slice())
        .split(" ")
        .filter(String);

    const dbpings = await tools.query(`SELECT username FROM Users WHERE ` + Array(dblist.length).fill("username = ?").join(" OR "), dblist);

    let dbnames = dbpings.map(a => a.username);
    let users = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`, { timeout: 10000 }).json();

    let userlist = [];
    for (const [_, values] of Object.entries(users.chatters)) {
        userlist = userlist.concat(values);
    };

    userlist = userlist.concat(dbnames.filter(x => !userlist.includes(x)));

    let pings = 0;
    _.each(userlist, async function (user) {
        if (message.includes(user)) {
            pings++;
        }
        if (pings > 7) {
            return;
        }
    })
    if (pings > 7) {
        resolve(`[MASS PING]`);
    }
    resolve("null");

});

exports.asciiLength = (message) => {
    const msgarray = message.split(" ");
    let emojicount = 0;

    _.each(msgarray, async function (word) {
        if (/\p{Emoji}/u.test(word)) {
            emojicount++;
        }
    })
    return emojicount;

};


exports.Alias = class Alias {
    constructor(message, aliasList) {
        this.command = message
            .split(' ')
            .splice(1)
            .filter(Boolean)[0];
        this.alias = aliasList.filter(i => i[this.command]);
    }

    convertToRegexp(input) {
        return new RegExp(`\\b${input}\\b`, "i");
    }

    getRegex() {
        if (this.alias.length) {
            return this.convertToRegexp(Object.keys(this.alias[0]));
        }
        return '';
    }

    getReplacement() {
        if (this.alias.length) {
            return Object.values(this.alias[0])[0];
        }
        return '';
    }
};

exports.getPerm = (user) => new Promise(async (resolve, reject) => {
    try {
        let userPermission = await tools.query(`SELECT * FROM Users WHERE username=?`, [user]);
        userPermission = JSON.parse(userPermission[0].permission);

        resolve(userPermission);
    } catch (err) {
        console.log(err);
        resolve(0);
    }
});

exports.cookies = (user, command, channel) => new Promise(async (resolve, reject) => {
    if (command[3] === "Leaderboard") {
        resolve(0);
        return;
    }
    let users = await tools.query(`SELECT * FROM Cookies WHERE User=?`, [command[3]]);
    let Time = new Date().getTime();
    let RemindTime = Time + 7200000;
    let realuser = command[3];
    let cdr = "no";

    if (!users.length) {
        users = await tools.query(`SELECT * FROM Cookies WHERE User=?`, [command[2]]);
        realuser = command[2];
    }
    if (!users.length) {
        users = await tools.query(`SELECT * FROM Cookies WHERE User=?`, [command[1].slice(0, -1)]);
        realuser = command[1].slice(0, -1);
    }
    if (!users.length) {
        resolve(0);
        return;
    }

    let cdrusers = await tools.query(`SELECT * FROM Cdr WHERE User=?`, [realuser]);

    if (cdrusers.length && cdrusers[0].RemindTime === null) {
        cdr = "yes";
    }

    let msg = command.toString().replaceAll(",", " ");

    if (user.username !== null) {
        let response = "Confirmed";
        if (msg.includes("you have already claimed a cookie")) {
            if (users[0].RemindTime === null) {
                let cookieCD = await got(`https://api.roaringiron.com/cooldown/${realuser}`, { timeout: 10000 }).json();

                if (cookieCD["error"]) {
                    resolve(0);
                    return;
                } else {
                    let cd = cookieCD["seconds_left"] * 1000;
                    cd = tools.humanizeDuration(cd);

                    resolve(["CD", realuser, channel, cd]);
                    return;
                }
            }
            let cd = users[0].RemindTime - new Date().getTime();
            cd = tools.humanizeDuration(cd);
            resolve(["CD", realuser, channel, cd]);
            return;
        }
        if (users[0].Status === "Confirmed" || users[0].Status === "Confirmed2") {
            response = "Confirmed2";
        }

        await tools.query(`UPDATE Cookies SET Status=?, Channel=?, RemindTime=? WHERE User=?`, [response, channel, RemindTime, realuser]);
        resolve([response, realuser, channel, cdr]);
    }

});

exports.cdr = (user, command, channel) => new Promise(async (resolve, reject) => {
    let users = await tools.query(`SELECT * FROM Cdr WHERE User=?`, [command[1].slice(0, -1)]);
    let Time = new Date().getTime();
    let RemindTime = Time + 10800000;
    let realuser = command[1].slice(0, -1);
    if (!users.length) {
        resolve(0);
        return;
    }

    if (user.username !== null) {
        let response = "Confirmed";

        await tools.query(`UPDATE Cdr SET Status=?, Channel=?, RemindTime=? WHERE User=?`, [response, channel, RemindTime, realuser]);
        resolve([response, realuser, channel]);
    }

});

exports.refreshCommands = async function () {
    const commands = requireDir("../commands");
    const dbCommands = await tools.query(`SELECT * FROM Commands`);
    const disableCommand = await tools.query(`SELECT username FROM Streamers WHERE command_default = ?`, [1]);

    _.each(commands, async function (command) {
        let iscommand = 0;
        _.each(dbCommands, async function (dbcommand) {
            if (dbcommand.Name === command.name) {
                if (dbcommand.Command !== command.description || dbcommand.Perm !== command.permission || dbcommand.Category !== command.category || dbcommand.Cooldown !== command.cooldown) {
                    tools.query(`UPDATE Commands SET Command=?, Perm=?, Category=?, Cooldown=? WHERE Name=?`, [command.description, command.permission, command.category, command.cooldown, command.name]);
                }
                iscommand = 1;
                return;
            }
        });

        if (iscommand === 0) {
            if (disableCommand.length && command.category !== "Core command" && command.category !== "Dev command") {
                console.log("yes")
                _.each(disableCommand, async function (user) {
                    let disabledList = await tools.query(`
                    SELECT disabled_commands
                    FROM Streamers
                    WHERE username=?`,
                        [user.username]);

                    console.log(disabledList)
                    disabledList = JSON.parse(disabledList[0].disabled_commands);
                    disabledList.push(command.name);
                    disabledList = JSON.stringify(disabledList);

                    tools.query(`UPDATE Streamers SET disabled_commands=? WHERE username=?`, [disabledList, user.username]);

                })
            }
            await tools.query('INSERT INTO Commands (Name, Command, Perm, Category, Cooldown) values (?, ?, ?, ?, ?)', [command.name, command.description, command.permission, command.category, command.cooldown]);
        }


    });
    _.each(dbCommands, async function (dbcommand) {
        let isnotcommand = 0;
        _.each(commands, async function (command) {
            if (dbcommand.Name === command.name) {
                isnotcommand = 1;
                return;
            }
        });
        if (isnotcommand === 0) {
            await tools.query('DELETE FROM Commands WHERE Name=?', [dbcommand.Name]);
        }


    });
};

exports.nameChanges = new Promise(async (resolve, reject) => {
    let streamers = await tools.query(`SELECT * FROM Streamers`);

    let changed = [];

    _.each(streamers, async function (streamer) {
        try {
            const userData = await got(`https://api.twitch.tv/helix/users?id=${streamer.uid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            }).json();
            if (userData.data.length) {
                realUser = userData.data[0];
                realUser = realUser["login"];

                if (realUser !== streamer.username) {
                    tools.query(`UPDATE Streamers SET username=? WHERE uid=?`, [realUser, streamer.uid]);

                    changed.push([realUser, streamer.username]);
                }
            }
        } catch (err) {
            console.log(err);
        }
    })

    resolve(changed);
});

exports.bannedStreamer = new Promise(async (resolve, reject) => {
    let streamers = await tools.query(`SELECT * FROM Streamers`);
    let bannedUsers = [];


    _.each(streamers, async function (streamer) {
        try {
            const isBanned = await got(`https://api.ivr.fi/twitch/resolve/${streamer.username}`, { timeout: 10000 }).json();

            if (isBanned.banned === true) {
                await tools.query('DELETE FROM Streamers WHERE uid=?', [streamer.uid]);

                bannedUsers.push(streamer.username);
            }
        } catch (err) {
            console.log(err);
        }
    })

    resolve(bannedUsers);
});

exports.similarity = async function (s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

/**
 * @author JoachimFlottorp
 * @param {ChatUserstate} username User variable tmi.js creates. 
 * @param {string} channel Channel to check for moderator status
 * @returns {boolean} true | false | If is mod
 */
exports.isMod = function (user, channel) {
    channel = channel[0] === '#' ? channel.substr(1) : channel;
    const isMod = user.mod || user['user-type'] === 'mod';
    const isBroadcaster = channel === user.username;
    const isModUp = isMod || isBroadcaster;
    return isModUp
}

exports.checkAllBanphrases = async function (message, channel) {
    const banPhrase = await tools.banphrasePass(message, channel);

    if (banPhrase.banned) {
        return `[Banphrased] cmonBruh`;
    }

    if (banPhrase === 0) {
        return "FeelsDankMan banphrase error!!";
    }

    const banPhraseV2 = await tools.banphrasePassV2(message, channel);

    if (banPhraseV2 == true) {
        return `[Banphrased] cmonBruh`;
    }

    const notabanPhrase = await tools.notbannedPhrases(message.toLowerCase());

    if (notabanPhrase != `null`) {
        return notabanPhrase;
    }

    const badWord = message.match(regex.racism);
    if (badWord != null) {
        return `[Bad word detected] cmonBruh`;
    }

    const reallength = await tools.asciiLength(message);
    if (reallength > 30) {
        return "[Too many emojis]";
    }

    const massping = await tools.massping(message, channel);
    if (massping === "[MASS PING]") {
        return "[MASS PING]";
    }

    return message;
}

exports.joinEventSub = async function (uid) {
    let data = JSON.stringify({
        "type": "channel.update",
        "version": "1",
        "condition": { "broadcaster_user_id": uid.toString() },
        "transport": { "method": "webhook", "callback": "https://hotbear.org/eventsub", "secret": process.env.TWITCH_SECRET }
    });
    await got.post(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
        headers: {
            'client-id': process.env.TWITCH_CLIENTID,
            'Authorization': process.env.TWITCH_AUTH,
            'Content-Type': 'application/json'
        },
        body: data
    });

    data = JSON.stringify({
        "type": "stream.online",
        "version": "1",
        "condition": { "broadcaster_user_id": uid.toString() },
        "transport": { "method": "webhook", "callback": "https://hotbear.org/eventsub", "secret": process.env.TWITCH_SECRET }
    });
    await got.post(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
        headers: {
            'client-id': process.env.TWITCH_CLIENTID,
            'Authorization': process.env.TWITCH_AUTH,
            'Content-Type': 'application/json'
        },
        body: data
    });

    data = JSON.stringify({
        "type": "stream.offline",
        "version": "1",
        "condition": { "broadcaster_user_id": uid.toString() },
        "transport": { "method": "webhook", "callback": "https://hotbear.org/eventsub", "secret": process.env.TWITCH_SECRET }
    });
    await got.post(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
        headers: {
            'client-id': process.env.TWITCH_CLIENTID,
            'Authorization': process.env.TWITCH_AUTH,
            'Content-Type': 'application/json'
        },
        body: data
    });

    return true;
}

exports.deleteEventSub = async function (uid) {
    let allsubs = [];
    let haspagnation = true;
    let pagnation = "";
    while (haspagnation) {
        let subs = await got(`https://api.twitch.tv/helix/eventsub/subscriptions?after=${pagnation}`, {
            headers: {
                'client-id': process.env.TWITCH_CLIENTID,
                'Authorization': process.env.TWITCH_AUTH
            }
        });
        subs = JSON.parse(subs.body);
        if (subs.pagination.cursor) {
            pagnation = subs.pagination.cursor;
        } else {
            haspagnation = false;
        }
        subs = subs.data;
        allsubs = allsubs.concat(subs)
    }

    let realsubs = allsubs.filter(x => x.condition.broadcaster_user_id === uid);

    if (realsubs.length) {
        for (let i = 0; i < realsubs.length; i++) {
            setTimeout(async function () {

                let sub = realsubs[i];
                await got.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`, {
                    headers: {
                        'client-id': process.env.TWITCH_CLIENTID,
                        'Authorization': process.env.TWITCH_AUTH
                    },
                });
            }, 100 * i)
        }
    }
    return;
}

exports.removeTrailingStuff = function (message) {
    while ([" ", ".", ","].includes(message[message.length - 1])) {
        message = message.slice(0, -1);
    }
    return message;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

exports.checkLiveStatus = async function () {
    const streamers = await tools.query('SELECT * FROM Streamers');
    console.log("test")
    _.each(streamers, async function (stream) {
        setTimeout(async function () {
            await got(`https://api.twitch.tv/helix/streams?user_login=${stream.username}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
            }).json()
                .then(async function (response) {
                    // handle success
                    const twitchdata = response;
                    let users = JSON.parse(stream.live_ping);
                    users = users.toString().replaceAll(',', ' ');


                    let proxychannel = stream.username;
                    if (stream.username === "forsen") {
                        proxychannel = "botbear1110";
                    }
                    if (twitchdata['data'].length !== 0 && stream.islive == 0) {
                        console.log(stream.username + " IS NOW LIVE");
                        await tools.query(`UPDATE Streamers SET islive = 1 WHERE username = "${stream.username}"`);

                    };
                    if (twitchdata['data'].length === 0 && stream.islive == 1) {
                        console.log(stream.username + " IS NOW OFFLINE");
                        await tools.query(`UPDATE Streamers SET islive = 0 WHERE username ="${stream.username}"`);

                    };
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }, 500);
    }
    )
    return;
}

exports.checkTitleandGame = async function () {
    const streamers = await tools.query('SELECT * FROM Streamers');

    _.each(streamers, async function (stream) {
        await got(`https://api.twitch.tv/helix/channels?broadcaster_id=${stream.uid}`, {
            headers: {
                'client-id': process.env.TWITCH_CLIENTID,
                'Authorization': process.env.TWITCH_AUTH
            },
        }).json()
            .then(async function (response) {
                // handle success
                const twitchdata = response;
                let newTitle = twitchdata.data[0].title;
                let titleusers = JSON.parse(stream.title_ping);
                titleusers = titleusers.toString().replaceAll(',', ' ');

                let newGame = twitchdata.data[0].game_name;
                let gameusers = JSON.parse(stream.game_ping);

                gameusers = gameusers.toString().replaceAll(',', ' ');

                let proxychannel2 = stream.username;
                if (stream.username === "forsen") {
                    proxychannel2 = "botbear1110";
                }

                if (newTitle !== stream.title) {
                    let titleTime = new Date().getTime();
                    console.log(stream.username + " NEW TITLE: " + newTitle);
                    await tools.query(`UPDATE Streamers SET title=?, title_time=? WHERE username=?`, [newTitle, titleTime, stream.username]);

                };
                if (newGame !== stream.game) {
                    let gameTime = new Date().getTime();

                    await tools.query(`UPDATE Streamers SET game=?, game_time=? WHERE username=?`, [newGame, gameTime, stream.username]);

                    console.log(stream.username + " NEW GAME: " + newGame);

                };
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
    )
    return;
}

exports.transformNumbers = function (message) {
    if (!["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"].includes(message.toLowerCase())) {
        return;
    }

    let numberConversion = {
        "zero" : "0",
        "one" : "1",
        "two" : "2",
        "three" : "3",
        "four" : "4",
        "five" : "5",
        "six" : "6",
        "seven" : "7",
        "eight" : "8",
        "nine" : "9",
        "ten": "10",
        "eleven" : "11",
        "twelve" : "12",
        "thirteen" : "13",
        "fourteen" : "14",
        "fifteen" : "15",
        "sixteen" : "16",
        "seventeen" : "17",
        "eighteen" : "18",
        "nineteen" : "19",
        "twenty": "20"
    }

    message = numberConversion[message];
    return message;
}