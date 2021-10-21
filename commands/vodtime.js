require('dotenv').config();
const axios = require('axios');
const tools = require("../tools/tools.js");
const date = require('date-and-time');

module.exports = {
    name: "vodtime",
    ping: true,
    description: 'This command will give you a vod timestamp that correlates to the given time in the input. Input should be: "bb vodtime *vodlink* *time in CET*". Example: bb vodtime https://www.twitch.tv/videos/1162493551 15:00',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let vodid = input[2].split('/');
            vodid = vodid[vodid.length - 1];


            const response = await axios.get(`https://api.twitch.tv/helix/videos?id=${vodid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
                timeout: 10000
            })

            let starttime = response.data.data[0].created_at;

            let giventime = starttime.split("T");
            giventime = `${giventime[0]}T${input[3]}:00Z`;
            giventime = new Date(giventime);

            starttime = new Date(starttime);
            starttime = date.addHours(starttime, 2);


            let duration = response.data.data[0].duration;
            console.log(duration)

            let hours = "";

            let minutes = "";

            let seconds = "";

            if (duration.includes("h")) {
                duration = duration.split("h");

                hours = duration[0];

                duration = duration[1].split("m");

                minutes = duration[0];

                seconds = duration[1];

            } else {

                duration = duration.split("m");

                minutes = duration[0];

                seconds = duration[1];

            }

            seconds = seconds.replaceAll("s", "");

            let endtime = date.addHours(starttime, hours);
            endtime = date.addMinutes(endtime, minutes);
            endtime = date.addSeconds(endtime, seconds);

            let newgiventime = false;
            let otherdate = false;
            console.log(date.subtract(endtime, starttime).toDays())

            if (date.subtract(endtime, starttime).toDays() > 0) {
                newgiventime = date.addDays(giventime, 1);
                newgiventime = newgiventime.toISOString().split("T");
                newgiventime = newgiventime[0];

                let newgiventime2 = giventime.toISOString().split("T");
                newgiventime2 = newgiventime2[1];
                newgiventime = `${newgiventime}T${newgiventime2}`;
            }

            if (Date.parse(giventime) > Date.parse(endtime)) {
                return `${input[3]} is after stream end.`;
            }

            if (newgiventime !== false) {
                if (Date.parse(newgiventime) > Date.parse(endtime) && Date.parse(giventime) > Date.parse(endtime)) {
                    return `${input[3]} is after stream end.`;
                }
                if (Date.parse(giventime) < Date.parse(starttime) && Date.parse(newgiventime) > Date.parse(endtime)) {
                    return `${input[3]} is before stream start or after stream end.`;

                }
                if (Date.parse(giventime) < Date.parse(starttime)) {
                    giventime = newgiventime
                }
            } else if (Date.parse(giventime) < Date.parse(starttime)) {
                return `${input[3]} is before stream start.`;
            }

            console.log(giventime, starttime)




            const ms = Date.parse(giventime) - Date.parse(starttime)


            let timestamp = tools.humanizeDuration(ms);
            timestamp = timestamp.replaceAll(",", "");
            timestamp = timestamp.replaceAll(" ", "");
            timestamp = timestamp.replaceAll("and", "");

            return `${input[2]}?t=${timestamp}`;

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