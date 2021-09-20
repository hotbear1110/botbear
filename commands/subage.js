const axios = require('axios');
const _ = require("underscore");
const tools = require("../tools/tools.js");

module.exports = {
    name: "subage",
    ping: false,
    description: "Responds with sub information about a given user",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                username = input[2];
            }
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3];
            }
            let subcheck = await axios.get(`https://api.ivr.fi/twitch/subage/${username}/${realchannel}`, {timeout: 10000});
            if (subcheck.data["subscribed"] == false) {
                let oldsub = subcheck.data["cumulative"];
                const subend = new Date().getTime() - Date.parse(oldsub["end"]);


                if (oldsub["months"] === 0) {
                    return `${username} is not subbed to #${realchannel}ﾠand never has been.`;
                }
                else {
                    return `${username} is not subbed to #${realchannel}ﾠbut has been previously for a total of ${oldsub["months"]} months! Sub ended ${tools.humanizeDuration(subend)} ago`;
                }
            }
            else {
                let subdata = subcheck.data["meta"];
                let sublength = subcheck.data["cumulative"];
                let substreak = subcheck.data["streak"]; 
                
                const ms = new Date().getTime() - Date.parse(subdata["endsAt"]);

                if (subdata["tier"] === "Custom") {
                    return `${username} is subbed to #${realchannel}ﾠwith a permanent sub and has been subbed for a total of ${sublength["months"]} months! They are currently on a ${substreak["months"]} months streak.`;

                }
                if (subdata["type"] === "prime") {
                    return `${username} is currently subbed to #${realchannel}ﾠwith a tier 1 prime sub and has been subbed for a total of ${sublength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${tools.humanizeDuration(ms)}`;
                }
                if (subdata["type"] === "paid") {
                    return `${username} is currently subbed to #${realchannel}ﾠwith a tier ${subdata["tier"]} sub and has been subbed for a total of ${sublength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${tools.humanizeDuration(ms)}`;
                }
                if (subdata["type"] === "gift") {
                    let gifta = subdata["gift"]["name"];
                    return `${username} is currently subbed to #${realchannel}ﾠwith a tier ${subdata["tier"]} sub, gifted by ${gifta} and has been subbed for a total of ${sublength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${tools.humanizeDuration(ms)}`;
                }
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}