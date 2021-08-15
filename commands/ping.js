module.exports = {
    name: "ping",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            return `FeelsDankMan pong!`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}