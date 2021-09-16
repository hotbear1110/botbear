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
        }).json();
        resolve(this.checkBanphrase);
    } catch (err) {
        console.log(err);
        resolve(0);
    }

});

exports.banphrasePassV2 = (message, channel) => new Promise(async (resolve, reject) => {
    this.channel = channel.replace("#", '');
    this.message = message.replaceAll(' ', '%20');
    try {
        this.checkBanphrase = await axios.get(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=${this.message}`);
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

exports.Cooldown = class Cooldown {
    constructor(user, command, CD) {
        this.cooldown = CD;
        this.userId = user['user-id'];
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

        setTimeout(() => {
            hasCooldown.delete(this.key);
        }, await this.cooldownReduction());
        return [];
    }
}

exports.splitLine = (message, chars) => {
    let messages = [];
    for (let i = 0; i < Math.ceil(message.length / chars); i++) {
        const multipy = i + 1;
        messages.push(message.substring(i * chars, multipy * chars));
    }
    return messages;
}

let hasteoptions = {
    server: 'https://haste.zneix.eu/'
};

exports.makehastebin = (message, username, channel) =>
    hastebin(`${username}'s game list, from channel: ${channel}\n\nGame list:\n${message}`, hasteoptions).then((url) => {
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
}

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
        return err;
    }
}

exports.massping = (message, channel) => new Promise(async (resolve, reject) => {
    let users = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`).json();
    let userlist = users.chatters["broadcaster"];
    userlist = userlist.concat(users.chatters["vips"]);
    userlist = userlist.concat(users.chatters["moderators"]);
    userlist = userlist.concat(users.chatters["staff"]);
    userlist = userlist.concat(users.chatters["admins"]);
    userlist = userlist.concat(users.chatters["global_mods"]);
    userlist = userlist.concat(users.chatters["viewers"]);

    console.log(userlist)

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

})

exports.asciiLength = (message) => {
    const msgarray = message.split(" ");
    let emojicount = 0;

    _.each(msgarray, async function (word) {
        if (/\p{Emoji}/u.test(word)) {
            emojicount++;
        }
    })
    return emojicount;

}

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
}

exports.getPerm = (user) => new Promise(async (resolve, reject) => {
    try {
        let userPermission = await tools.query(`SELECT * FROM Users WHERE username=?`, [user]);
        userPermission = JSON.parse(userPermission[0].permission);

        resolve(userPermission);
    } catch (err) {
        console.log(err);
        resolve(0);
    }
})