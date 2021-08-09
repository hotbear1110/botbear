module.exports = {
    name: "ping",
    execute: async (channel, user, input) => {
        try {
            return `FeelsDankMan pong!`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}