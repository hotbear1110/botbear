const axios = require('axios');
const _ = require("underscore");
const requireDir = require("require-dir");


module.exports = {
    name: "vodsearch",
    ping: true,
    description: 'This command will give you a list of vods that correlates to the given date and time input. Input should be: "bb vodsearch yyyy-mm-dd time=*time in CET*"(The time is not needed if you just wish to find the vod with no timestamp). Example: "bb vodsearch nymn 2021-09-30 time=16:00" or  "bb vodsearch nymn 2021-09-30"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realchannel = input[2];
            let voddate = input[3];
            let vodtime = null;

            if (input[4]) {
                if (input[4].startsWith("time")) {
                    vodtime = input[4].split("=")[1];
                } else {
                    return `To specify time, do: "time=hh:mm" at the end (Time should be in CET)`;
                }
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
                return `That user has no vods`;
            }

            let vodfound = 0;
            let urls = [];


            _.each(vodList.data, async function (vod) {
                if (vod.created_at.split("T")[0] === voddate) {
                    vodfound = 1;
                    urls.push(vod.url);
                    return;
                }
            })
            if (vodfound === 0) {
                return `No vod was found on that date (date format should be "yyyy-mm-dd")`;
            }

            if (vodtime === null) {
                return `${urls.length} vod('s) were found on that date: ${urls.toString().replaceAll(",", " - ")}`
            }

            const findTime = requireDir("../commands");

            results = new Promise(async function (resolve) {
                let timeFound = null;
                _.each(urls, async function (url) {
                    let result = await findTime["vodtime"].execute(channel, user, ["bb", "vodtime", url, vodtime], perm);
                    console.log(result)

                    if (!result.startsWith(vodtime)) {
                        console.log("yes")
                        timeFound = result;
                        resolve(timeFound);
                    }
                })
            })

            if (await results === null) {
                return `No vod were found at that time, but here are the vod('s) from that date: ${urls.toString().replaceAll(",", " - ")}`;
            }

            return await results;





        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}