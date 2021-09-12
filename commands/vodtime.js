require('dotenv').config();
const axios = require('axios');
const tools = require("../tools/tools.js");

module.exports = {
    name: "vodtime",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let vodid = input[2].split('/');
            console.log(vodid)
            vodid = vodid[vodid.length - 1];
            console.log(vodid)
            let CETfix = input[3].split(":")
            let CEToffset = CETfix[0] - 2
            if (CEToffset < 10) {
                CEToffset = `0${CEToffset}`
            }
            CETfix = `${CEToffset}:${CETfix[1]}`

            const response = await axios.get(`https://api.twitch.tv/helix/videos?id=${vodid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                }
            })

            console.log(response.data.data[0].created_at)
            let starttime = response.data.data[0].created_at;
            let giventime = starttime.split("T");
            giventime = `${giventime[0]}T${CETfix}:00Z`
            console.log(Date.parse(giventime))

            const ms = Date.parse(giventime) - Date.parse(starttime)

            console.log(tools.humanizeDuration(ms))

            let timestamp = tools.humanizeDuration(ms);
            timestamp = timestamp.replaceAll(",", "");
            timestamp = timestamp.replaceAll(" ", "");
            timestamp = timestamp.replaceAll("and", "");

            return `${input[2]}?t=${timestamp}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}