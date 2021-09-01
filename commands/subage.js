const axios = require('axios');
const _ = require("underscore")

module.exports = {
    name: "subage",
    ping: false,
    execute: async (channel, user, input, perm) => {
        try {
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1)
                }
                username = input[2];
            }
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3]
            }
            let subcheck = await axios.get(`https://api.ivr.fi/twitch/subage/${username}/${realchannel}`)
            if (subcheck.data["subscribed"] == false) {
                let oldsub = subcheck.data["cumulative"]
                if (oldsub["months"] === 0) {
                    return `${username} is not subbed to #${realchannel} and never has been.`
                }
                else {
                    return `${username} is not subbed to #${realchannel}, but has been previously for a total of ${oldsub["months"]} months!`
                }
            }
            else {
                let subdata = subcheck.data["meta"]
                let sublength = subcheck.data["cumulative"]
                if (subdata["type"] === "prime") {
                    return `${username} is currently subbed to #${realchannel}, with a tier 1 prime sub and has been subbed for a total of ${sublength["months"]} months!`
                }
                if (subdata["type"] === "paid") {
                    return `${username} is currently subbed to #${realchannel}, with a tier ${subdata["tier"]} sub and has been subbed for a total of ${sublength["months"]} months!`
                }
                if (subdata["type"] === "gift") {
                    let gifta = subdata["gift"]["name"]
                    return `${username} is currently subbed to #${realchannel}, with a tier ${subdata["tier"]} sub, gifted by ${gifta} and has been subbed for a total of ${sublength["months"]} months!`
                }
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}