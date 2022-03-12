const tools = require("../tools/tools.js");

module.exports = {
    name: "enablenewcommands.js",
    ping: true,
    description: 'Decide if you want new commands to be enabled or disabled as default',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (!user.mod && channel !== user.username && user['user-id'] != process.env.TWITCH_OWNERUID) {
                return;
            }
            switch (input[2]) {
                case "true": {
                    const disableCommand = await tools.query(`SELECT command_default FROM Streamers WHERE username = ?`, [channel]);

                    if (disableCommand[0].command_default === 1) {
                        tools.query(`UPDATE Streamers SET command_default=? WHERE username=?`, [0, channel]);
                        return "New commands are now enabled by default";
                    } else {
                        return "New commands are already enabled by default";
                    }
                }
                    break;

                case "false": {
                    const disableCommand = await tools.query(`SELECT command_default FROM Streamers WHERE username = ?`, [channel]);

                    if (disableCommand[0].command_default === 0) {
                        tools.query(`UPDATE Streamers SET command_default=? WHERE username=?`, [1, channel]);
                        return "New commands are now disabled by default";
                    } else {
                        return "New commands are already disabled by default";
                    }
                }
                    break;

                default:
                    return `"bb enablenewcommands true/false" decide if you want new commands to be enabled or disabled as default`;
            }
        }
        catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}