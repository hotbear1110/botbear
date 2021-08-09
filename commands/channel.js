require('dotenv').config()
const tools = require("../tools/tools.js")
const cc = require("../bot.js").cc;
const axios = require('axios');

module.exports = {
    name: "channel",
    execute: async (channel, user, input) => {
        try {
            switch (input[2]) {
                case "join":
                    if (channel != "botbear1110" && channel != "hotbear1110") { return; }
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
                        cc.say(`#${username}`, '👋 nymnDank');
                        return `Joined channel: ${username}`

                    }
                    break;
                case "leave":
                    let username2 = user.username;
                    if (channel != "botbear1110" && channel != "hotbear1110" && channel != user.username) { return; }
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
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}