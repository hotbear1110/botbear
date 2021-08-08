const tools = require("../tools/tools.js");

module.exports = {
    name: "notify",
    execute: async (data, input) => {
        try {
            switch (input[2]) {
                case "live":
                    const liveUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${data.channelName}"`)
                    let liveusers = JSON.parse(liveUsers[0].live_ping)

                    if (liveusers.includes(data.senderUsername)) {
                        return 'You already have a subscription for the event "live". If you want to unsubscribe, type "bb remove live".'
                    }
                    else {
                        liveusers.push(data.senderUsername)
                        liveusers = JSON.stringify(liveusers)

                        tools.query(`UPDATE Streamers SET live_ping=? WHERE username=?`, [liveusers, data.channelName])

                        return 'You are now subscribed to the event "live"'
                    }
                    break;
                case "title":
                    const titleUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${data.channelName}"`)
                    let titleusers = JSON.parse(titleUsers[0].title_ping)

                    if (titleusers.includes(data.senderUsername)) {
                        return 'You already have a subscription for the event "title". If you want to unsubscribe, type "bb remove title".'
                    }
                    else {
                        titleusers.push(data.senderUsername)
                        titleusers = JSON.stringify(titleusers)

                        tools.query(`UPDATE Streamers SET title_ping=? WHERE username=?`, [titleusers, data.channelName])

                        return 'You are now subscribed to the event "title"'
                    }
                    break;
                case "game":
                    const gameUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${data.channelName}"`)
                    let gameusers = JSON.parse(gameUsers[0].game_ping)

                    if (gameusers.includes(data.senderUsername)) {
                        return 'You already have a subscription for the event "game". If you want to unsubscribe, type "bb remove game".'
                    }
                    else {
                        gameusers.push(data.senderUsername)
                        gameusers = JSON.stringify(gameusers)

                        tools.query(`UPDATE Streamers SET game_ping=? WHERE username=?`, [gameusers, data.channelName])

                        return 'You are now subscribed to the event "game"'
                    }
                default:
                    return `Please specify an event to subscribe to. The following events are available: live, title, game`
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}