require('dotenv').config();
const axios = require('axios');
const tools = require("../tools/tools.js");
const date = require('date-and-time');

module.exports = {
    name: "vodtime",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let vodid = input[2].split('/');
            vodid = vodid[vodid.length - 1];


            const response = await axios.get(`https://api.twitch.tv/helix/videos?id=${vodid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                }
            })

            let starttime = response.data.data[0].created_at;

            let giventime = starttime.split("T");
            giventime = `${giventime[0]}T${input[3]}:00Z`;
            giventime = new Date(giventime);

            starttime = new Date(starttime);
            starttime = date.addHours(starttime, 2);


            let duration = response.data.data[0].duration;
            console.log(duration)
            duration = duration.split("h");

            let hours = duration[0];

            duration = duration[1].split("m");

            let minutes = duration[0];

            let seconds = duration[1];

            seconds = seconds.replaceAll("s", "");

            let endtime = date.addHours(starttime, hours);
            endtime = date.addMinutes(endtime, minutes);
            endtime = date.addSeconds(endtime, seconds);

            let newgiventime = false;
            let otherdate = false;
            console.log(date.subtract(endtime, starttime).toDays())

            if (date.subtract(endtime, starttime).toDays() > 0) {
                newgiventime = date.addDays(giventime, 1);
                newgiventime = newgiventime.toString().split("T");
                newgiventime = newgiventime[0];

                let newgiventime2 = giventime.toString().split("T");
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




            const ms = Date.parse(giventime) - Date.parse(starttime)


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