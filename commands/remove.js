const { channels } = require("../connect/connect.js");
const tools = require("../tools/tools.js");


module.exports = {
    name: "remove",
    ping: true,
    description: "Removes you from the ping list, for when the streamer, goes live, changes title or changes game.",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            switch (input[2]) {
                case "live":
                    const liveUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let liveusers = JSON.parse(liveUsers[0].live_ping);

                    if (liveusers.includes(user.username)) {
                        liveusers.splice(liveusers.indexOf(user.username), 1);
                        liveusers = JSON.stringify(liveusers);

                        tools.query(`UPDATE Streamers SET live_ping=? WHERE username=?`, [liveusers, channel]);

                        return `You are now unsubscribed from the event "live"`;
                    }
                    else {
                        return 'You do not have a subscription for the event "live". If you want to subscribe, type "bb notify live".';
                    }
                    break;
                case "title":
                    const titleUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let titleusers = JSON.parse(titleUsers[0].title_ping);

                    if (titleusers.includes(user.username)) {
                        titleusers.splice(titleusers.indexOf(user.username), 1);
                        titleusers = JSON.stringify(titleusers);

                        tools.query(`UPDATE Streamers SET title_ping=? WHERE username=?`, [titleusers, channel]);

                        return `You are now unsubscribed from the event "title"`;
                    }
                    else {
                        return 'You do not have a subscription for the event "title". If you want to subscribe, type "bb notify title".';
                    }
                    break;
                case "game":
                    const gameUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let gameusers = JSON.parse(gameUsers[0].game_ping);

                    if (gameusers.includes(user.username)) {
                        gameusers.splice(gameusers.indexOf(user.username), 1);
                        gameusers = JSON.stringify(gameusers);

                        tools.query(`UPDATE Streamers SET game_ping=? WHERE username=?`, [gameusers, channel]);

                        return `You are now unsubscribed from the event "game"`;
                    }
                    else {
                        return 'You do not have a subscription for the event "game". If you want to subscribe, type "bb notify game".';
                    }
                default:
                    return `Please specify an event to un-subscribe to. The following events are available: live, title, game`;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}