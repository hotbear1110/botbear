const tools = require("../tools/tools.js");
const axios = require('axios');

module.exports = {
    name: "title",
    ping: true,
    description: "This command will give you the title of a given streamer",
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
            let title = "";
            const streamTitle = await tools.query(`SELECT * FROM Streamers WHERE username=?`, [realchannel]);
            if (!streamTitle[0]) {
                let userID = await axios.get(`https://api.ivr.fi/twitch/resolve/${input[2]}`, { timeout: 10000 });

                userID = userID.data.id;

                title = await axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${userID}`, {
                    headers: {
                        'client-id': process.env.TWITCH_CLIENTID,
                        'Authorization': process.env.TWITCH_AUTH
                    },
                    timeout: 10000
                });
                title = title.data.data[0].title;
            } else {
                let oldtitleTime = JSON.parse(streamTitle[0].title_time);
                title = streamTitle[0].title;

                if (oldtitleTime !== null) {
                    const ms = new Date().getTime() - oldtitleTime;

                    return `#${realchannel[0]}\u{E0000}${realchannel.slice(1)} has had the title: "${title}", for ${tools.humanizeDuration(ms)}`;
                }
            }


            return `#${realchannel}'s current title is: "${title}"`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}