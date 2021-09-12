const axios = require('axios');
const tools = require("../tools/tools.js");
const _ = require("underscore");

module.exports = {
    name: "emotecheck",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {

        } catch (err) {
            console.log(err)
        }
        try {

            const emotecheck = await axios.get(`https://api.ivr.fi/twitch/emotes/${input[2]}`);

            if (emotecheck.data["status"] = 200) {
                let emotechannel = emotecheck.data["channel"]
                let tier = emotecheck.data["tier"]
                let url = emotecheck.data["emoteurl_3x"]

                const emotecount = await axios.get(`https://api.streamelements.com/kappa/v2/chatstats/${channel}/stats`);
                let count = emotecount.data["twitchEmotes"]
                let ecount = 0;
                _.each(count, async function (emote) {
                    console.log(emote["emote"], emote["amount"])
                    if (emote["emote"] === input[2]) {
                        ecount = emote["amount"]
                        return;
                    }
                })


                if (emotechannel === null) {
                    if (ecount !== 0) {
                        return `${input[2]} is a Twitch global emote, the emote has been used ${ecount} times in this chat - ${url}`;
                    }
                    else {
                        return `${input[2]} is a Twitch global emote - ${url}`;
                    }
                }

                if (emotechannel === "qa_TW_Partner") {
                    if (ecount !== 0) {
                        return `${input[2]} is a (Limited time) Twitch global emote, the emote has been used ${ecount} times in this chat - ${url}`;
                    }
                    return `${input[2]} is a (Limited time) Twitch global emote - ${url}`;

                }
                if (ecount !== 0) {
                    return `${input[2]} is a tier ${tier} emote, from the channel (#${emotechannel}), the emote has been used ${ecount} times in this chat - ${url}`;
                }
                return `${input[2]} is a tier ${tier} emote, from the channel (#${emotechannel}) - ${url}`;

            }

        } catch (err) {
            console.log(err);
        }
        try {
            const streamer = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
            let emotes = JSON.parse(streamer[0].emote_list);


            const now = new Date().getTime();

            let found = 0;

            let response = "";

            const emotecount = await axios.get(`https://api.streamelements.com/kappa/v2/chatstats/${channel}/stats`);
            let bttv = emotecount.data["bttvEmotes"]
            let ffz = emotecount.data["ffzEmotes"]
            let ecount = 0;
            let foundemote = 0;
            _.each(bttv, async function (emote) {
                console.log(emote["emote"], emote["amount"])
                if (emote["emote"] === input[2]) {
                    ecount = emote["amount"]
                    foundemote = 1
                    return;
                }
            })
            if (foundemote === 0) {
                _.each(ffz, async function (emote) {
                    console.log(emote["emote"], emote["amount"])
                    if (emote["emote"] === input[2]) {
                        ecount = emote["amount"]
                        foundemote = 1
                        return;
                    }
                })
            }


            _.each(emotes, async function (emote) {
                if (emote[0] === input[2]) {

                    emote[2] = `(${tools.humanizeDuration(now - emote[2])})`;

                    found = 1;
                    if (ecount !== 0) {
                        response = `${input[2]} is a 3rd party emote, the emote was added to the channel ${emote[2]} ago, and has been used ${ecount} times in this chat. The emote was uploaded by the user "${emote[3]}" - ${emote[4]}`;
                    }
                    else {
                        response = `${input[2]} is a 3rd party emote, the emote was added to the channel ${emote[2]} ago. The emote was uploaded by the user "${emote[3]}" - ${emote[4]}`;

                    }
                    return;
                }

            })
            if (found === 1) {
                return response;
            }
            else {
                return `Error FeelsBadMan - Emote was not found`;
            }


        } catch (err) {
            console.log(err)
            return ` Error FeelsBadMan - Emote was not found`;
        }
    }
}