require('dotenv').config();
const _ = require("underscore");
const mysql = require("mysql2");
const got = require("got");
const db = require('../connect/connect.js');
const tools = require("./tools.js");
const bannedPhrases = require("./bannedPhrases.js");
const hastebin = require('better-hastebin');
const humanize = require('humanize-duration');
const axios = require('axios');
const requireDir = require("require-dir");

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
    this.channel = channel.replace("#", '');
    this.data = await tools.query(`
          SELECT banphraseapi
          FROM Streamers
          WHERE username=?`,
        [this.channel]);
    this.banphraseapi = this.data[0].banphraseapi;
    try {
        if (this.banphraseapi == null) {
            this.banphraseapi = "https://pajlada.pajbot.com/api/v1/banphrases/test";
        }
    } catch (err) {
        console.log(err);
        resolve(0);
    }
    try {
        this.checkBanphrase = await got(this.banphraseapi, {
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

});

exports.banphrasePassV2 = (message, channel) => new Promise(async (resolve, reject) => {
    this.channel = channel.replace("#", '');
    this.message = encodeURIComponent(message);
    try {
        this.checkBanphrase = await axios.get(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=${this.message}`, { timeout: 10000 });
        if (this.checkBanphrase.data["banned"] == true) {
            resolve(true);
        }
        resolve(false);
    } catch (err) {
        console.log(err);
        resolve(0);
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
    let messages = [];
    for (let i = 0; i < Math.ceil(message.length / chars); i++) {
        const multipy = i + 1;
        messages.push(message.substring(i * chars, multipy * chars));
    }
    return messages;
};

let hasteoptions = {
    server: 'https://haste.zneix.eu/'
};

exports.makehastebin = (message) =>
    hastebin(message, hasteoptions).then((url) => {
        console.log(url);
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
    let users = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`, { timeout: 10000 }).json();
    let userlist = users.chatters["broadcaster"];
    userlist = userlist.concat(users.chatters["vips"]);
    userlist = userlist.concat(users.chatters["moderators"]);
    userlist = userlist.concat(users.chatters["staff"]);
    userlist = userlist.concat(users.chatters["admins"]);
    userlist = userlist.concat(users.chatters["global_mods"]);
    userlist = userlist.concat(users.chatters["viewers"]);

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

const aliasList = require('./aliases.json');

exports.Alias = class Alias {
    constructor(message) {
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
    console.log(command[1].slice(0, -1))
    console.log(cdrusers)

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
                    console.log(cd)

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

    _.each(commands, async function (command) {
        let iscommand = 0;
        _.each(dbCommands, async function (dbcommand) {
            if (dbcommand.Name === command.name) {
                if (dbcommand.Command !== command.description || dbcommand.Perm !== command.permission || dbcommand.Category !== command.category) {
                    tools.query(`UPDATE Commands SET Command=?, Perm=?, Category=? WHERE Name=?`, [command.description, command.permission, command.category, command.name]);
                }
                iscommand = 1;
                return;
            }
        });
        if (iscommand === 0) {
            await tools.query('INSERT INTO Commands (Name, Command, Perm, Category) values (?, ?, ?, ?)', [command.name, command.description, command.permission, command.category]);
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
            const userData = await axios.get(`https://api.twitch.tv/helix/users?id=${streamer.uid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            })
            if (userData.data.data.length) {
                realUser = userData.data.data[0];
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
            const isBanned = await axios.get(`https://api.ivr.fi/twitch/resolve/${streamer.username}`, { timeout: 10000 });

            if (isBanned.data.banned === true) {
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