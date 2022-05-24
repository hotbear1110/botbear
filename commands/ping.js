const tools = require("../tools/tools.js");

module.exports = {
    name: "ping",
    ping: true,
    description: 'This command will make the bot respond with "pong!" and the tmi delay aswell as the internal delay, if the bot is online.',
    permission: 100,
    category: "Core command",
    showDelay: true,
    noBanphrase: true,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const latency = await tools.query(`SELECT Latency FROM Latency`);
            let delay = JSON.parse(latency[latency.length - 1].Latency);

            return `nymnDank pong! - Tmi delay: ${delay * 1000}ms - Internal delay:`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;
        }
    }
}