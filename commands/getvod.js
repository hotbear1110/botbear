const axios = require('axios');

module.exports = {
    name: "getvod",
    ping: true,
    description: 'This command will give you a link to the latest twitch vod for a given channel, if available. Or you can input a number to get a specific vod. Example: "bb getvod nymn 5"(will get the 5th vod[lower number = newer]])',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realchannel = channel;
            let vodNumber = 0;

            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                realchannel = input[2];
            }



            if (input[3]) {
                if (isNaN(input[3])) {
                    return;
                }
                vodNumber = parseInt(input[3]) - 1;
            }

            const userID = await axios.get(`https://api.ivr.fi/twitch/resolve/${realchannel}`, { timeout: 10000 });

            if (userID.status === 404) {
                return `Could not find user: "${realchannel}"`;
            }

            let vodList = await axios.get(`https://api.twitch.tv/helix/videos?user_id=${userID.data.id}&type=archive&first=100`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            });

            vodList = vodList.data

            if (!vodList.data.length) {
                return `That channel has no vods`;
            } else if (!vodList.data[vodNumber]) {
                return `That channel only has ${vodList.data.length} vod(s)`;
            } else {
                return `${vodList.data[vodNumber].url}?t=0s`;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}