const tools = require("../tools/tools.js");

module.exports = {
    name: "notify",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            switch (input[2]) {
                case "live":
                    const liveUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`)
                    let liveusers = JSON.parse(liveUsers[0].live_ping)

                    if (liveusers.includes(user.username)) {
                        return 'You already have a subscription for the event "live". If you want to unsubscribe, type "bb remove live".'
                    }
                    else {
                        liveusers.push(user.username)
                        liveusers = JSON.stringify(liveusers)

                        tools.query(`UPDATE Streamers SET live_ping=? WHERE username=?`, [liveusers, channel])

                        return 'You are now subscribed to the event "live"'
                    }
                    break;
                case "title":
                    const titleUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`)
                    let titleusers = JSON.parse(titleUsers[0].title_ping)

                    if (titleusers.includes(user.username)) {
                        return 'You already have a subscription for the event "title". If you want to unsubscribe, type "bb remove title".'
                    }
                    else {
                        titleusers.push(user.username)
                        titleusers = JSON.stringify(titleusers)

                        tools.query(`UPDATE Streamers SET title_ping=? WHERE username=?`, [titleusers, channel])

                        return 'You are now subscribed to the event "title"'
                    }
                    break;
                case "game":
                    let userchannel = []
                    userchannel.push(`"${user.username}"`)
                    userchannel.push(`"${channel}"`)


                    const alreadyJoined = await tools.query(`
                        SELECT *
                        FROM MyPing
                        WHERE username=?`,
                        [`[${userchannel}]`]);

                    if (alreadyJoined.length || alreadyJoined.game_pings == "[]") {
                        return `You should remove all of you custom game pings first, by doing "bb myping remove all"`
                    }
                    const gameUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`)
                    let gameusers = JSON.parse(gameUsers[0].game_ping)

                    if (gameusers.includes(user.username)) {
                        return 'You already have a subscription for the event "game". If you want to unsubscribe, type "bb remove game".'
                    }
                    else {
                        gameusers.push(user.username)
                        gameusers = JSON.stringify(gameusers)

                        tools.query(`UPDATE Streamers SET game_ping=? WHERE username=?`, [gameusers, channel])

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