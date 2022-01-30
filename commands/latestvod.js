const got = require("got");

module.exports = {
    name: "latestvod",
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
                try {
                    vodNumber = parseInt(input[3] - 1);
                } catch (err) {
                    console.log(err);
                    return "Last input should be a number";
                }
            }

            const userID = await got(`https://api.ivr.fi/twitch/resolve/${realchannel}`, { timeout: 10000 }).json();

            if (userID.status === 404) {
                return `Could not find user: "${realchannel}"`;
            }

            let vodList = await got(`https://api.twitch.tv/helix/videos?user_id=${userID.id}&type=archive&first=100`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            }).json();

            if (!vodList.data.length) {
                return `That channel has no vods`;
            } else if (vodNumber > 99) {
                let vodDate = vodList.data[vodList.data.length - 1].created_at;
                vodDate = vodDate.split("T")[0];
                return `I can only go 100 vods back, but here is the oldest available vod - ${vodList.data[vodList.data.length - 1].url} (${vodList.data.length} - ${vodDate})`
            } else if (!vodList.data[vodNumber]) {
                let vodDate = vodList.data[vodList.data.length - 1].created_at;
                vodDate = vodDate.split("T")[0];
                return `That channel only has ${vodList.data.length} vod(s), here is the oldest vod - ${vodList.data[vodList.data.length - 1].url} - ${vodDate}`;
            } else {
                let vodDate = vodList.data[vodNumber].created_at;
                vodDate = vodDate.split("T")[0];
                return `${vodList.data[vodNumber].url}?t=0s - ${vodDate}`;
            }
        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error: ${err.response.data.error}`;
        }
    }
}