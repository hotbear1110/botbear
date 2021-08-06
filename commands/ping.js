module.exports = {
    name: "name",
    execute: async (data, input) => {
        try {
            return `FeelsDankMan pong!`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}