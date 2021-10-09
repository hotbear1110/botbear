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
            if (!gameTimedata) {
                return "That streamer is not in my database";
            }
            let oldgameTime = JSON.parse(gameTimedata[0].game_time);
            const ms =  new Date().getTime() - oldgameTime;

            let game = gameTimedata[0].game;

            return `#${realchannel} has been in the category: (${game}), for ${tools.humanizeDuration(ms)}`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}