const { channels } = require("../connect/connect.js");
const tools = require("../tools/tools.js");
const sql = require("./../sql/index.js");

module.exports = {
    name: "remove",
    ping: true,
    description: 'This command will unregister you from chat notifications. Available notify commands: "bb remove [live/offline/title/game/all]"(you will now not get notified when the streamer goes live/goes offline/changes title/switches category/all of the previous)',
    permission: 100,
    category: "Notify command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            switch (input[2]) {
                case "live":
                    const liveUsers = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let liveusers = JSON.parse(liveUsers[0].live_ping);

                    if (liveusers.includes(user.username)) {
                        liveusers.splice(liveusers.indexOf(user.username), 1);
                        liveusers = JSON.stringify(liveusers);

                        sql.Query(`UPDATE Streamers SET live_ping=? WHERE username=?`, [liveusers, channel]);

                        return `You are now unsubscribed from the event "live"`;
                    }
                    else {
                        return 'You do not have a subscription for the event "live". If you want to subscribe, type "bb notify live".';
                    }
                    break;
                case "offline":
                    const offlineUsers = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let offlineusers = JSON.parse(offlineUsers[0].offline_ping);

                    if (offlineusers.includes(user.username)) {
                        offlineusers.splice(offlineusers.indexOf(user.username), 1);
                        offlineusers = JSON.stringify(offlineusers);

                        sql.Query(`UPDATE Streamers SET offline_ping=? WHERE username=?`, [offlineusers, channel]);

                        return `You are now unsubscribed from the event "offline"`;
                    }
                    else {
                        return 'You do not have a subscription for the event "offline". If you want to subscribe, type "bb notify offline".';
                    }
                    break;
                case "title":
                    const titleUsers = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let titleusers = JSON.parse(titleUsers[0].title_ping);

                    if (titleusers.includes(user.username)) {
                        titleusers.splice(titleusers.indexOf(user.username), 1);
                        titleusers = JSON.stringify(titleusers);

                        sql.Query(`UPDATE Streamers SET title_ping=? WHERE username=?`, [titleusers, channel]);

                        return `You are now unsubscribed from the event "title"`;
                    }
                    else {
                        return 'You do not have a subscription for the event "title". If you want to subscribe, type "bb notify title".';
                    }
                    break;
                case "game":
                    const gameUsers = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let gameusers = JSON.parse(gameUsers[0].game_ping);

                    if (gameusers.includes(user.username)) {
                        gameusers.splice(gameusers.indexOf(user.username), 1);
                        gameusers = JSON.stringify(gameusers);

                        sql.Query(`UPDATE Streamers SET game_ping=? WHERE username=?`, [gameusers, channel]);

                        return `You are now unsubscribed from the event "game"`;
                    }
                    else {
                        return 'You do not have a subscription for the event "game". If you want to subscribe, type "bb notify game".';
                    }
                    break;
                case "all": {
                    const notifyUsers = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let liveusers = JSON.parse(notifyUsers[0].live_ping);
                    let offlineusers = JSON.parse(notifyUsers[0].offline_ping);
                    let titleusers = JSON.parse(notifyUsers[0].title_ping);
                    let gameusers = JSON.parse(notifyUsers[0].game_ping);

                    if (liveusers.includes(user.username) || titleusers.includes(user.username) || gameusers.includes(user.username) || offlineusers.includes(user.username)) {
                        if (liveusers.includes(user.username)) {
                            liveusers.splice(liveusers.indexOf(user.username), 1);
                            liveusers = JSON.stringify(liveusers);

                            sql.Query(`UPDATE Streamers SET live_ping=? WHERE username=?`, [liveusers, channel]);
                        }
                        if (offlineusers.includes(user.username)) {
                            offlineusers.splice(offlineusers.indexOf(user.username), 1);
                            offlineusers = JSON.stringify(offlineusers);

                            sql.Query(`UPDATE Streamers SET offline_ping=? WHERE username=?`, [offlineusers, channel]);
                        }
                        if (titleusers.includes(user.username)) {
                            titleusers.splice(titleusers.indexOf(user.username), 1);
                            titleusers = JSON.stringify(titleusers);

                            sql.Query(`UPDATE Streamers SET title_ping=? WHERE username=?`, [titleusers, channel]);

                        }

                        if (gameusers.includes(user.username)) {
                            gameusers.splice(gameusers.indexOf(user.username), 1);
                            gameusers = JSON.stringify(gameusers);

                            sql.Query(`UPDATE Streamers SET game_ping=? WHERE username=?`, [gameusers, channel]);
                        }
                        return `You are no longer subscribed to any events`;
                    } else {
                        return `You aren't subscribed to any events. If you want to subscribe, type "bb notify [live/title/game/all]".`;
                    }
                }
                    break;
                default:
                    return `Please specify an event to un-subscribe to. The following events are available: live, offline, title, game, all`;
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}
