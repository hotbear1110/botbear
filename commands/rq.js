const got = require("got");
const tools = require("../tools/tools.js");


module.exports = {
    name: "rq",
    ping: true,
    description: 'This command will give you a random logged line from either yourself or a specified user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb rl NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let uid = user["user-id"];
            let realuser = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                uid = await got(`https://api.ivr.fi/twitch/resolve/${input[2]}`, { timeout: 10000 }).json();
                uid = uid.id;
                realuser = input[2];
            }
            let realchannel = channel;
            if (input[3]) {
                realchannel = input[3];
            }

            let logDate = await got(`https://logs.ivr.fi/list?channel=${realchannel}&userid=${uid}`, { timeout: 10000 }).json();

            logDate = logDate.availableLogs;


            let logsOrder = [...Array(logDate.length).keys()];
            logsOrder = shuffle(logsOrder);
            let messageFound = false;
            let i = 0;
            let realmessages = "";
            let rl = "";
            while (!messageFound) {
                let year = logDate[logsOrder[i]].year;
                let month = logDate[logsOrder[i]].month;

                rl = await got(`https://logs.ivr.fi/channel/${realchannel}/userid/${uid}/${year}/${month}?json`, { timeout: 10000 }).json();

                function filterByID(message) {
                    if (message.type !== 1) {
                        return false
                    }
                    return true
                }

                realmessages = rl.messages.filter(filterByID);


                i++
                if (realmessages[0]) {
                    messageFound = true;
                    let number = Math.floor(Math.random() * realmessages.length);
                    realmessages = realmessages[number];
                } else if (i > logsOrder.length - 1) {
                    return `FeelsDankMan @${realuser}, has never said anything in #${realchannel}`;
                }
            }

            let message = tools.splitLine(realmessages.text, 350)

            const timeago = new Date().getTime() - Date.parse(realmessages.timestamp);

            if (rl.status !== 404) {
                if (message[1]) {
                    return `#${realchannel} ${rl.messages[0].displayName}: ${message[0]}... - (${tools.humanizeDuration(timeago)} ago)`;
                }
                return `#${realchannel[0]}\u{E0000}${realchannel.slice(1)} ${realmessages.displayName}: ${message} - (${tools.humanizeDuration(timeago)} ago)`;
            }

        } catch (err) {
            console.log(err);
            if (err.toString().startsWith("HTTPError: Response code 403 (Forbidden)")) {
                return "User or channel has opted out";
            }
            if (err.toString().startsWith("HTTPError: Response code 500 (Internal Server Error)")) {
                return "Could not load logs. Most likely the user either doesn't exist or doesn't have any logs here.";
            }
            if (err.name) {
                if (err.name === "HTTPError") {
                    return "That user does not exist";
                }
                return `FeelsDankMan api error: ${err.name}`;
            }
            return `FeelsDankMan Error`;
        }
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}