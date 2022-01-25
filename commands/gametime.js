const tools = require("../tools/tools.js");

module.exports = {
    name: "gametime",
    ping: true,
    description: "This command gives you the amount a time the streamer has been in the current category",
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realchannel = channel;

            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                realchannel = input[2];
            }
            const gameTimedata = await tools.query(`SELECT * FROM Streamers WHERE username=?`, [realchannel]);
            if (!gameTimedata[0]) {
                return "That streamer is not in my database";
            }
            let game = gameTimedata[0].game;

            let oldgameTime = JSON.parse(gameTimedata[0].game_time);
            if (oldgameTime !== null && oldgameTime !== 2147483647) {


                console.log
                const ms = new Date().getTime() - oldgameTime;


                return `#${realchannel[0]}\u{E0000}${realchannel.slice(1)} has been in the category: (${game}), for ${tools.humanizeDuration(ms)}`;
            }
            return `#${realchannel}'s current game is: (${game})`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}