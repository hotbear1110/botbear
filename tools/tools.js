require('dotenv').config()
const mysql = require("mysql2");
const got = require("got");
const db = require('../connect/connect.js');
const tools = require("./tools.js");
const hastebin = require('better-hastebin');


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
    this.channel = channel.replace("#", '')
    this.data = await tools.query(`
          SELECT banphraseapi
          FROM Streamers
          WHERE username=?`,
        [this.channel]);
    if (this.data[0].banphraseapi === null) {
        resolve(0);
        return;
    }
    try {
        this.checkBanphrase = await got(this.data[0].banphraseapi, {
            method: "POST",
            body: "message=" + message,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        }).json();
        console.log(this.data[0].banphraseapi)
        console.log(this.channel)
        resolve(this.checkBanphrase);
    } catch (err) {
        console.log(err);
        resolve(0);
    }

});


hasCooldown = new Set();

exports.Cooldown = class Cooldown {
    constructor(user, command) {
        this.userId = user['user-id'];
        this.command = command;
        this.key = `${this.userId}_${this.command}`;
    }

    async cooldownReduction() {
        const cooldown = 5000;

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
        messages.push(message.substring(i * chars, multipy * chars))
    }
    return messages
}

let hasteoptions = {
    server: 'https://haste.zneix.eu/'
};

exports.makehastebin = (message, username, channel) =>
    hastebin(`${username}'s game list, from channel: ${channel}\n\nGame list:\n${message}`, hasteoptions).then((url) => {
        console.log(url)
        return url;
    });