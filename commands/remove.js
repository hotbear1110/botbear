const db = require('../connect/connect.js');
const tools = require("../tools/tools.js");


module.exports = {
    name: "remove",
    execute: async (data, input) => {
        try {
            switch (input[1]) {
                case "live":
                    const getUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${data.channelName}"`)
                    let users = JSON.parse(getUsers[0].ping_users)

                    if (users.includes(data.senderUsername)) {
                        users.splice(users.indexOf(data.senderUsername), 1);
                        users = JSON.stringify(users)


                        return `You are now unsubscribed from the event "live"`;
                    }
                    else {
                        return `You do not have a subscription for the event "live". If you want to subscribe, type "``notifyme live". `;
                    }
                    break;
                case "title":
                    // remove user from title notify list
                    break;
                case "game":
                // remove user from gamenotify list
                default:
                    return `Please specify an event to un-subscribe to. The following events are available: live (might add more stuff later) `;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}