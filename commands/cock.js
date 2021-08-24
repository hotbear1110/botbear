module.exports = {
    name: "cock",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            return `Okayge cock!`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}