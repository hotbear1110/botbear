const tools = require("../tools/tools.js");

module.exports = {
    name: "notify",
    execute: async (data, input) => {
        try {
            switch (input[2]) {
                case "live":
                    const getUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${data.channelName}"`)
                    let users = JSON.parse(getUsers[0].ping_users)

                    if (users.includes(data.senderUsername)) {
                        return 'You already have a subscription for the event "live". If you want to unsubscribe, type "bb remove live".'
                    }
                    else {
                        users.push(data.senderUsername)
                        users = JSON.stringify(users)

                        tools.query(`UPDATE Streamers SET ping_users=? WHERE username=?`, [users, data.channelName])

                        return 'You are now subscribed to the event "live"'
                    }


                    break;
                case "title":
                    // add user to title notify list
                    break;
                case "game":
                // add user to gamenotify list
                default:
                    return `Please specify an event to subscribe to. The following events are available: live (might add more stuff later) `
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}