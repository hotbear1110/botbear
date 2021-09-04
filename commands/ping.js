const tools = require("../tools/tools.js");

module.exports = {
    name: "ping",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const latency = await tools.query(`SELECT Latency FROM Latency ORDER BY id DESC LIMIT 1`);
            let delay = JSON.parse(latency[0].Latency);

            return `nymnDank pong! - ${delay * 1000}ms`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}