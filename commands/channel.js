require('dotenv').config();
const tools = require("../tools/tools.js");
const cc = require("../bot.js").cc;
const axios = require('axios');

module.exports = {
    name: "channel",
    ping: true,
    description: '"bb channel join/leave" the bot joins or leaves your channel(only works in hotbear1110/botbear1110 chats). "bb channel [live/offline/title/game]emote *emote*" this changes the notify emotes. "bb channel trivia *seconds*" this changes the trivia cooldown(Default is 300s, if cd is too low, it can bug out)',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (channel === "forsen") {
                channel = "botbear1110";
            }
            switch (input[2]) {
                case "join":
                    console.log(channel);
                    if (channel !== "botbear1110" && channel !== "hotbear1110" && perm < 2000) { return; }
                    let username = user.username;
                    let uid = user['user-id'];

                    if (input[3] && user['user-id'] != process.env.TWITCH_OWNERUID && !cc.isMod(`#${input[3]}`, user.username)) {
                        if (input[3] !== username) {
                            return;
                        }
                    }

                    if (input[3]) {
                        let streamer = await axios.get(`https://api.ivr.fi/twitch/resolve/${input[3]}`, { timeout: 10000 });
                        uid = streamer.data.id;
                        username = input[3];
                    }

                    const alreadyJoined = await tools.query(`
                SELECT *
                FROM Streamers
                WHERE username=?`,
                        [username]);

                    if (alreadyJoined.length) {
                        return "I am already in your channel :)";
                    }

                    else {
                        let islive = 0;
                        let liveemote = "FeelsOkayMan";
                        let offlineemote = "FeelsBadMan";
                        let gameTime = new Date().getTime();

                        await tools.query('INSERT INTO Streamers (username, uid, islive, liveemote, titleemote, gameemote, offlineemote, live_ping, title_ping, game_ping, game_time, emote_list, emote_removed, disabled_commands) values (?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?)', [username, uid, islive, liveemote, liveemote, liveemote, offlineemote, '[""]', '[""]', '[""]', gameTime, '[]', '[]', '[]']);
                        cc.join(username).then((data) => {
                            // data returns [channel]
                        }).catch((err) => {
                            console.log(err);
                        });
                        cc.say(`#${username}`, '👋 nymnDank Hello!');
                        return `Joined channel: ${username}`;

                    }
                    break;
                case "leave":
                    let username2 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && perm < 2000) { return; }
                    if (input[3]) {
                        username2 = input[3];
                    }

                    if (input[3] && user['user-id'] != process.env.TWITCH_OWNERUID && !cc.isMod(`#${input[3]}`, user.username)) {
                        return "You can only make me leave your own channel, or a channel you are mod in.";
                    }

                    const alreadyJoined2 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username2]);

                    if (!alreadyJoined2.length) {
                        return "I am not in your channel";
                    }

                    else {
                        await tools.query('DELETE FROM Streamers WHERE username=?', [username2]);
                        cc.say(`#${username2}`, '👋 nymnDank bye!');
                        cc.part(username2).then((data) => {
                            // data returns [channel]
                        }).catch((err) => {
                            console.log(err);
                        });
                        return `Left channel: ${username2}`;

                    }
                    break;
                case "liveemote":
                    let username3 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && perm < 2000 && !user.mod) { return; }
                    if (!input[3]) {
                        return;
                    }

                    if (user.mod) {
                        username3 = channel;
                    }


                    const alreadyJoined3 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username3]);

                    if (!alreadyJoined3.length) {
                        return "I am not in your channel";
                    }

                    else {
                        await tools.query(`UPDATE Streamers SET liveemote=? WHERE username=?`, [input[3], username3])
                        return `Live emote is now set to ${input[3]}`;
                    }
                    break;
                case "gameemote":
                    let username4 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && perm < 2000 && !user.mod) { return; }
                    if (!input[3]) {
                        return;
                    }

                    if (user.mod) {
                        username4 = channel;
                    }


                    const alreadyJoined4 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username4]);

                    if (!alreadyJoined4.length) {
                        return "I am not in your channel";
                    }

                    else {
                        await tools.query(`UPDATE Streamers SET gameemote=? WHERE username=?`, [input[3], username4])
                        return `Game emote is now set to ${input[3]}`;
                    }
                    break;
                case "titleemote":
                    let username5 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && perm < 2000 && !user.mod) { return; }
                    if (!input[3]) {
                        return;
                    }

                    if (user.mod) {
                        username5 = channel;
                    }


                    const alreadyJoined5 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username5]);

                    if (!alreadyJoined5.length) {
                        return "I am not in your channel";
                    }

                    else {
                        await tools.query(`UPDATE Streamers SET titleemote=? WHERE username=?`, [input[3], username5])
                        return `Title emote is now set to ${input[3]}`;
                    }
                    break;
                case "offlineemote":
                    let username6 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && perm < 2000 && !user.mod) { return; }
                    if (!input[3]) {
                        return;
                    }

                    if (user.mod) {
                        username6 = channel;
                    }

                    const alreadyJoined6 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username6]);

                    if (!alreadyJoined6.length) {
                        return "I am not in your channel";
                    }

                    else {
                        await tools.query(`UPDATE Streamers SET offlineemote=? WHERE username=?`, [input[3], username6])
                        return `Offline emote is now set to ${input[3]}`;
                    }
                    break;

                case "trivia": {
                    if (!tools.isMod(user, channel)) {
                        return;
                    }

                    if (input[3] === undefined) {
                        return "NotLikeThis . This command requires a parameter with the cooldown on trivia. This is set to seconds!"
                    }

                    const cooldown = (input[3] * 1000);

                    return await tools.query("UPDATE `Streamers` SET `trivia_cooldowns` = ? WHERE `username` = ?", [cooldown, channel]).then(() => {
                        return `BloodTrail Successfully set the cooldown of trivia in this channel to ${input[3]}s`;
                    }).catch((error) => {
                        cc.say("botbear1110", JSON.stringify(error));
                        return "NotLikeThis UhOh! Error!";
                    });
                }

                default:
                    return "Available channel commands: join/leave, [live/offline/title/game]emote, trivia";
            }
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
