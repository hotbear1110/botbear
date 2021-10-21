const axios = require('axios');

module.exports = {
    name: "totalvods",
    ping: true,
    description: 'This command will give the total amount of available vods. I can only get the last 100 vods',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realchannel = channel;

            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                realchannel = input[2];
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
            } else {
                return `This channel has ${vodList.data.length} vod(s)`;
            }
        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan Banphrase api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error: ${err.response.data.error}`;    
        }
    }
}