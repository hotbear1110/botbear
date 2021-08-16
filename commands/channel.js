require('dotenv').config()
const tools = require("../tools/tools.js")
const cc = require("../bot.js").cc;
const axios = require('axios');

module.exports = {
    name: "channel",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            if (channel === "forsen") {
                channel = "botbear1110"
            }
            switch (input[2]) {
                case "join":
                    input = msg.toLowerCase().split(" ");
                    if (channel != "botbear1110" && channel != "hotbear1110" && user.username != "hotbear1110") { return; }
                    let username = user.username;
                    let uid = user['user-id'];

                    if (input[3] && user.username !== input[3] && user['user-id'] != process.env.TWITCH_OWNERUID) {
                        return "I can only join your channel!";
                    }
                    if (input[3]) {
                        let streamer = await axios.get(`https://api.ivr.fi/twitch/resolve/${input[3]}`)
                        uid = streamer.data.id
                        username = input[3];
                    }

                    const alreadyJoined = await tools.query(`
                SELECT *
                FROM Streamers
                WHERE username=?`,
                        [username]);

                    if (alreadyJoined.length) {
                        return "I am already in your channel :)"
                    }

                    else {
                        let islive = 0;
                        let liveemote = "FeelsOkayMan";
                        let offlineemote = "FeelsBadMan";

                        await tools.query('INSERT INTO Streamers (username, uid, islive, liveemote, offlineemote, live_ping, title_ping, game_ping) values (?, ?, ? ,?, ?, ?, ?, ?)', [username, uid, islive, liveemote, offlineemote, '[""]', '[""]', '[""]']);
                        cc.join(username).then((data) => {
                            // data returns [channel]
                        }).catch((err) => {
                            console.log(err)
                        });
                        cc.say(`#${username}`, '👋 nymnDank Hello!');
                        return `Joined channel: ${username}`

                    }
                    break;
                case "leave":
                    input = msg.toLowerCase().split(" ");
                    let username2 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && user.username != "hotbear1110") { return; }
                    if (input[3]) {
                        username2 = input[3];
                    }

                    if (input[3] && user.username !== input[3] && user['user-id'] != process.env.TWITCH_OWNERUID) {
                        return "You can only make me leave your own channel";
                    }

                    const alreadyJoined2 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username2]);

                    if (!alreadyJoined2.length) {
                        return "I am not in your channel"
                    }

                    else {
                        await tools.query('DELETE FROM Streamers WHERE username=?', [username2]);
                        cc.say(`#${username2}`, '👋 nymnDank bye!');
                        cc.part(username2).then((data) => {
                            // data returns [channel]
                        }).catch((err) => {
                            console.log(err)
                        });
                        return `Left channel: ${username2}`

                    }
                    break;
                case "liveemote":
                    input = msg.split(" ");
                    let username3 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && user.username != "hotbear1110") { return; }
                    if (!input[3]) {
                        return;
                    }

                    const alreadyJoined3 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username3]);

                    if (!alreadyJoined3.length) {
                        return "I am not in your channel"
                    }

                    else {
                        await tools.query(`UPDATE Streamers SET liveemote=? WHERE username=?`, [input[3], username3])
                        return `Live emote is now set to ${input[3]}`
                    }
                    break;
                case "gameemote":
                    input = msg.split(" ");
                    let username4 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && user.username != "hotbear1110") { return; }
                    if (!input[3]) {
                        return;
                    }

                    const alreadyJoined4 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username4]);

                    if (!alreadyJoined4.length) {
                        return "I am not in your channel"
                    }

                    else {
                        await tools.query(`UPDATE Streamers SET gameemote=? WHERE username=?`, [input[3], username4])
                        return `Game emote is now set to ${input[3]}`
                    }
                    break;
                case "titleemote":
                    input = msg.split(" ");
                    let username5 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username && user.username != "hotbear1110") { return; }
                    if (!input[3]) {
                        return;
                    }

                    const alreadyJoined5 = await tools.query(`
                            SELECT *
                            FROM Streamers
                            WHERE username=?`,
                        [username5]);

                    if (!alreadyJoined5.length) {
                        return "I am not in your channel"
                    }

                    else {
                        await tools.query(`UPDATE Streamers SET titleemote=? WHERE username=?`, [input[3], username5])
                        return `Title emote is now set to ${input[3]}`
                    }

                    break;
                default:
                    return "Please specify if you want the bot to leave or join your channel, by writing either 'bb channel join' or 'bb channel leave'"
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}