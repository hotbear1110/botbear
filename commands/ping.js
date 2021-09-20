const tools = require("../tools/tools.js");

module.exports = {
    name: "ping",
    ping: true,
    description: "The bot responds 'pong' if it is online",
    permission: 100,
    showDelay: true,
    execute: async (channel, user, input, perm) => {
        try {
            if (this.permission > perm) {
                return;
            }
            const latency = await tools.query(`SELECT Latency FROM Latency ORDER BY id DESC LIMIT 1`);
            let delay = JSON.parse(latency[0].Latency);

            return `nymnDank pong! - Tmi delay: ${delay * 1000}ms - Internal delay:`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}