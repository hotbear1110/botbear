const tools = require("../tools/tools.js");

module.exports = {
    name: "offlineonly",
    ping: true,
    description: 'This command will let you change the bot to/from offline only mode (toggle), live/game/title notify will still work!',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (!tools.isMod(user, channel) && perm < 2000) {
                return;
            }
            const offlinemode = await tools.query(`
            SELECT offlineonly
            FROM Streamers
            WHERE username=?`,
                [channel]);

            let mode = Math.abs(offlinemode[0].offlineonly - 1);

            await tools.query(`UPDATE Streamers SET offlineonly=? WHERE username=?`, [mode, channel]);

            if (mode === 1) {
                return "Offline only mode is now on!";
            }

            return "Offline only mode is now off!";

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}