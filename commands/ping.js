module.exports = {
    name: "ping",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            return `FeelsDonkMan pong!`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}