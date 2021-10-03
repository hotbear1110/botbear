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
            const gameTimedata = await tools.query(`SELECT * FROM Streamers WHERE username=?`, [channel]);
            let oldgameTime = JSON.parse(gameTimedata[0].game_time);
            const ms =  new Date().getTime() - oldgameTime;

            let game = gameTimedata[0].game;

            return `#${channel} has been in the category: (${game}), for ${tools.humanizeDuration(ms)}`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}