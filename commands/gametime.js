const tools = require("../tools/tools.js");

module.exports = {
    name: "gametime",
    ping: true,
    description: "Responds with the amount of time, the streamer has been in the current category",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (this.permission > perm) {
                return;
            }
            const gameTimedata = await tools.query(`SELECT * FROM Streamers WHERE username=?`, [channel]);
            let oldgameTime = JSON.parse(gameTimedata[0].game_time);
            const ms =  new Date().getTime() - oldgameTime;

            let game = gameTimedata[0].game;

            return `#${channel}ﾠhas been in the category: (${game}), for ${tools.humanizeDuration(ms)}`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}