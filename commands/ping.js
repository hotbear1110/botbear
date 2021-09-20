const tools = require("../tools/tools.js");

module.exports = {
    name: "ping",
    ping: true,
    showDelay: true,
    execute: async (channel, user, input, perm) => {
        try {
            const latency = await tools.query(`SELECT Latency FROM Latency ORDER BY id DESC LIMIT 1`);
            let delay = JSON.parse(latency[0].Latency);

            return `nymnDank pong! - Tmi delay: ${delay * 1000}ms - Internal delay:`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}