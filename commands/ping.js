module.exports = {
    name: "ping",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            return `nymnDank pong!`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}