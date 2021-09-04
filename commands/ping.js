module.exports = {
    name: "ping",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const latency = await tools.query(`SELECT Latency FROM Latency ORDER BY id DESC LIMIT 1`);

            return `nymnDank pong! - ${latency}s`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}