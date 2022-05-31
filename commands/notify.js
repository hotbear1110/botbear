const tools = require("../tools/tools.js");

module.exports = {
    name: "notify",
    ping: true,
    description: 'This command will register you for chat notifications. Available notify commands: "bb notify [live/offline/title/game/all]" (you will get notified when the streamer goes live/goes offline/changes title/switches category/all of the previous)',
    permission: 100,
    category: "Notify command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            switch (input[2]) {
                case "live":
                    const liveUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let liveusers = JSON.parse(liveUsers[0].live_ping);

                    if (liveusers.includes(user.username)) {
                        return 'You already have a subscription for the event "live". If you want to unsubscribe, type "bb remove live".';
                    }
                    else {
                        liveusers.push(user.username);
                        liveusers = JSON.stringify(liveusers);

                        tools.query(`UPDATE Streamers SET live_ping=? WHERE username=?`, [liveusers, channel]);

                        return 'You are now subscribed to the event "live"';
                    }
                    break;
                case "offline":
                    const offlineUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let offlineusers = JSON.parse(offlineUsers[0].offline_ping);

                    if (offlineusers.includes(user.username)) {
                        return 'You already have a subscription for the event "offline". If you want to unsubscribe, type "bb remove offline".';
                    }
                    else {
                        offlineusers.push(user.username);
                        offlineusers = JSON.stringify(offlineusers);

                        tools.query(`UPDATE Streamers SET offline_ping=? WHERE username=?`, [offlineusers, channel]);

                        return 'You are now subscribed to the event "offline"';
                    }
                    break;
                case "title":
                    const titleUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let titleusers = JSON.parse(titleUsers[0].title_ping);

                    if (titleusers.includes(user.username)) {
                        return 'You already have a subscription for the event "title". If you want to unsubscribe, type "bb remove title".';
                    }
                    else {
                        titleusers.push(user.username);
                        titleusers = JSON.stringify(titleusers);

                        tools.query(`UPDATE Streamers SET title_ping=? WHERE username=?`, [titleusers, channel]);

                        return 'You are now subscribed to the event "title"';
                    }
                    break;
                case "game":
                    let userchannel = [];
                    userchannel.push(`"${user.username}"`);
                    userchannel.push(`"${channel}"`);


                    const alreadyJoined = await tools.query(`
                        SELECT *
                        FROM MyPing
                        WHERE username=?`,
                        [`[${userchannel}]`]);

                    if (alreadyJoined.length && alreadyJoined[0].game_pings !== "[]") {
                        return `You should remove all of you custom game pings first, by doing "bb myping remove all"`;
                    }
                    const gameUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let gameusers = JSON.parse(gameUsers[0].game_ping);

                    if (gameusers.includes(user.username)) {
                        return 'You already have a subscription for the event "game". If you want to unsubscribe, type "bb remove game".';
                    }
                    else {
                        gameusers.push(user.username);
                        gameusers = JSON.stringify(gameusers);

                        tools.query(`UPDATE Streamers SET game_ping=? WHERE username=?`, [gameusers, channel]);

                        return 'You are now subscribed to the event "game"';
                    }
                    break;
                case "all": {
                    const notifyUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    
                    let liveusers = JSON.parse(notifyUsers[0].live_ping);
                    let offlineusers = JSON.parse(notifyUsers[0].offline_ping);
                    let titleusers = JSON.parse(notifyUsers[0].title_ping);
                    let gameusers = JSON.parse(notifyUsers[0].game_ping);

                    if(!liveusers.includes(user.username) || !titleusers.includes(user.username) || !gameusers.includes(user.username) || !offlineusers.includes(user.username)){
                        if (!liveusers.includes(user.username)) {
                            liveusers.push(user.username);
                            liveusers = JSON.stringify(liveusers);

                            tools.query(`UPDATE Streamers SET live_ping=? WHERE username=?`, [liveusers, channel]);
                        }
                        if (!offlineusers.includes(user.username)) {
                            offlineusers.push(user.username);
                            offlineusers = JSON.stringify(offlineusers);

                            tools.query(`UPDATE Streamers SET offline_ping=? WHERE username=?`, [offlineusers, channel]);
                        }
                        if (!titleusers.includes(user.username)) {
                            titleusers.push(user.username);
                            titleusers = JSON.stringify(titleusers);

                            tools.query(`UPDATE Streamers SET title_ping=? WHERE username=?`, [titleusers, channel]);

                        }
                        if (!gameusers.includes(user.username)) {
                            gameusers.push(user.username);
                            gameusers = JSON.stringify(gameusers);

                            tools.query(`UPDATE Streamers SET game_ping=? WHERE username=?`, [gameusers, channel]);                           
                        }
                        return `You are now subscribed to all events`;
                    } else { 
                        return `You are already subscribed to all events`;
                    }
                    }
                    break;
                default:
                    return `Please specify an event to subscribe to. The following events are available: live, offline, title, game, all`;
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}
